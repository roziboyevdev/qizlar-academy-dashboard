import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from 'components/DataTableRowActions';
import type { IPromocode } from 'modules/promocode/types';
import { formatDateTime } from 'utils/formatDateTime';

interface IProps {
  getRowData: (row: IPromocode) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createVacancyColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<IPromocode, unknown>[] => [
  {
    accessorKey: 'code',
    header: 'Kod',
  },
  {
    accessorKey: 'isUsed',
    header: 'Ishlatilgan',
    cell: ({ row }) => (row.original.isUsed ? 'Ha' : 'Yo‘q'),
  },
  {
    accessorKey: 'usedByUserId',
    header: 'Kim ishlatgan',
    cell: ({ row }) => row.original.usedByUserId ?? '—',
  },
  {
    accessorKey: 'usedAt',
    header: 'Ishlatilgan vaqt',
    cell: ({ row }) =>
      row.original.usedAt ? formatDateTime(row.original.usedAt as unknown as string) : '—',
  },
  {
    accessorKey: 'id',
    header: () => <span className="sr-only">Actions</span>,
    size: 50,
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <DataTableRowActions
          row={row}
          getRowData={getRowData}
          setDialogOpen={setDialogOpen}
          setSheetOpen={setSheetOpen}
          showAddTest={false}
          showDelete={false}
        />
      </div>
    ),
  },
];
