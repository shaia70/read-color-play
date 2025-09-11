
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useSessionSecurity } from './useSessionSecurity';
import { toast } from './use-toast';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return safe defaults instead of throwing during initialization
    return {
      user: null,
      session: null,
      isLoading: true,
      login: async () => {},
      logout: async () => {},
      register: async () => {}
    };
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { createSession, validateSession, destroySession, hasValidSession } = useSessionSecurity();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Defer user profile fetching to prevent deadlocks
          setTimeout(async () => {
            try {
              // Fetch user profile from our users table
              const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              if (profileError && profileError.code !== 'PGRST116') {
                console.error('Error fetching user profile:', profileError);
              }

              const userData: AuthUser = {
                id: session.user.id,
                email: session.user.email || '',
                name: profile?.name || session.user.user_metadata?.name
              };

              setUser(userData);

              // Validate or create secure session
              if (event === 'SIGNED_IN') {
                console.log('User signed in, creating secure session...');
                await createSession(session.user.id);
              } else if (hasValidSession) {
                console.log('Validating existing secure session...');
                const isValid = await validateSession(session.user.id);
                if (!isValid) {
                  console.log('Session validation failed, logging out...');
                  await supabase.auth.signOut();
                  return;
                }
              }
            } catch (authError) {
              console.error('Error in auth state change:', authError);
            }
          }, 0);
        } else {
          setUser(null);
          // Destroy session when user logs out
          if (event === 'SIGNED_OUT') {
            await destroySession();
          }
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [createSession, validateSession, destroySession, hasValidSession]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        console.log('Login successful:', data.user.id);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0]
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        console.log('Registration successful:', data.user.id);
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out and destroying secure session...');
      
      setUser(null);
      setSession(null);
      
      // Destroy secure session first
      await destroySession();
      
      // Then logout from Supabase
      await supabase.auth.signOut();
      
      toast({
        title: 'יציאה בוצעה בהצלחה',
        description: 'הסשן המאובטח הושמד'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    session,
    isLoading,
    login,
    logout,
    register
  };
};

export { AuthContext };
