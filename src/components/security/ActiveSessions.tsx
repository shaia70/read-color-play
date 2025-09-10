import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomButton } from '@/components/ui/CustomButton';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Monitor, MapPin, Clock, AlertTriangle, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SessionInfo {
  id: string;
  session_token: string;
  ip_address?: unknown;
  user_agent?: string;
  created_at: string;
  last_active: string;
  is_active: boolean;
  location_info?: any;
}

export const ActiveSessions: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isHebrew = language === 'he';

  const loadSessions = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      const { data: sessionsData, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_active', { ascending: false });

      if (error) {
        console.error('Error loading sessions:', error);
        toast({
          variant: "destructive",
          title: isHebrew ? 'שגיאה' : 'Error',
          description: isHebrew ? 'לא ניתן לטעון את רשימת הסשנים' : 'Failed to load sessions'
        });
        return;
      }

      setSessions(sessionsData || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(isHebrew ? 'he-IL' : 'en-US');
  };

  const getDeviceInfo = (userAgent?: string) => {
    if (!userAgent) return isHebrew ? 'לא ידוע' : 'Unknown';
    
    if (userAgent.includes('Mobile')) return isHebrew ? 'מכשיר נייד' : 'Mobile';
    if (userAgent.includes('Tablet')) return isHebrew ? 'טאבלט' : 'Tablet';
    return isHebrew ? 'מחשב' : 'Desktop';
  };

  const getBrowserInfo = (userAgent?: string) => {
    if (!userAgent) return isHebrew ? 'לא ידוע' : 'Unknown';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return isHebrew ? 'אחר' : 'Other';
  };

  const getSessionStatus = (lastActive: string) => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));
    
    if (diffMinutes < 5) return { status: 'active', text: isHebrew ? 'פעיל כעת' : 'Active now' };
    if (diffMinutes < 30) return { status: 'recent', text: isHebrew ? `פעיל לפני ${diffMinutes} דקות` : `Active ${diffMinutes} min ago` };
    return { status: 'inactive', text: isHebrew ? 'לא פעיל' : 'Inactive' };
  };

  if (!user) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isHebrew ? 'text-right' : 'text-left'}`}>
          <Shield className="w-5 h-5" />
          {isHebrew ? 'סשנים פעילים' : 'Active Sessions'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {isHebrew 
                ? `נמצאו ${sessions.length} סשנים פעילים`
                : `${sessions.length} active sessions found`
              }
            </div>
            <CustomButton 
              variant="outline" 
              size="sm" 
              onClick={loadSessions}
              disabled={isLoading}
            >
              {isHebrew ? 'רענון' : 'Refresh'}
            </CustomButton>
          </div>

          {isLoading && (
            <div className="text-center py-4 text-muted-foreground">
              {isHebrew ? 'טוען...' : 'Loading...'}
            </div>
          )}

          {!isLoading && sessions.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              {isHebrew ? 'לא נמצאו סשנים פעילים' : 'No active sessions found'}
            </div>
          )}

          <div className="space-y-3">
            {sessions.map((session) => {
              const sessionStatus = getSessionStatus(session.last_active);
              
              return (
                <div 
                  key={session.id} 
                  className="p-4 border rounded-lg space-y-2 bg-card"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        <span className="font-medium">
                          {getDeviceInfo(session.user_agent)} - {getBrowserInfo(session.user_agent)}
                        </span>
                        <Badge 
                          variant={sessionStatus.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {sessionStatus.text}
                        </Badge>
                      </div>
                      
                      {session.ip_address && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {isHebrew ? 'כתובת IP:' : 'IP Address:'} {String(session.ip_address)}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {isHebrew ? 'נוצר:' : 'Created:'} {formatDate(session.created_at)}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {isHebrew ? 'פעילות אחרונה:' : 'Last active:'} {formatDate(session.last_active)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {sessions.length > 1 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <div className="font-medium">
                    {isHebrew ? 'התראת אבטחה' : 'Security Notice'}
                  </div>
                  <div>
                    {isHebrew 
                      ? 'זוהו מספר סשנים פעילים. אם אתה לא זוכר שנכנסת ממכשירים אחרים, ייתכן שמישהו אחר משתמש בחשבון שלך.'
                      : 'Multiple active sessions detected. If you don\'t remember logging in from other devices, someone else might be using your account.'
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};