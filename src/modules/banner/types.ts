export enum BannerLocationType {
  HOME = 'HOME',
  SHOP = 'SHOP',
  PORTFOLIO_LEADERBOARD = 'PORTFOLIO_LEADERBOARD',
}




export enum BannerType {
  COURSE = 'COURSE',
  LEADERBOARD = 'LEADERBOARD',
  PROFILE = 'PROFILE',
  MY_COURSES = 'MY_COURSES',
  SHOP = 'SHOP',
  LINK = 'LINK',
  CONTENT = 'CONTENT',
  NONE = 'NONE',
  REFERRAL = 'REFERRAL',
  VACANCY = 'VACANCY',
  PREMIUM = 'PREMIUM',
  VEBINAR = 'VEBINAR',
}

export interface Banner {
  id?: string;
  title: string;
  content: string;
  photo: string;
  /** Mobil banner rasmi (API / forma) */
  mobilePhoto?: string;
  type?: BannerType;
  location?: BannerLocationType;
  /** API v1: `targetId` */
  targetId?: string;
  /** Legacy */
  objectId?: string;
  link?: string;
  isActive?: boolean;
}

export interface BannerInputType {
  title: string;
  content: string;
  photo: string;
  type?: BannerType;
  location?: BannerLocationType;
  targetId?: string;
  link?: string;
  isActive?: boolean;
}

export interface BannerEditBodyType {
  id: string;
  values: BannerInputType;
}
