import { ColumnDef } from "@tanstack/react-table";
import { Question, Quiz } from "modules/quizzes/types";
import { DataTableRowActions } from "components/DataTableRowActions";
import { quizSelectType } from "constants/index";
import normalizeFileUrl from "utils/normalizeFileUrl";

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
    accessorKey: "question",
    header: "Quiz savoli",
    cell: ({ row }) => {
      const question: Question[] = row.getValue("question");
      return question.map((item) => (
        <div className="img_content" dangerouslySetInnerHTML={{ __html: item.content }} />
      ));
    },
  },
  {
    accessorKey: "type",
    header: "Savol tipi",
    cell: ({ row }) => {
      const type = quizSelectType.find(
        (item) => item.type === row.getValue("type")
      );
      return <p>{type?.name}</p>;
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
