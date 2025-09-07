
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { CustomButton } from '@/components/ui/CustomButton';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { t, language } = useLanguage();
  const { login, register, isLoading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const isHebrew = language === 'he';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      onSuccess?.();
    } catch (err: any) {
      console.error('Authentication error:', err);
      
      // Handle specific error cases
      if (err.message?.includes('Invalid login credentials')) {
        setError(isHebrew ? 'שם משתמש או סיסמה שגויים' : 'Invalid email or password');
      } else if (err.message?.includes('User already registered')) {
        setError(isHebrew ? 'המשתמש כבר רשום במערכת. נסה להתחבר במקום' : 'User already registered. Try logging in instead');
        setIsLoginMode(true);
      } else if (err.message?.includes('Email not confirmed')) {
        setError(isHebrew ? 'נדרש אימות מייל. בדוק את תיבת המייל שלך או פנה למנהל המערכת' : 'Email confirmation required. Check your email or contact support');
      } else if (err.message?.includes('signup is disabled')) {
        setError(isHebrew ? 'הרשמה חדשה מושבתת כרגע' : 'New signups are currently disabled');
      } else {
        setError(isHebrew ? 'שגיאה באימות. נסה שוב' : 'Authentication error. Please try again');
      }
    }
  };

  return (
    <div className="glass-card p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLoginMode 
          ? (isHebrew ? 'התחברות' : 'Login')
          : (isHebrew ? 'הרשמה' : 'Register')
        }
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLoginMode && (
          <div>
            <label className="block text-sm font-medium mb-2">
              {isHebrew ? 'שם' : 'Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shelley-blue focus:border-transparent"
              required={!isLoginMode}
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-2">
            {isHebrew ? 'אימייל' : 'Email'}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shelley-blue focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            {isHebrew ? 'סיסמה' : 'Password'}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shelley-blue focus:border-transparent pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        
        <CustomButton
          type="submit"
          variant="blue"
          size="lg"
          className="w-full"
          icon={isLoginMode ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          disabled={isLoading}
        >
          {isLoading 
            ? (isHebrew ? 'מעבד...' : 'Processing...')
            : isLoginMode 
              ? (isHebrew ? 'התחבר' : 'Login')
              : (isHebrew ? 'הירשם' : 'Register')
          }
        </CustomButton>
      </form>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="text-shelley-blue hover:underline"
        >
          {isLoginMode 
            ? (isHebrew ? 'אין לך חשבון? הירשם' : "Don't have an account? Register")
            : (isHebrew ? 'יש לך חשבון? התחבר' : 'Have an account? Login')
          }
        </button>
      </div>
    </div>
  );
};
