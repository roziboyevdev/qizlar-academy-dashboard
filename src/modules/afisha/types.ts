export interface Afisha {
  id: string;
  title: string;
  content: string;
  short_description: string;
  photo: string;
  date: string;
}

export interface AfishaInput {
  title: string;
  content: string;
  short_description: string;
  photo: string;
}

export interface AfishaEditBody {
  id: string;
  values: AfishaInput;
}
