/** Admin buyurtma statuslari (Swagger Order) */
export type OrderAdminStatus =
  | 'PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

/** Eski nomlar bilan mos kelishi uchun */
export const DonationStatus = {
  PENDING: 'PENDING',
  DONE: 'PAID',
  CANCELED: 'CANCELLED',
} as const;

interface User {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
}
interface IProduct {
  title: string;
  count: number;
}

export interface IOrder {
  id: string;
  orderId: number;
  price: number;
  comment: string;
  status: OrderAdminStatus;
  user?: User | null;
  product?: IProduct | null;
  updatedAt?: string;
  createdAt?: string;
}

export interface IOrderInput {
  id: string;
  status: OrderAdminStatus;
}

export interface OrdersCreateType {
  userId: string;
  productId: string;
}

export interface IOrdersFilter {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  createdAt: string;
  user: Record<string, unknown>;
  course: Record<string, unknown>;
}

export interface OrdersFormType {
  userId: string;
  courseId: string;
}
