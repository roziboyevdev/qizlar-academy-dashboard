import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from 'components/DataTableRowActions';
import CustomSwitch from 'components/SwitchIsDreft';
import { CategoryType } from 'modules/category/types';


interface IProps {
  getRowData: (notification: CategoryType) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createDataColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<CategoryType>[] => [

    {
      accessorKey: 'title',
      header: 'Kategoriya nomi',
    },

    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => {
        const is_active: boolean = row.getValue('is_active') || false
        return <>
          <CustomSwitch state={is_active}
            labelText={is_active ? "Ko'rinadigan" : "Ko'rinmaydigan "} />
        </>;
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
