import http from 'services/api';
import { LiveStream, LiveStreamEditBody, LiveStreamInput } from './types';

export const GetLiveStreamsList = async () => {
  return await http.get(`/live-streams/`);
};

export const CreateLiveStream = async (values: LiveStreamInput) => {
  return await http.post<{ data: LiveStream }>(`/live-streams/`, values);
};

export const EditLiveStream = async ({ values, id }: LiveStreamEditBody) => {
  return await http.patch(`/live-streams/${id}`, values);
};

export const DeleteLiveStream = async (id: string) => {
  return await http.delete(`/live-streams/${id}`);
};
