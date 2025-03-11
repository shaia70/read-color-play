
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type CustomButtonProps = {
  children: ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "blue" | "orange" | "green" | "purple" | "red";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onClick?: () => void;
  icon?: ReactNode;
};

export function CustomButton({
  children,
  variant = "default",
  size = "default",
  className,
  onClick,
  icon,
  ...props
}: CustomButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const getButtonClass = () => {
    switch (variant) {
      case "blue":
        return "bg-shelley-blue hover:bg-shelley-blue/90 text-white";
      case "orange":
        return "bg-shelley-orange hover:bg-shelley-orange/90 text-white";
      case "green":
        return "bg-shelley-green hover:bg-shelley-green/90 text-white";
      case "purple":
        return "bg-shelley-purple hover:bg-shelley-purple/90 text-white";
      case "red":
        return "bg-shelley-red hover:bg-shelley-red/90 text-white";
      default:
        return "";
    }
  };

  return (
    <Button
      variant={["blue", "orange", "green", "purple", "red"].includes(variant) ? "default" : variant}
      size={size}
      className={cn(
        "font-heebo font-medium rounded-full transition-all duration-300 transform hover:scale-105",
        getButtonClass(),
        className
      )}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Button>
  );
}
