
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, KeyRound } from "lucide-react";

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  password, 
  setPassword 
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex items-center">
      <div className="absolute left-3 text-gray-400">
        <KeyRound size={18} />
      </div>
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        id="admin-password"
        name="admin-password"
        autoComplete="current-password"
        className="text-left dir-ltr pl-10 pr-10"
      />
      <button 
        type="button"
        className="absolute right-2 p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={togglePasswordVisibility}
        tabIndex={-1}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
