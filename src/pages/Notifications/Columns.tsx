import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from 'components/DataTableRowActions';
import { Notification } from 'modules/notifications/types';
import { convertDate } from 'utils/time';
import normalizeImgUrl from 'utils/normalizeFileUrl';

interface IProps {
  getRowData: (notification: Notification) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createNotificationColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<Notification>[] => [
    {
      accessorKey: 'title',
      header: 'Bildirishnoma',
    },
    {
      id: 'notificationPhoto',
      header: 'Rasm',
      cell: ({ row }) => {
        const src = normalizeImgUrl(String(row.original.photo || ''));
        if (!src) {
          return <span className="text-muted-foreground text-sm">—</span>;
        }
        return (
          <img
            src={src}
            alt=""
            width={80}
            height={52}
            className="rounded-md object-cover border bg-muted"
            style={{ maxHeight: 52 }}
            loading="lazy"
          />
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Vaqti',
      cell: ({ row }) => {
        return <div>{convertDate(row.getValue('createdAt'))}</div>;
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
