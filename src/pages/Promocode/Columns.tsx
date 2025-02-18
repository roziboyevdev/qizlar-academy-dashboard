import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "components/DataTableRowActions";
import { IPromocode } from "modules/promocode/types";


interface IProps {
  getRowData: (course: IPromocode) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
}

export const createVacancyColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
}: IProps): ColumnDef<IPromocode, unknown>[] => [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "maxUses",
    header: "Umumiy miqdori",
  },
  {
    accessorKey: "type",
    header: "Turi",
  },



  {
    accessorKey: "id",
    header: () => <span className="sr-only">Actions</span>,
    size: 50,
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center ">
          <DataTableRowActions
            row={row}
            getRowData={getRowData}
            setDialogOpen={setDialogOpen}
            setSheetOpen={setSheetOpen}
            showAddTest={true}
           
          />
        </div>
      );
    },
  },
];
