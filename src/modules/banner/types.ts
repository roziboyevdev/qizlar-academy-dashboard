export enum BannerLocationType {
  HOME = 'HOME',
  SHOP = 'SHOP',
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
}
export interface Banner {
  id?: string;
  title: string;
  content: string;
  photo: string;
  mobilePhoto: string;
  type?: BannerType;
  location?: BannerLocationType;
  objectId?: string;
  link?: string;
}

export interface BannerInputType {
  title: string;
  content: string;
  photo: string;
  mobilePhoto: string;
  type?: BannerType;
  location?: BannerLocationType;
  objectId?: string;
  link?: string;
}

export interface BannerEditBodyType {
  id: string;
  values: BannerInputType;
}
