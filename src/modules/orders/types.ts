export enum DonationStatus {
  NEW = 'NEW',
  PENDING = 'PENDING',
  DONE = 'DONE',
}

interface User {
  firstname: string;
  lastname: string;
  phone: string;
}

export interface IOrder {
  id: string;
  orderId: number;
  price: number;
  comment: string;
  status: DonationStatus;
  user?: User | null;
  updatedAt?: string;
  createdAt?: string;
}

export interface IOrderInput {
  id: string;
  status: DonationStatus;
}
