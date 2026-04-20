# Lending Girls Dashboard (Next.js)

Bu loyiha `Next.js App Router` ga ko'chirilgan. Mavjud React Router ilova `src/legacy` va `src/legacy-pages` ichida ishlaydi.

## Ishga tushirish

```bash
npm install
npm run dev
```

App default holatda `http://localhost:3000` da ochiladi.

## Build

```bash
npm run build
npm run start
```

## SEO konfiguratsiyasi

- Global metadata: `src/app/layout.tsx`
- Robots: `src/app/robots.ts`
- Sitemap: `src/app/sitemap.ts`
- Canonical URL uchun env: `NEXT_PUBLIC_SITE_URL`

## Environment variablelar

Yangi nomlashda `NEXT_PUBLIC_*` ishlatiladi. Orqaga moslik uchun eski `REACT_APP_*` ham qo'llab-quvvatlanadi.

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_UPLOAD_URL`
- `NEXT_PUBLIC_IMAGE_URL`
- `NEXT_PUBLIC_SITE_URL`

## GitHub push

Clone lokal manbadan olingani uchun `origin` remotingizni GitHub URL ga almashtiring:

```bash
git remote set-url origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```
