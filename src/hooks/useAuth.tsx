
import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from './use-toast';
import { sendRegistrationEmail } from '@/services/emailService';
import { useLanguage } from '@/contexts/LanguageContext';

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

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
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
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { language } = useLanguage();

  React.useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Simple user data setup without complex session handling
          const userData: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const userData: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
        };
        setUser(userData);
        setSession(session);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
            name: name || email.split('@')[0],
            registration_email_sent: false,
            service: 'flipbook' // Track that this is a flipbook registration
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        console.log('Registration successful:', data.user.id);
        
        // Update user record to mark as registered for flipbook
        try {
          const { error: updateError } = await supabase
            .from('users')
            .update({ 
              registered_for_flipbook: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', data.user.id);

          if (updateError) {
            console.error('Error updating flipbook registration:', updateError);
          }
        } catch (dbError) {
          console.error('Database update error:', dbError);
        }
        
        // Send registration email only if user was created successfully
        try {
          await sendRegistrationEmail({
            name: name || email.split('@')[0],
            email: email,
            password: password
          }, language);
          
          console.log('Registration email sent successfully');
          
          // Update user metadata to mark email as sent
          const { error: updateError } = await supabase.auth.updateUser({
            data: { registration_email_sent: true }
          });
          
          if (updateError) {
            console.error('Error updating registration email status:', updateError);
          }
          
        } catch (emailError) {
          console.error('Error sending registration email:', emailError);
          // Don't throw error here as registration was successful
        }
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
      console.log('Logging out...');
      
      setUser(null);
      setSession(null);
      
      // Simple logout from Supabase
      await supabase.auth.signOut();
      
      toast({
        title: 'יציאה בוצעה בהצלחה',
        description: 'התנתקת מהמערכת'
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
