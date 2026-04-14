import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast } from "components/ui/use-toast"
import { AuthContext } from 'providers/auth';
import { UserContext } from 'providers/UserProvider';
import { clearAuthStorage } from 'utils/clearAuthStorage';

export const useSignOut = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const { setUserData } = useContext(UserContext);
  const { toast } = useToast();

  const triggerSignOut = () => {
    clearAuthStorage();
    setUserData(null);
    setIsAuthenticated(false);
    toast({
      variant: "success",
      title: "Muvaffaqiyat!",
      description: "Sessiya muvaffaqiyatli tugatildi!",
    });
    navigate('/');
  }

  return {
    triggerSignOut,
  };
};
