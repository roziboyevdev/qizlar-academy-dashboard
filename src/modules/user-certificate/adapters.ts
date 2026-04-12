import type { ICertificateUser, IUserCertificate } from './types';

const mapUser = (raw: unknown): ICertificateUser | null => {
  if (!raw || typeof raw !== 'object') return null;
  const u = raw as Record<string, unknown>;
  return {
    id: String(u.id ?? ''),
    firstname: String(u.firstname ?? ''),
    lastname: String(u.lastname ?? ''),
    phone: u.phone != null ? String(u.phone) : undefined,
    status: (u.status as ICertificateUser['status']) ?? null,
  };
};

export const getData = (item?: Partial<IUserCertificate> | null): IUserCertificate => {
  const rawCourse = item?.course as ({ name?: string; title?: string } | null | undefined);
  const course = rawCourse
    ? {
        name: String(rawCourse.name ?? rawCourse.title ?? ''),
        title: String(rawCourse.title ?? rawCourse.name ?? ''),
      }
    : null;

  return {
    id: String(item?.id ?? ''),
    uniqueId: Number(item?.uniqueId ?? 0),
    type: String(item?.type ?? ''),
    file: String(item?.file ?? ''),
    createdAt: String(item?.createdAt ?? ''),
    user: mapUser(item?.user),
    course,
  };
};

export const getDatasList = (data?: Partial<IUserCertificate>[] | null) => {
  if (!data?.length) return [];
  return data.map((row) => getData(row));
};
