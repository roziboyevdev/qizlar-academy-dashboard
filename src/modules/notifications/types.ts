import { BannerType } from 'modules/banner/types';

export interface Notification {
  id: string;
  title: string;
  content?: string;
  body?: string;
  photo?: string;
  type?: BannerType;
  link?: string | null;
  objectId?: string | null;
  createdAt: string;
  deliveredCount?: number;
  openedCount?: number;
}

export interface NotificationInput {
  title: string;
  content?: string;
  body?: string;
  photo?: string;
  type?: BannerType;
  link?: string | null;
  objectId?: string | null;
  userId?: string;
}

export interface UserPushNotification {
  title: string;
  body: string;
  imageUrl?: string;
  data?: {
    screen?: string;
    courseId?: string;
  };
}

export interface NotificationEditBody {
  id: string;
  values: NotificationInput;
}
