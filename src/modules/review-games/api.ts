import http from 'services/api';
import { ReviewGame, ReviewGameEditBody, ReviewGameInput } from './types';

export const GetReviewGamesList = async (currentPage: number) => {
  return await http.get(`/reviews?page=${currentPage}`);
};

export const CreateReviewGame = async (values: ReviewGameInput) => {
  return await http.post<{ data: ReviewGame }>(`/reviews/`, values);
};

export const EditReviewGame = async ({ values, id }: ReviewGameEditBody) => {
  return await http.patch(`/reviews/${id}`, values);
};

export const DeleteReviewGame = async (id: string) => {
  return await http.delete(`/reviews/${id}`);
};
