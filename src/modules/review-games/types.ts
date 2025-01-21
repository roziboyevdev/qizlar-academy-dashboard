export interface ReviewGame {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  short_description: string;
  youtube_link: string;
  date: string;
}

export interface ReviewGameInput {
  title: string;
  thumbnail: string;
  description: string;
  youtube_link: string;
}

export interface ReviewGameEditBody {
  id: string;
  values: ReviewGameInput;
}
