
import { Button } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@/lib/utils";

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

interface CustomButtonProps extends BaseButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "blue" | "orange" | "green" | "purple" | "red";
  size?: "default" | "sm" | "lg" | "icon";
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant, size, children, icon, ...props }, ref) => {
    const buttonClasses = cn(
      "transition-all duration-200",
      {
        "bg-shelley-blue hover:bg-shelley-blue/90": variant === "blue",
        "bg-shelley-orange hover:bg-shelley-orange/90": variant === "orange",
        "bg-shelley-green hover:bg-shelley-green/90": variant === "green",
        "bg-shelley-purple hover:bg-shelley-purple/90": variant === "purple",
        "bg-shelley-red hover:bg-shelley-red/90": variant === "red",
      },
      className
    );

    return (
      <Button
        ref={ref}
        variant={variant as "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"}
        size={size}
        className={buttonClasses}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";

