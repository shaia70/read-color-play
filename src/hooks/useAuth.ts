
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

const AUTH_STORAGE_KEY = 'shelley_auth_user';
const USERS_STORAGE_KEY = 'shelley_users';

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getStoredUsers = (): User[] => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error reading users from localStorage:', err);
      return [];
    }
  };

  const saveUser = (newUser: User): void => {
    try {
      const existingUsers = getStoredUsers();
      const userIndex = existingUsers.findIndex(u => u.email === newUser.email);
      
      if (userIndex >= 0) {
        existingUsers[userIndex] = newUser;
      } else {
        existingUsers.push(newUser);
      }
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));
      console.log('User saved to localStorage:', newUser);
    } catch (err) {
      console.error('Error saving user to localStorage:', err);
    }
  };

  useEffect(() => {
    // Check for existing session on app start
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists
      const users = getStoredUsers();
      let existingUser = users.find(u => u.email === email);
      
      if (!existingUser) {
        // Create new user if doesn't exist
        existingUser = {
          id: `user_${Date.now()}`,
          email,
          name: email.split('@')[0]
        };
        saveUser(existingUser);
      }
      
      setUser(existingUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(existingUser));
      
      console.log('User logged in successfully:', existingUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: `user_${Date.now()}`,
        email,
        name: name || email.split('@')[0]
      };
      
      saveUser(userData);
      setUser(userData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      
      console.log('User registered successfully:', userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Note: Not removing user data or payments, just the auth session
    console.log('User logged out');
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
