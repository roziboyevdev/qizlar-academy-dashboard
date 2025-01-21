import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from 'components/DataTableRowActions';
import { Donation, Profile } from 'modules/donation/types';
import { formatDateTime } from 'utils/formatDateTime';


interface IProps {
  getRowData: (notification: Donation) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
  currentPage: number

}

export const createDataColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
  currentPage
}: IProps): ColumnDef<Donation>[] => [

    {
      accessorKey: 'amount',
      header: 'T/R',
      cell:({row})=>row.index  + 1 +(currentPage - 1) * 10
    },
    {
      accessorKey: 'amount',
      header: 'Miqdor',
    },
    {
      accessorKey: 'provider',
      header: 'Tolov usuli',
    },
    {
      accessorKey: 'profile',
      header: 'Kim tomonidan',
      cell:({row})=>{
        const profile = row.getValue<Profile>('profile');
        return  <>
        {profile ? profile?.first_name  +" "+  profile?.last_name :''}
      </>
      }
    },

    {
      accessorKey: 'date',
      header: 'Vaqt',
      cell:({row})=>{
        const date:string = row.getValue('date') || '';
        return  <>
        {formatDateTime(date)}
      </>
      }
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
