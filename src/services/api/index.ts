import axios from 'axios';
import { clearAuthStorage } from 'utils/clearAuthStorage';

const ENV = process.env;

/** Zero-width va boshqa ko'rinmas belgilarni olib tashlash */
const stripInvisible = (s?: string) => (s ?? '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();

/**
 * .env da faqat host berilsa ham to'g'ri ishlashi uchun: .../api/v1 qo'shiladi.
 * Agar allaqachon .../api/vN bilan tugasa, o'zgartirilmaydi.
 */
const normalizeApiBase = (input?: string): string => {
  const fallback = 'https://back.qizlarakademiyasi.uz/api/v1';
  const raw = stripInvisible(input);
  if (!raw) return fallback;
  const base = raw.replace(/\/+$/, '');
  if (/\/api\/v\d+$/i.test(base)) return base;
  return `${base}/api/v1`;
};

const defaultApiBase = 'https://back.qizlarakademiyasi.uz/api/v1';
const defaultR2 = 'https://pub-b6fcb2447c334506b2c5bc5f9b5e969f.r2.dev';

const http = axios.create({
  baseURL: normalizeApiBase(ENV.REACT_APP_API_BASE_URL) || defaultApiBase,
});

/** Yuklash / umumiy fayl yo‘li: avvalo upload base, keyin rasm base. */
export const baseMediaUrl = stripInvisible(
  ENV.REACT_APP_UPLOAD_URL || ENV.REACT_APP_IMAGE_URL || defaultR2
).replace(/\/$/, '');

/** Ko‘rsatiladigan rasmlar va media: `REACT_APP_IMAGE_URL` ustuvor. */
export const baseImageUrl = stripInvisible(
  ENV.REACT_APP_IMAGE_URL || ENV.REACT_APP_UPLOAD_URL || defaultR2
).replace(/\/$/, '');

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    if (error?.response?.status === 401) {
      const requestUrl = String(error?.config?.url ?? '');
      const isAuthRequest =
        requestUrl.includes('/admin/login') ||
        requestUrl.includes('/admin/refresh') ||
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/login');

      const hadToken = !!localStorage.getItem('access');
      clearAuthStorage();

      // Admin panel: token bor-yu backend 401 qaytarsa — login sahifasiga chiqarib yuboramiz.
      // Login oqimidagi 401 (noto'g'ri parol) uchun redirect qilmaymiz.
      if (hadToken && !isAuthRequest) {
        if (window.location.pathname === '/login') {
          throw error;
        }
        const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        const next = encodeURIComponent(path);
        window.location.replace(`/login?next=${next}`);
      }
    }

    throw error;
  }
);

/** @deprecated Eski loyihada v2 uchun ishlatilgan; yangi API faqat `/api/v1`. */
export const httpV2 = http;

export default http;
