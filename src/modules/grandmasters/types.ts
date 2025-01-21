export interface Grandmaster {
  id: string;
  full_name: string;
  description: string;
  image: string;
  video_url: string;
}

export interface GrandmasterInput extends Omit<Grandmaster, 'id'> {}

export interface GrandmasterEditBody {
  id: string;
  values: GrandmasterInput;
}
