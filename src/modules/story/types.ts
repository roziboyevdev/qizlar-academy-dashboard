export interface StoryType {
  id: string;
  title: string;
  link: string;
  cover: string;
  deadline: string;
  video: string;
  withId?:boolean;
  type?: string;
}


export interface StoryInputType {
  title: string;
  link: string;
  cover: string;
  deadline: string;
  video: string;
  withId:boolean;
  type: string;
}

export interface StoryEditBodyType {
  id: string;
  values: StoryInputType;
}

