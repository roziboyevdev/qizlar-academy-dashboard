export enum VacancyType {
  ONE_TIME ='one_time',
  FULL_TIME ='full_time',
  INTERN ='intern',
  EMPTY ='',
} 
export interface Vacancy {
  id: string;
  title: string;
  description:string;
  company: string;
  salary: number;
  type?: VacancyType;
  from_experience: number;
  to_experience: number;
  tags:string[];
}

export interface VacancyInput {
  title: string;
  description:string;
  company: string;
  salary: number;
  type: VacancyType;
  from_experience: number;
  to_experience: number;
  tags:string[];
}

export interface VacancyEditBody {
  id: string;
  values: VacancyInput;
}
