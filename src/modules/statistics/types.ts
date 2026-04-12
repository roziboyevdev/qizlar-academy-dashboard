export interface DailyData {
  count: number;
  date: Date;
  amount: number;
}

/** `/statistics/main` javobi */
export interface IOwerviewData {
  users: number;
  completedStudents: number;
  startedStudents: number;
  videos: number;
}

export enum AuthType {
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
  EMAIL = 'EMAIL',
}
// export interface IMonthlyOwerviewData {
//   users: number;
//   lessons: number;
//   courses: number;
//   views: number;
//   quizes: number;
//   certificates: number;
//   gender: {
//     Ayol: number;
//     Erkak: number;
//   };
// }
export interface IMonthlyOwerviewData {
  users: {
    all: number;
    monthly: number;
  };
  lessons: {
    all: number;
    monthly: number;
  };
  certificates: {
    all: number;
    monthly: number;
  };
  quizes: {
    all: number;
    monthly: number;
  };
  views: {
    all: number;
    monthly: number;
  };
  courses: {
    all: number;
    monthly: number;
  };
  gender: {
    Ayol: {
      all: number;
      monthly: number;
    };
    Erkak: {
      all: number;
      monthly: number;
    };
  };
  dau: {
    dau: number;
    mau: number;
    dauMauRate: number;
    churnRate: number;
  };
}

/** `/statistics/count-by-area` va `/statistics/count-by-district` javobi */
export type AreaSortBy = 'profiles' | 'startedCourses' | 'certificates' | 'certifiedUsers';

export interface IAreaStat {
  id: number;
  name: string;
  profiles: number;
  startedCourses: number;
  certificates: number;
  certifiedUsers: number;
  tin?: number;
  kod?: number;
}

export interface IAreaStatPaginated {
  data: IAreaStat[];
  meta: {
    pagination: {
      count: number;
      pageCount: number;
      pageNumber: number;
      pageSize: number;
    };
  };
}
