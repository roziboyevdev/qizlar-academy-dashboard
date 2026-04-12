import { httpV2 } from 'services/api';
import { StoryV2InputType, StoryV2EditBodyType } from './types';

export const GetDatasList = async (pageNumber = 1, pageSize = 100) => {
  return await httpV2.get(`/story`, { params: { pageNumber, pageSize } });
};

export const CreateData = async (values: StoryV2InputType) => {
  return await httpV2.post(`/story`, values);
};

export const EditData = async ({
  values,
  id,
}: StoryV2EditBodyType) => {
  return await httpV2.patch(`/story/${id}`, values);
};

export const DeleteData = async (id: string) => {
  return await httpV2.delete(`/story/${id}`);
};
