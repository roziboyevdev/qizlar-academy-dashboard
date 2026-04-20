import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from 'components/DataTableRowActions';
import { Vacancy, VacancyCategory, VacancyJobType } from 'modules/vacancy/types';

interface IProps {
  getRowData: (course: Vacancy) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

const categoryUz: Record<VacancyCategory, string> = {
  [VacancyCategory.business]: 'Biznes',
  [VacancyCategory.crafts]: 'Hunarmandchilik',
  [VacancyCategory.itMedia]: 'IT va media',
  [VacancyCategory.education]: 'Ta’lim',
  [VacancyCategory.legal]: 'Huquq',
  [VacancyCategory.psychology]: 'Psixologiya',
  [VacancyCategory.health]: 'Sog‘liq',
  [VacancyCategory.family]: 'Oilaviy',
};

const jobUz: Record<VacancyJobType, string> = {
  [VacancyJobType.FULL_TIME]: "To'liq stavka",
  [VacancyJobType.PART_TIME]: 'Yarim stavka',
  [VacancyJobType.INTERN]: 'Stajyor',
  [VacancyJobType.REMOTE]: 'Masofaviy',
  [VacancyJobType.ONSITE]: 'Ofisda',
  [VacancyJobType.CONTRACT]: 'Shartnoma',
};

function stripHtml(html: string, max = 80): string {
  const plain = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return plain.length > max ? `${plain.slice(0, max)}…` : plain;
}

export const createVacancyColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<Vacancy, unknown>[] => [
  {
    accessorKey: 'companyName',
    header: 'Kompaniya',
    cell: ({ row }) => row.original.companyName || '—',
  },
  {
    accessorKey: 'title',
    header: 'Lavozim',
  },
  {
    accessorKey: 'category',
    header: 'Kategoriya',
    cell: ({ row }) => {
      const c = row.original.category;
      return c ? categoryUz[c] ?? c : '—';
    },
  },
  {
    accessorKey: 'type',
    header: 'Ish shakli',
    cell: ({ row }) => jobUz[row.original.type] ?? row.original.type,
  },
  {
    id: 'salary',
    header: 'Maosh',
    cell: ({ row }) => {
      const { salaryFrom, salaryTo, currency } = row.original;
      return `${salaryFrom.toLocaleString('uz-UZ')} – ${salaryTo.toLocaleString('uz-UZ')} ${currency}`;
    },
  },
  {
    accessorKey: 'location',
    header: 'Joylashuv',
  },
  {
    accessorKey: 'description',
    header: 'Tavsif',
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{stripHtml(row.original.description)}</span>,
  },
  {
    accessorKey: 'id',
    header: () => <span className="sr-only">Actions</span>,
    size: 50,
    cell: ({ row }) => (
      <DataTableRowActions row={row} getRowData={getRowData} setDialogOpen={setDialogOpen} setSheetOpen={setSheetOpen} />
    ),
  },
];
