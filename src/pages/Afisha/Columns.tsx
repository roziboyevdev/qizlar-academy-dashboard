import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from 'components/DataTableRowActions';
import { Afisha } from 'modules/afisha/types';
import { convertDate } from 'utils/time';

interface IProps {
  getRowData: (afisha: Afisha) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createAfishaColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<Afisha>[] => [
  {
    accessorKey: 'title',
    header: 'Afisha',
  },
  {
    accessorKey: 'short_description',
    header: 'Tavsifi',
  },
  {
    accessorKey: 'date',
    header: 'Vaqti',
    cell: ({ row }) => {
      return <div>{convertDate(row.getValue('date'))}</div>;
    },
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
