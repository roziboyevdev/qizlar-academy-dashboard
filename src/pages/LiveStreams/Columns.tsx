import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from 'components/DataTableRowActions';
import { LiveStream } from 'modules/live-streams/types';
import { Link } from 'react-router-dom';
import { convertDate } from 'utils/time';

interface IProps {
  getRowData: (liveStream: LiveStream) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createLiveStreamColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<LiveStream>[] => [
  {
    accessorKey: 'title',
    header: 'Jonli efir nomi',
  },
  {
    accessorKey: 'video_link',
    header: 'Efir havolasi',
    cell: ({ row }) => (
      <Link
        to={row.getValue('video_link')}
        className="hover:underline text-blue-500"
        target="_blank"
      >
        Havola
      </Link>
    ),
  },
  {
    accessorKey: 'starts_at',
    header: 'Boshlanish vaqti',
    cell: ({ row }) => <div>{convertDate(row?.getValue('starts_at'))}</div>,
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
