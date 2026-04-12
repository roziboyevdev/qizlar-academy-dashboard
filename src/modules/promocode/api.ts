import http from 'services/api';

export const GetPromocodesList = async (params: { productId: string; isUsed?: boolean }) => {
  return await http.get('/promo-code', {
    params: {
      productId: params.productId,
      ...(params.isUsed !== undefined ? { isUsed: params.isUsed } : {}),
    },
  });
};

export const GetPromoCodeStats = async () => {
  return await http.get('/promo-code/stats');
};

export const UploadPromoCodesExcel = async (productId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return await http.post(`/promo-code/upload/${productId}`, formData);
};
