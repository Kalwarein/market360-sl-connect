import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [checkingModeration, setCheckingModeration] = useState(true);
  const [hasActiveModeration, setHasActiveModeration] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(true);
  const [checkingPhone, setCheckingPhone] = useState(true);

  useEffect(() => {
    if (user) {
      checkModeration();
      checkPhoneVerification();
    } else {
      setCheckingModeration(false);
      setCheckingPhone(false);
    }
  }, [user]);

  const checkPhoneVerification = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('phone_verified')
        .eq('id', user!.id)
        .single();

      if (error) throw error;

      setPhoneVerified(data?.phone_verified || false);
    } catch (error) {
      console.error('Error checking phone verification:', error);
    } finally {
      setCheckingPhone(false);
    }
  };

  const checkModeration = async () => {
    try {
      const { data, error } = await supabase
        .from('user_moderation')
        .select('*')
        .eq('user_id', user!.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Check if suspension has expired
        if (data.type === 'suspension' && data.expires_at) {
          const expiresAt = new Date(data.expires_at);
          if (expiresAt < new Date()) {
            // Suspension expired, deactivate it
            await supabase
              .from('user_moderation')
              .update({ is_active: false })
              .eq('id', data.id);
            
            setHasActiveModeration(false);
          } else {
            setHasActiveModeration(true);
          }
        } else {
          setHasActiveModeration(true);
        }
      }
    } catch (error) {
      console.error('Error checking moderation:', error);
    } finally {
      setCheckingModeration(false);
    }
  };

  if (loading || checkingModeration || checkingPhone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (hasActiveModeration) {
    return <Navigate to="/moderation" replace />;
  }

  // Allow access to verify-phone page without phone verification
  const currentPath = window.location.pathname;
  if (!phoneVerified && currentPath !== '/verify-phone') {
    return <Navigate to="/verify-phone" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;