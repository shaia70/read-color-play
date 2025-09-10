-- Create session tracking table for security
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_active TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  location_info JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for session management
CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all sessions" 
ON public.user_sessions 
FOR ALL 
USING (true);

-- Create index for performance
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_sessions_active ON public.user_sessions(user_id, is_active);

-- Create function to clean expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.user_sessions 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;
  
  DELETE FROM public.user_sessions 
  WHERE expires_at < (now() - INTERVAL '7 days');
$$;

-- Create function to validate session and prevent sharing
CREATE OR REPLACE FUNCTION public.validate_user_session(
  p_user_id UUID,
  p_session_token TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS TABLE(
  is_valid BOOLEAN,
  should_logout BOOLEAN,
  message TEXT,
  suspicious_activity BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_record RECORD;
  active_sessions_count INTEGER;
  different_ip_sessions INTEGER;
BEGIN
  -- Check if session exists and is active
  SELECT * INTO session_record
  FROM public.user_sessions
  WHERE user_id = p_user_id 
    AND session_token = p_session_token 
    AND is_active = true 
    AND expires_at > now();
    
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, true, 'Session not found or expired'::text, false;
    RETURN;
  END IF;
  
  -- Count active sessions for this user
  SELECT COUNT(*) INTO active_sessions_count
  FROM public.user_sessions
  WHERE user_id = p_user_id 
    AND is_active = true 
    AND expires_at > now();
    
  -- Check for sessions from different IP addresses
  SELECT COUNT(DISTINCT ip_address) INTO different_ip_sessions
  FROM public.user_sessions
  WHERE user_id = p_user_id 
    AND is_active = true 
    AND expires_at > now()
    AND ip_address IS NOT NULL;
    
  -- Deactivate old sessions if more than 2 active sessions
  IF active_sessions_count > 2 THEN
    UPDATE public.user_sessions 
    SET is_active = false
    WHERE user_id = p_user_id 
      AND session_token != p_session_token
      AND is_active = true
      AND created_at < (
        SELECT created_at FROM public.user_sessions 
        WHERE session_token = p_session_token
      );
  END IF;
  
  -- Update session activity
  UPDATE public.user_sessions 
  SET 
    last_active = now(),
    ip_address = COALESCE(p_ip_address, ip_address),
    user_agent = COALESCE(p_user_agent, user_agent)
  WHERE session_token = p_session_token;
  
  -- Check for suspicious activity (more than 2 different IPs)
  IF different_ip_sessions > 2 THEN
    RETURN QUERY SELECT true, false, 'Multiple locations detected'::text, true;
  ELSE
    RETURN QUERY SELECT true, false, 'Session valid'::text, false;
  END IF;
END;
$$;

-- Create function to create new session
CREATE OR REPLACE FUNCTION public.create_user_session(
  p_user_id UUID,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_device_fingerprint TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_token TEXT;
  existing_sessions_count INTEGER;
BEGIN
  -- Generate unique session token
  session_token := encode(gen_random_bytes(32), 'hex');
  
  -- Count existing active sessions
  SELECT COUNT(*) INTO existing_sessions_count
  FROM public.user_sessions
  WHERE user_id = p_user_id 
    AND is_active = true 
    AND expires_at > now();
    
  -- If user has more than 1 active session, deactivate the oldest ones
  IF existing_sessions_count >= 1 THEN
    UPDATE public.user_sessions 
    SET is_active = false
    WHERE user_id = p_user_id 
      AND is_active = true
      AND id NOT IN (
        SELECT id FROM public.user_sessions
        WHERE user_id = p_user_id 
          AND is_active = true 
          AND expires_at > now()
        ORDER BY created_at DESC
        LIMIT 0  -- Keep 0 sessions, deactivate all
      );
  END IF;
  
  -- Insert new session
  INSERT INTO public.user_sessions (
    user_id,
    session_token,
    ip_address,
    user_agent,
    device_fingerprint
  ) VALUES (
    p_user_id,
    session_token,
    p_ip_address,
    p_user_agent,
    p_device_fingerprint
  );
  
  RETURN session_token;
END;
$$;

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION public.update_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_session_updated_at();