/** GET /certificate/users — query: `status` */
export type UserCallStatus = 'NOT_CALLED' | 'CALLED_NO_ANSWER' | 'TALKED';

/** GET /certificate/users — query: `type` */
export type CertificateMedalType = 'GOLD' | 'SILVER' | 'BRONZE';

/** `CertificateUserDto` (Swagger) */
export interface ICertificateUser {
  id: string;
  firstname: string;
  lastname: string;
  phone?: string;
  status?: UserCallStatus | null;
}

/** `CertificateUserCourseDto` (Swagger) — faqat `name` */
export interface ICertificateUserCourse {
  name: string;
  /** UI uchun adapter `name`dan to‘ldiradi */
  title?: string;
}

/** `CertificateUserItemResponseDto` (Swagger) */
export interface IUserCertificate {
  id: string;
  uniqueId: number;
  type: CertificateMedalType | string;
  file: string;
  createdAt: string;
  user: ICertificateUser | null;
  course: (ICertificateUserCourse & { title?: string }) | null;
}

export type CertificateUserListFilters = {
  search?: string;
  type?: CertificateMedalType;
  status?: UserCallStatus;
  startDate?: string;
  endDate?: string;
  /** Swagger: `neighborhoodId` */
  neighborhoodId?: number;
};
