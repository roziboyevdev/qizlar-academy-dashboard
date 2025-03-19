import http from 'services/api';


export const GetDatasList = async (currentPage:number) => {
  return await http.get(`certificate/users?pageSize=10&pageNumber=${currentPage}`);
};

