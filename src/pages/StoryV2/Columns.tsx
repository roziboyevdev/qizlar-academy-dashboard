import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from 'components/DataTableRowActions';
import { StoryV2Type, MediaType } from 'modules/story-v2/types';
import normalizeImgUrl from 'utils/normalizeFileUrl';

interface IProps {
  getRowData: (notification: StoryV2Type) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createDataColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<StoryV2Type>[] => [
  {
    accessorKey: 'title',
    header: 'Sarlavha',
    cell: ({ row }) => row.original.title || '—',
  },
  {
    accessorKey: 'mediaUrl',
    header: 'Media',
    cell: ({ row }) => {
      const url = normalizeImgUrl(String(row.original.mediaUrl || ''));
      if (!url) return <span className="text-muted-foreground text-sm">—</span>;
      const isVideo =
        row.original.mediaType === MediaType.VIDEO || String(row.original.mediaType).toUpperCase() === 'VIDEO';
      return (
        <div className="pointer-events-none block overflow-hidden rounded-md border border-border">
          {isVideo ? (
            <video src={url} muted className="h-14 w-[5.5rem] object-cover bg-black" playsInline />
          ) : (
            <img
              src={url}
              alt=""
              width={88}
              height={56}
              className="h-14 w-[5.5rem] object-cover bg-muted"
              loading="lazy"
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'expiresAt',
    header: 'Tugash',
    cell: ({ row }) => {
      const d = row.original.expiresAt;
      if (!d) return '—';
      try {
        return new Date(d).toLocaleString('uz-UZ');
      } catch {
        return d;
      }
    },
  },
  {
    accessorKey: 'viewCount',
    header: "Ko'rishlar",
  },
  {
    accessorKey: 'likeCount',
    header: 'Layklar',
  },
  {
    accessorKey: 'id',
    header: () => <span className="sr-only">Actions</span>,
    size: 50,
    cell: ({ row }) => <DataTableRowActions row={row} getRowData={getRowData} setDialogOpen={setDialogOpen} setSheetOpen={setSheetOpen} />,
  },
];
