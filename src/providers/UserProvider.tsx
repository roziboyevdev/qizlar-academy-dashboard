import { IAuthData } from 'modules/auth/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  isAuthenticated: boolean;
  userData: IAuthData | null;
  setUserData: (data: IAuthData | null) => void;
}

export const UserContext = createContext<UserContextType>({
  isAuthenticated: false,
  userData: null,
  setUserData: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<IAuthData | null>(null);

  const isAuthenticated = !!userData?.accessToken;

  useEffect(() => {
    const storedAuth = localStorage.getItem('userData');
    if (!storedAuth) return;
    try {
      setUserData(JSON.parse(storedAuth) as IAuthData);
    } catch {
      localStorage.removeItem('userData');
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      // localStorage.removeItem('userData');
    }
  }, [userData]);

  return <UserContext.Provider value={{ isAuthenticated, userData, setUserData }}>{children}</UserContext.Provider>;
};
