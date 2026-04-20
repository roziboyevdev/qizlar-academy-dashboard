import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from 'components/ui/use-toast';
import { AuthContext } from 'providers/auth';
import http from 'services/api';
import { SignIn } from '../api';
import { IAuthData, UserRole, type IApi } from '../types';
import { UserContext } from 'providers/UserProvider';
import { clearAuthStorage } from 'utils/clearAuthStorage';

export const useSignIn = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const { setUserData } = useContext(UserContext);
  const { toast } = useToast();

  const getSafeNextPath = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('next');
      if (!raw) return null;
      const decoded = decodeURIComponent(raw);
      // Faqat ichki (same-origin) relative pathlarga ruxsat
      if (!decoded.startsWith('/')) return null;
      if (decoded.startsWith('//')) return null;
      return decoded;
    } catch {
      return null;
    }
  };

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (values: IApi.SignIn) =>
      SignIn(values).then((res) => ({
        ...res.data.data,
        role: (res.data.data?.role as UserRole | undefined) ?? UserRole.SUPER_ADMIN,
      })),
    onSuccess: (data: IAuthData) => {
      setUserData(data);

      http.defaults.headers.common = {
        Authorization: `Bearer ${data?.accessToken}`,
      };

      localStorage.setItem('access', data?.accessToken);
      if (data?.refreshToken) {
        localStorage.setItem('refresh', data.refreshToken);
      }
      localStorage.setItem('role', data.role);
      setIsAuthenticated(true);
      toast({
        variant: 'success',
        title: 'Muvaffaqiyat!',
        description: 'Qizlar Akademiyasi admin paneliga xush kelibsiz!',
      });
      const nextPath = getSafeNextPath();
      if (nextPath) {
        navigate(nextPath, { replace: true });
        return;
      }
      if (data.role == UserRole.NOTIFICATION_ADMIN) {
        navigate('/notifications');
      } else if (data.role == UserRole.STATISTICS_ADMIN) {
        navigate('/dashboard');
      } else if (data.role == UserRole.COURSE_ADMIN) {
        navigate('/kurslar');
      } else if (data.role == UserRole.SHOP_ADMIN) {
        navigate('/orders');
      } else if (data.role == UserRole.SUPER_ADMIN) {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    },
    onError: (error: any) => {
      clearAuthStorage();
      setUserData(null);

      toast({
        variant: 'destructive',
        title: 'Xatolik!',
        description: error.message,
      });

      setIsAuthenticated(false);
    },
  });

  return {
    triggerSignIn: mutate,
    isPending,
    isSuccess,
    isError,
  };
};
