
import React from "react";
import { Card } from "@/components/ui/card";

interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return (
    <Card className="w-full max-w-md shadow-lg border-blue-100">
      {children}
    </Card>
  );
};

export default AuthCard;
