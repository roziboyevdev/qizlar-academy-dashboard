import http from 'services/api';
import { IMarketPromocodeInput, IMarketPromocodeEditBody } from './types';

export const GetDatasList = async () => {
  return await http.get(`/fortuna/promocode`);
};

export const CreateData = async (values: IMarketPromocodeInput) => {
  return await http.post(`/fortuna/promocode`, values);
};
export const GenerateData = async (count: number) => {
  return await http.post(`/promocode/generate/${count}`);
};

export const EditData = async ({ values, id }: IMarketPromocodeEditBody) => {
  return await http.patch(`/banner/${id}`, values);
};

export const DeleteData = async (id: string) => {
  return await http.delete(`/banner/${id}`);
};
