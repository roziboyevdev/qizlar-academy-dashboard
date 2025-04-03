export interface DailyData {
  count: number;
  date: Date;
  amount: number;
}

export interface IOwerviewData {
  users: number;
  lessons: number;
  courses: number;
  courseViews: number;
  certificates: number;
  premiumAmount: number;
  donationAmount: number;
}

export interface IMonthlyOwerviewData {
  users: number;
  lessons: number;
  courses: number;
  views: number;
  quizes: number;
  certificates: number;
  gender: {
    Ayol: number;
    Erkak: number;
  };
}
