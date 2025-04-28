export enum DonationStatus {
  NEW = 'NEW',
  PENDING = 'PENDING',
  DONE = 'DONE',
}

export interface IOrder {
  id: string;
  orderId: number;
  price: number;
  comment: string;
  status: DonationStatus;
  updatedAt?: string;
  createdAt?: string;
}

export interface IOrderInput {
  id: string;
  status: DonationStatus;
}
