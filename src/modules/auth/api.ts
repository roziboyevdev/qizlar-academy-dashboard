import http from 'services/api';
import { IApi } from './types';

export const SignIn = async (values: IApi.SignIn) => {
  return await http.post(`/admin/login`, {
    login: values.credentials,
    password: values.password,
  });
};
