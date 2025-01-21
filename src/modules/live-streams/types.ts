export interface LiveStream {
  id: string;
  title: string;
  video_link: string;
  thumbnail: string;
  starts_at: string;
  ends_at: string;
}

export interface LiveStreamInput {
  title: string;
  thumbnail: string;
  video_link: string;
  starts_at: Date;
  ends_at: Date;
}

export interface LiveStreamEditBody {
  id: string;
  values: LiveStreamInput;
}
