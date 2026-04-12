import http from 'services/api';

export const GetStockByVariantId = async (variantId: string) => {
  return await http.get(`/stock/${variantId}`);
};

export const UpdateStock = async (variantId: string, quantity: number) => {
  return await http.patch(`/stock/${variantId}`, { quantity });
};
