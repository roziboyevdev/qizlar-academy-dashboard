import { ColumnDef } from '@tanstack/react-table';
import type { CertificateMedalType, IUserCertificate, UserCallStatus } from 'modules/user-certificate/types';
import normalizeImgUrl from 'utils/normalizeFileUrl';
import { Button } from 'components/ui/button';

const CERT_TYPE_UZ: Record<string, string> = {
  GOLD: 'Oltin',
  SILVER: 'Kumush',
  BRONZE: 'Bronza',
};

const USER_STATUS_UZ: Record<UserCallStatus, string> = {
  NOT_CALLED: 'Qo‘ng‘iroq qilinmagan',
  CALLED_NO_ANSWER: 'Javobsiz',
  TALKED: 'Suhbatlashilgan',
};

function formatCreatedAt(iso: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('uz-UZ', { dateStyle: 'short', timeStyle: 'short' });
}

interface IProps {
  currentPage: number;
  onPreviewCertificate: (url: string) => void;
}

export const createDataColumns = ({ currentPage, onPreviewCertificate }: IProps): ColumnDef<IUserCertificate>[] => [
  {
    accessorKey: 'amount',
    header: 'T/R',
    cell: ({ row }) => row.index + 1 + (currentPage - 1) * 10,
  },
  {
    accessorKey: 'uniqueId',
    header: 'ID',
    cell: ({ row }) => <>{row.original.uniqueId || '—'}</>,
  },
  {
    accessorKey: 'user',
    header: 'Talaba',
    cell: ({ row }) => {
      const profile = row.original.user;
      return <>{profile ? `${profile.firstname} ${profile.lastname}`.trim() : '—'}</>;
    },
  },
  {
    accessorKey: 'course',
    header: 'Kurs',
    cell: ({ row }) => <>{row.original.course?.title || row.original.course?.name || '—'}</>,
  },
  {
    accessorKey: 'type',
    header: 'Tur',
    cell: ({ row }) => {
      const t = row.original.type as CertificateMedalType | string;
      const label = CERT_TYPE_UZ[t] ?? (t ? String(t) : '');
      return <>{label || '—'}</>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Berilgan sana',
    cell: ({ row }) => <>{formatCreatedAt(row.original.createdAt)}</>,
  },
  {
    accessorKey: 'user',
    id: 'phone',
    header: 'Telefon',
    cell: ({ row }) => {
      const user = row.original.user;
      return <>{user?.phone?.trim() ? user.phone : '—'}</>;
    },
  },
  {
    accessorKey: 'user',
    id: 'callStatus',
    header: 'Holat',
    cell: ({ row }) => {
      const st = row.original.user?.status;
      if (!st) return <>—</>;
      return <>{USER_STATUS_UZ[st] ?? st}</>;
    },
  },
  {
    accessorKey: 'file',
    header: 'Sertifikat',
    cell: ({ row }) => {
      const url = normalizeImgUrl(row.original.file || '');
      const hasFile = Boolean(url);
      return (
        <div className="inline-flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!hasFile}
            onClick={() => hasFile && onPreviewCertificate(url)}
          >
            Preview
          </Button>
          {hasFile ? (
            <a href={url} target="_blank" rel="noreferrer noopener" className="text-blue-700 dark:text-blue-400 text-sm font-medium">
              File
            </a>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </div>
      );
    },
  },
];
