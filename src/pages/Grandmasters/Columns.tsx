import { ColumnDef } from '@tanstack/react-table';
import { Grandmaster } from 'modules/grandmasters/types';
import { DataTableRowActions } from 'components/DataTableRowActions';

interface IProps {
  getRowData: (grandmasters: Grandmaster) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createGrandmasterColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<Grandmaster>[] => [
  {
    accessorKey: 'full_name',
    header: 'Grandmaster ismi',
    cell: ({ row }) => (
      <p className="leading-7 dark:text-white">{row.getValue('full_name')}</p>
    ),
  },
  {
    accessorKey: 'id',
    header: () => <span className="sr-only">Actions</span>,
    size: 50,
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        getRowData={getRowData}
        setDialogOpen={setDialogOpen}
        setSheetOpen={setSheetOpen}
      />
    ),
  },
];
