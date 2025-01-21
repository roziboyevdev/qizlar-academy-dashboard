import http from 'services/api';


export const GetDatasList = async (currentPage:number) => {
  return await http.get(`/donation?limit=10&page=${currentPage}`);
};

