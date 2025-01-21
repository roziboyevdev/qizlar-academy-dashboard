import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { useNavigate } from 'react-router';

import { useToast } from "components/ui/use-toast"
import { AuthContext } from 'providers/auth';
import http from 'services/api';

import { SignIn } from '../api';
import { type IApi } from '../types';

export const useSignIn = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const { toast } = useToast();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (values: IApi.SignIn) => SignIn(values),
    onSuccess: (data) => {
      console.log(data.data.data?.accessToken);
      
      http.defaults.headers.common = {
        Authorization: data.data.data?.accessToken,
      };
      localStorage.setItem('access', data.data.data?.accessToken);
      setIsAuthenticated(true);
      toast({
        variant: "success",
        title: "Muvaffaqiyat!",
        description: "UstozAI platformasiga xush kelibsiz!",
      })
      navigate('/');
    },
    onError: (error: any) => {
      localStorage.clear();
      console.log(error.message);
      
      toast({
        variant: "destructive",
        title: "Xatolik!",
        description: error.message,
      })
    
      setIsAuthenticated(false);
    },
  });

  return {
    triggerSignIn: mutate,
    isPending,
    isSuccess,
    isError
  };
};
