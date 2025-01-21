import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from 'components/DataTableRowActions';
import CustomSwitch from 'components/SwitchIsDreft';
import { PremiumPlan } from 'modules/premium-plan/types';

interface IProps {
  getRowData: (notification: PremiumPlan) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createDataColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<PremiumPlan>[] => [
  
    {
      accessorKey: 'title',
      header: 'Tarif nomi',
    },
    {
      accessorKey: 'price',
      header: 'Narxi',
    },
    {
      accessorKey: 'duration_in_days',
      header: 'Davomiyligi',
    },
    {
      accessorKey: 'is_visible',
      header: 'Status',
      cell: ({ row }) => {
        const is_visible: boolean = row.getValue('is_visible') || false
        return <>
          <CustomSwitch state={is_visible}
            labelText={is_visible ? "Ko'rinadigan" : "Ko'rinmaydigan "} />
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
