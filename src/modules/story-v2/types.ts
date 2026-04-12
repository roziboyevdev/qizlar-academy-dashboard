export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

/** GET `/api/v1/story` — `StoryResponseDto` */
export interface StoryV2Type {
  id: string;
  title: string | null;
  mediaUrl: string;
  mediaType: MediaType;
  expiresAt: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
}

/** POST `CreateStoryDto` / PATCH `UpdateStoryDto` (maydonlar ixtiyoriy patchda) */
export interface StoryV2InputType {
  title?: string;
  mediaUrl: string;
  mediaType: MediaType;
  expiresAt: string;
}

export interface StoryV2EditBodyType {
  id: string;
  values: Partial<StoryV2InputType>;
}
