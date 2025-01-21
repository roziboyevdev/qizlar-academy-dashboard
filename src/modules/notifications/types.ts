export interface Notification {
  id: string;
  title: string;
  body: string;
  image?: string;
  type?: NotificationType;
  entityid?: string;
  date: string;
}

export interface NotificationInput {
  title: string;
  body: string;
  image?: string;
  type?: NotificationType;
  entityid?: string;
}

export interface NotificationEditBody {
  id: string;
  values: NotificationInput;
}

export enum NotificationType {
  AFISHA = 'afisha',
  TOURNAMENT = 'tournament',
  REVIEW = 'review',
  LIVE = 'live',
  NEWS = 'news',
  GRANDMASTER = 'grandmaster',
  BOOK = 'book',
  COURSE = 'course',
  MODULE = 'module',
}
