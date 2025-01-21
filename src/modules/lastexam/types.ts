
export interface Question {
  id: string;
  value: string;
}



export interface Option {
  value: string;
  is_correct: boolean;
}

export interface Quiz {
  id: string;
  course: string;
  question:string;
  options: Option[];
}

export interface QuizInput {
  course: string;
  question: string;
  options: { value: string; is_correct: boolean }[];
}

export interface QuizEditBody {
  id: string;
  values: QuizInput;
}
