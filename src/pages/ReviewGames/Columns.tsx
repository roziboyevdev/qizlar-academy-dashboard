import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { ReviewGame } from 'modules/review-games/types';
import { DataTableRowActions } from 'components/DataTableRowActions';

interface IProps {
  getRowData: (reviewGame: ReviewGame) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createReviewGameColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<ReviewGame>[] => [
  {
    accessorKey: 'title',
    header: 'Tahlil nomi',
  },
  {
    accessorKey: 'youtube_link',
    header: 'Tahlil havolasi',
    cell: ({ row }) => (
      <Link
        to={row.getValue('youtube_link')}
        className="hover:underline text-blue-500"
        target="_blank"
        onClick={e => e.stopPropagation()}
      >
        Havola
      </Link>
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
