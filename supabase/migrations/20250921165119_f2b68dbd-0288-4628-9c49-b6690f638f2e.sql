-- Fix security issue: Teacher Login Tokens Could Be Stolen by Hackers
-- Remove existing overly permissive policies and replace with secure ones

-- Drop all existing policies for teacher_login_tokens
DROP POLICY IF EXISTS "Service roles can select login tokens for validation" ON public.teacher_login_tokens;
DROP POLICY IF EXISTS "Teachers can view their own login tokens" ON public.teacher_login_tokens;
DROP POLICY IF EXISTS "Service roles can insert login tokens" ON public.teacher_login_tokens;
DROP POLICY IF EXISTS "Service roles can update login tokens" ON public.teacher_login_tokens;
DROP POLICY IF EXISTS "Admins can delete expired login tokens" ON public.teacher_login_tokens;

-- Create new secure policies that prevent public access to authentication tokens

-- Allow service role (system) to manage tokens for validation - NO PUBLIC ACCESS
CREATE POLICY "System can manage login tokens for validation" ON public.teacher_login_tokens
FOR ALL 
USING (auth.uid() IS NULL)  -- Only service role (no user context)
WITH CHECK (auth.uid() IS NULL);

-- Allow teachers to view ONLY their own tokens (not all tokens)
CREATE POLICY "Teachers can view only their own tokens" ON public.teacher_login_tokens
FOR SELECT 
USING (
  auth.uid() = teacher_id 
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('teacher', 'admin')
  )
);

-- Allow admins to manage tokens (for administrative purposes)
CREATE POLICY "Admins can manage all tokens" ON public.teacher_login_tokens
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Log the security fix
INSERT INTO public.security_audit_log (action, resource, details)
VALUES (
  'security_fix_applied',
  'teacher_login_tokens',
  jsonb_build_object(
    'issue', 'Teacher Login Tokens Could Be Stolen by Hackers',
    'fix', 'Restricted RLS policies to prevent public token access',
    'timestamp', now()
  )
);