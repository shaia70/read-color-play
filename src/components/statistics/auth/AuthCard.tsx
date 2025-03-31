
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className }) => {
  return (
    <Card className={cn("w-full max-w-md shadow-lg border-blue-100 overflow-hidden", className)}>
      {children}
    </Card>
  );
};

export default AuthCard;
