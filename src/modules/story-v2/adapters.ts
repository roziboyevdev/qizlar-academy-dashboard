import { MediaType, StoryV2Type } from './types';

function pickStr(...vals: unknown[]): string {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

function num(v: unknown): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export const getData = (item?: Record<string, unknown>): StoryV2Type => {
  const row = item ?? {};
  const typeRaw = String(row.mediaType ?? '').toUpperCase();
  const mediaType = typeRaw === 'VIDEO' ? MediaType.VIDEO : MediaType.IMAGE;

  return {
    id: String(row.id ?? ''),
    title: row.title === undefined || row.title === null ? null : String(row.title),
    mediaUrl: pickStr(row.mediaUrl),
    mediaType,
    expiresAt: pickStr(row.expiresAt),
    viewCount: num(row.viewCount),
    likeCount: num(row.likeCount),
    createdAt: pickStr(row.createdAt),
  };
};

export const getDatasList = (data?: unknown) => {
  const list = Array.isArray(data) ? data : data != null ? [data] : [];
  return list.length ? list.map((row) => getData(row as Record<string, unknown>)) : [];
};
