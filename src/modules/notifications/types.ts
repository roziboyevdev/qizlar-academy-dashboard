export interface Notification {
  id: string;
  title: string;
  content?: string;
  body?: string;
  image?: string;
  photo?: string;
  type?: NotificationType;
  entityid?: string;
  createdAt: string;
}

export interface NotificationInput {
  title: string;
  content?: string;
  body?: string;
  image?: string;
  photo?: string;
  type?: NotificationType;
  entityid?: string;
}

export interface NotificationEditBody {
  id: string;
  values: NotificationInput;
}

export enum NotificationType {
  AFISHA = "afisha",
  TOURNAMENT = "tournament",
  REVIEW = "review",
  LIVE = "live",
  NEWS = "news",
  GRANDMASTER = "grandmaster",
  BOOK = "book",
  COURSE = "course",
  MODULE = "module",
}
