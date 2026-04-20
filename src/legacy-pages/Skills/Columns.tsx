import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from 'components/DataTableRowActions';
import { Skill } from 'modules/skills/types';

interface IProps {
  getRowData: (skill: Skill) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createDataColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<Skill>[] => [
  {
    accessorKey: 'name',
    header: 'Nomi',
  },
  {
    accessorKey: "id",
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
