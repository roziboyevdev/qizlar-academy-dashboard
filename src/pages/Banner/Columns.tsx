import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from 'components/DataTableRowActions';
import { Banner } from 'modules/banner/types';
import normalizeImgUrl from 'utils/normalizeFileUrl';

interface IProps {
  getRowData: (notification: Banner) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createDataColumns = ({ getRowData, setSheetOpen, setDialogOpen }: IProps): ColumnDef<Banner>[] => [
  {
    id: 'bannerPhotos',
    header: 'Rasmlar',
    cell: ({ row }) => {
      const desktop = normalizeImgUrl(String(row.original.photo || ''));

      const thumb = (src: string, label: string) => (
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[11px] text-muted-foreground leading-none">{label}</span>
          <a href={src} target="_blank" rel="noopener noreferrer" className="inline-block shrink-0 rounded-md border bg-muted overflow-hidden hover:opacity-90">
            <img src={src} alt="" width={88} height={56} className="h-14 w-[5.5rem] object-cover block" loading="lazy" />
          </a>
        </div>
      );

      if (!desktop) {
        return <span className="text-muted-foreground text-sm">—</span>;
      }

      return (
        <div className="flex flex-wrap items-end gap-3 max-w-[280px]">
          {desktop ? thumb(desktop, 'Rasm') : null}
        </div>
      );
    },
  },

  {
    accessorKey: 'type',
    header: 'Banner turi',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },

  {
    accessorKey: 'id',
    header: () => <span className="sr-only">Actions</span>,
    size: 50,
    cell: ({ row }) => <DataTableRowActions row={row} getRowData={getRowData} setDialogOpen={setDialogOpen} setSheetOpen={setSheetOpen} />,
  },
];
