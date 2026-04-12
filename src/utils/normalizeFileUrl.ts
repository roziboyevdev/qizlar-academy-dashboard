import { baseImageUrl } from 'services/api';

const stripInvisible = (s?: string) => (s ?? '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();

/** Nisbiy kalitni to‘liq URLga aylantiradi (`REACT_APP_IMAGE_URL` → `baseImageUrl`). */
export default function normalizeImgUrl(fileUrl: string) {
  if (!fileUrl) return '';
  const trimmed = stripInvisible(fileUrl);
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const base = baseImageUrl.replace(/\/$/, '');
  return `${base}/${trimmed.replace(/^\//, '')}`;
}
