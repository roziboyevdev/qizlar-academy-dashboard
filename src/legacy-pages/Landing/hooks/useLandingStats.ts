import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';

import { GetOverview } from 'modules/statistics/api';
import type { IOwerviewData } from 'modules/statistics/types';

const STALE_MS = 5 * 60 * 1000;

/** Lenduing: kurslar / o‘qituvchilar soni (hozircha rasmiy ma’lumot). Keyin API ga ulash mumkin. */
export const LANDING_DISPLAY_COURSES_COUNT = 30;
export const LANDING_DISPLAY_TEACHERS_COUNT = 30;

/** Masalan: 945000 → «945 000» */
export function formatLandingStatInt(n: number): string {
  return n.toLocaleString('uz-Latn-UZ', { maximumFractionDigits: 0 });
}

async function fetchOverviewStudents(): Promise<number | null> {
  const res = await GetOverview();
  const raw = get(res, 'data.data') as IOwerviewData | undefined;
  if (!raw) return null;
  const u = raw.users;
  const s = raw.startedStudents;
  if (typeof u === 'number') return u;
  if (typeof s === 'number') return s;
  return null;
}

export function useLandingStats() {
  const overview = useQuery({
    queryKey: ['landing-stats', 'overview'],
    queryFn: fetchOverviewStudents,
    staleTime: STALE_MS,
    retry: 1,
  });

  return {
    studentsCount: overview.data ?? null,
    coursesCount: LANDING_DISPLAY_COURSES_COUNT,
    specialistsCount: LANDING_DISPLAY_TEACHERS_COUNT,
    studentsPending: overview.isPending,
    coursesPending: false,
    specialistsPending: false,
    isLoading: overview.isPending,
    isError: overview.isError,
    refetchAll: () => overview.refetch(),
  };
}
