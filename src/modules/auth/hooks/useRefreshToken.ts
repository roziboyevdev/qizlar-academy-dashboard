import { useContext, useEffect, useState } from 'react';

import { AuthContext } from 'providers/auth';
import { UserContext } from 'providers/UserProvider';
import http from 'services/api';
import { clearAuthStorage } from 'utils/clearAuthStorage';

export const useRefreshToken = () => {
  const [authChecking, setAuthChecking] = useState(true);

  const { setIsAuthenticated } = useContext(AuthContext);
  const { setUserData } = useContext(UserContext);
  const token = localStorage.getItem('access');
  useEffect(() => {
    if (token) {
      http.defaults.headers.common = {
        Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
      };
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUserData(null);
      clearAuthStorage();
    }

    setAuthChecking(false);
  }, [token]);

  return {
    isLoading: authChecking,
  };
};
