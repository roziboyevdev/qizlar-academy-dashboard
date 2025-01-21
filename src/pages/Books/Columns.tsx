import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from 'components/DataTableRowActions';
import { Button } from 'components/ui/button';
import { Download } from 'lucide-react';
import { Book } from 'modules/books/types';
import normalizeFileUrl from 'utils/normalizeFileUrl';

interface IProps {
  getRowData: (book: Book) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createBookColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<Book>[] => [
  {
    accessorKey: 'name',
    header: 'Nomi',
  },
  {
    accessorKey: 'author',
    header: 'Muallif',
  },
  {
    accessorKey: 'download_link',
    header: "Ko'chirish havolasi",
    cell: ({ row }) => (
      <a
        href={normalizeFileUrl(row.getValue('download_link'))}
        className="hover:underline text-blue-500"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button size="icon">
          <Download className="w-4 h-4" />
        </Button>
      </a>
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
