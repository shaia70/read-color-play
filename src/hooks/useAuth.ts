
import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app start
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual authentication
      // For now, simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0]
      };
      
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: `user_${Date.now()}`,
        email,
        name: name || email.split('@')[0]
      };
      
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem(`payment_${user?.id}`);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    register
  };
};

export { AuthContext };
