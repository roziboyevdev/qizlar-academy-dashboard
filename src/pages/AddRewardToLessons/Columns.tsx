import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from 'components/DataTableRowActions';
import { ICourseReward } from 'modules/add-reward-to-lessons/types';
import { Link } from 'react-router-dom';
import normalizeImgUrl from 'utils/normalizeFileUrl';

interface IProps {
  getRowData: (notification: ICourseReward) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createDataColumns = ({ getRowData, setSheetOpen, setDialogOpen }: IProps): ColumnDef<ICourseReward>[] => [
  {
    accessorKey: 'title',
    header: 'Dars',
  },
  {
    accessorKey: 'orderId',
    header: 'Dars raqami',
  },
  {
    accessorKey: 'reward',
    header: "sovg'a",
    cell: ({ row }) => {
      return row.original.file ? (
        <Link to={row.original.file ? normalizeImgUrl(row.original.file as string) : '#'} className="text-blue-600" target="_blank">
          file
        </Link>
      ) : (
        row.original.reward
      );
    },
  },

  {
    accessorKey: 'id',
    header: () => <span className="sr-only">Actions</span>,
    size: 50,
    cell: ({ row }) => <DataTableRowActions row={row} getRowData={getRowData} setDialogOpen={setDialogOpen} setSheetOpen={setSheetOpen} />,
  },
];
