import {
  Vacancy,
  VacancyCategory,
  VacancyCurrency,
  VacancyJobType,
} from './types';

function pick<T>(...vals: (T | null | undefined)[]): T | undefined {
  for (const v of vals) {
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeSkills(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s) => {
      if (typeof s === 'string') return s.trim();
      if (s && typeof s === 'object') {
        const o = s as Record<string, unknown>;
        const name = pick(String(o.name ?? ''), String(o.title ?? ''));
        return name?.trim() ?? '';
      }
      return '';
    })
    .filter(Boolean);
}

export const getVacancy = (item?: Record<string, unknown>): Vacancy => {
  const row = item ?? {};
  const categoryRaw = String(row.category ?? row.category_slug ?? '');
  const currencyRaw = String(row.currency ?? '').toUpperCase();
  const typeRaw = String(row.type ?? row.jobType ?? '').toUpperCase();

  const category = (Object.values(VacancyCategory) as string[]).includes(categoryRaw)
    ? (categoryRaw as VacancyCategory)
    : null;

  const currency = (Object.values(VacancyCurrency) as string[]).includes(currencyRaw)
    ? (currencyRaw as VacancyCurrency)
    : VacancyCurrency.UZS;

  const jobType = (Object.values(VacancyJobType) as string[]).includes(typeRaw)
    ? (typeRaw as VacancyJobType)
    : VacancyJobType.FULL_TIME;

  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    companyName:
      row.companyName != null
        ? String(row.companyName)
        : row.company != null
          ? String(row.company)
          : null,
    description: String(row.description ?? ''),
    requirements: String(row.requirements ?? row.requirement ?? ''),
    salaryFrom: num(row.salaryFrom ?? row.salary_from ?? row.salary, 0),
    salaryTo: num(row.salaryTo ?? row.salary_to, 0),
    category,
    currency,
    location: String(row.location ?? row.address ?? ''),
    type: jobType,
    contact: String(row.contact ?? row.phone ?? ''),
    skills: normalizeSkills(row.skills),
    createdAt: row.createdAt != null ? String(row.createdAt) : undefined,
  };
};

export const getVacanciesList = (data?: unknown[]) => {
  if (!data?.length) return [];
  return data.map((item) => getVacancy(item as Record<string, unknown>));
};
