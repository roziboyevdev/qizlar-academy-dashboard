import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Lesson } from 'modules/lessons/types';
import { DataTableRowActions } from 'components/DataTableRowActions';

interface IProps {
  getRowData: (lesson: Lesson) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createLessonColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<Lesson>[] => [
    {
      accessorKey: 'title',
      header: 'Dars nomi',
    },
    {
      accessorKey: 'link',
      header: 'Dars havolasi',
      cell: ({ row }) => (
        <Link
          to={row.getValue('link')}
          className="hover:underline text-blue-500"
          target="_blank"
          onClick={e => e.stopPropagation()}
        >
          Havola
        </Link>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Dars holati',
      cell: ({ row }) => {
        return (
          <>
            {row.getValue("isActive") ? "Faol" : "No Faol" }
          </>
        )
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
