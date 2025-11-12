import { TaskEvent, TaskFrequency, TaskType } from './constants';

export interface IMarketTask {
  id: string;
  photo: string;
  points: number;
  title: string;
  description: string;
  frequency: TaskFrequency;
  event: TaskEvent;
  type: TaskType;
  surveyId?: string;
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
  createdAt: string;
}

export interface IMarketTaskInput {
  photo: string;
  points: number;
  title: string;
  description: string;
  frequency: TaskFrequency;
  event: TaskEvent;
  type: TaskType;
  surveyId?: string;
  isActive?: boolean;
  startsAt?: string;
  endsAt?: string;
}

export interface IMarketTaskEditBody {
  id: string;
  values: IMarketTaskInput;
}

export interface ISurvey {
  id: string;
  title: string;
  description?: string;
}
