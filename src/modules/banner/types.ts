export enum BannerLocationType {
  HOME = 'home',
  SHOP = 'shop',
}

export enum BannerType {
  COURSE = 'course',
  LEADERBOARD = 'leaderboard',
  PROFILE = 'profile',
  MY_COURSES = 'my-courses',
  SHOP = 'shop',
  LINK = 'link',
  CONTENT = 'content',
  NONE = 'none',
}
export interface Banner {
  id?: string;
  title: string;
  content: string;
  photo: string;
  type?: BannerType;
  location?: BannerLocationType;
  objectId?: string;
  link?: string;
}





export interface BannerInputType {
  title: string;
  content: string;
  photo: string;
  type?: BannerType;
  location?: BannerLocationType;
  objectId?: string;
  link?: string;
}

export interface BannerEditBodyType {
  id: string;
  values: BannerInputType;
}
