import { ColumnDef } from '@tanstack/react-table';
import { Question, Quiz } from 'modules/lastexam/types';
import { DataTableRowActions } from 'components/DataTableRowActions';
import { quizSelectType } from 'constants/index';

interface IProps {
  getRowData: (quiz: Quiz) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createQuizColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<Quiz>[] => [
    {
      accessorKey: 'question',
      header: 'Quiz savoli',
      cell: ({ row }) => {
        return <>
          <p>{row.getValue("question")}</p>
        </>;
      },
    },
    {
      accessorKey: 'type',
      header: 'Savol tipi',
      cell: ({ row }) => {

        return <p> salom</p>;
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
