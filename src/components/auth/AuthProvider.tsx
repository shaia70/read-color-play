
import React from 'react';
import { AuthContext, useAuthProvider } from '@/hooks/useAuth';
import { SessionMonitor } from '@/components/security/SessionMonitor';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthProvider();
  
  return (
    <AuthContext.Provider value={auth}>
      <SessionMonitor />
      {children}
    </AuthContext.Provider>
  );
};
