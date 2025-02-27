export enum VacancyType {
  ONE_TIME ='ONE_TIME',
  FULL_TIME ='FULL_TIME',
  INTERN ='INTERNAL',
  EMPTY ='',
} 
export interface Vacancy {
  id: string;
  title: string;
  description:string;
  company: string;
  address: string;
  salary: number;
  type?: VacancyType;
  fromExperience: number;
  toExperience: number;
  skills:string[];
}

export interface VacancyInput {
  title: string;
  description:string;
  company: string;
  address: string;
  salary: number;
  type: VacancyType;
  fromExperience: number;
  toExperience: number;
  skills:string[];
}

export interface VacancyEditBody {
  id: string;
  values: VacancyInput;
}
