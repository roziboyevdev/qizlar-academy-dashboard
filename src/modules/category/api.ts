import http from 'services/api';
import { CategoryInputType, CategoryEditBodyType } from './types';

const slugify = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '') || 'category';

export const GetDatasList = async (pageNumber: number, pageSize = 20) => {
  return await http.get(`/product-category`, { params: { pageNumber, pageSize } });
};

export const CreateData = async (values: CategoryInputType) => {
  const name = values.title;
  return await http.post(`/product-category`, {
    name,
    slug: slugify(name),
  });
};

export const EditData = async ({ values, id }: CategoryEditBodyType) => {
  const name = values.title;
  return await http.patch(`/product-category/${id}`, {
    name,
    slug: slugify(name),
  });
};

export const DeleteData = async (id: string) => {
  return await http.delete(`/product-category/${id}`);
};
