import http from "services/api";
import { IMeetingEditBody, IMeetingInput } from "./types";

export const GetMeetingsList = async () => {
  return await http.get(`/meeting/`);
};

export const CreateMeeting = async (values: IMeetingInput) => {
  return await http.post(`/meeting/`, values);
};

export const EditMeeting = async ({ values, id }: IMeetingEditBody) => {
  return await http.patch(`/meeting/${id}`, values);
};

export const DeleteMeeting = async (id: string) => {
  return await http.delete(`/meeting/${id}`);
};
