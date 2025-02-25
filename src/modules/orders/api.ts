import http from 'services/api';


export const GetDatasList = async (currentPage:number) => {
  return await http.get(`/order?limit=10&page=${currentPage}`);
};

