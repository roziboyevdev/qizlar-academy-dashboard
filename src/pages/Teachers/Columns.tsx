import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from 'components/DataTableRowActions';
import { TeacherType } from 'modules/teachers/types';
import normalizeImgUrl from 'utils/normalizeFileUrl';

interface IProps {
  getRowData: (notification: TeacherType) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createDataColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<TeacherType>[] => [
  {
    accessorKey: 'fullname',
    header: 'To‘liq ism',
  },
  {
    accessorKey: 'bio',
    header: 'Bio',
    cell: ({ row }) => {
      const text = String(row.getValue('bio') ?? '');
      return (
        <span className="line-clamp-2 max-w-xs text-sm text-muted-foreground" title={text}>
          {text || '—'}
        </span>
      );
    },
  },
  {
    accessorKey: 'photo',
    header: 'Rasm',
    cell: ({ row }) => {
      const src = normalizeImgUrl(String(row.getValue('photo') ?? ''));
      if (!src) return <span className="text-muted-foreground">—</span>;
      return (
        <img
          src={src}
          alt=""
          className="w-16 h-16 rounded-lg bg-black/20 object-contain border border-white/5"
          loading="lazy"
        />
      );
    },
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
