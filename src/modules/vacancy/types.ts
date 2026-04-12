/** `VacancyController_findAll` / `create` — `category` */
export enum VacancyCategory {
  business = 'business',
  crafts = 'crafts',
  itMedia = 'itMedia',
  education = 'education',
  legal = 'legal',
  psychology = 'psychology',
  health = 'health',
  family = 'family',
}

/** `currency` */
export enum VacancyCurrency {
  UZS = 'UZS',
  USD = 'USD',
  EUR = 'EUR',
  RUB = 'RUB',
}

/** `type` — ish shakli */
export enum VacancyJobType {
  INTERN = 'INTERN',
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  REMOTE = 'REMOTE',
  ONSITE = 'ONSITE',
  CONTRACT = 'CONTRACT',
}

/** GET `/vacancy/:id` va ro‘yxat elementi — `FindOneVacancyResponseDto` */
export interface Vacancy {
  id: string;
  title: string;
  companyName: string | null;
  description: string;
  requirements: string;
  salaryFrom: number;
  salaryTo: number;
  category: VacancyCategory | null;
  currency: VacancyCurrency;
  location: string;
  type: VacancyJobType;
  contact: string;
  skills: string[];
  createdAt?: string;
}

/** POST body — `CreateVacancyDto` */
export interface VacancyInput {
  title: string;
  companyName: string;
  description: string;
  requirements: string;
  salaryFrom: number;
  salaryTo: number;
  category: VacancyCategory;
  currency: VacancyCurrency;
  location: string;
  type: VacancyJobType;
  contact: string;
  skills: string[];
}

export interface VacancyEditBody {
  id: string;
  values: Partial<VacancyInput>;
}

export type VacancyListQuery = {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  category?: VacancyCategory;
  currency?: VacancyCurrency;
  type?: VacancyJobType;
};
