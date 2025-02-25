import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "components/DataTableRowActions";
import { DonationStatus, IOrder } from "modules/orders/types";
import { formatDateTime } from "utils/formatDateTime";

interface IProps {
  getRowData: (notification: IOrder) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
  currentPage: number;
}

export const createDataColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
  currentPage,
}: IProps): ColumnDef<IOrder>[] => [
  {
    accessorKey: "amount",
    header: "T/R",
    cell: ({ row }) => row.index + 1 + (currentPage - 1) * 10,
  },
  {
    accessorKey: "orderId",
    header: "Buyurtma raqami",
  },
  {
    accessorKey: "price",
    header: "Narxi",
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: DonationStatus = row.getValue("status");

      switch (status) {
        case DonationStatus.NEW:
          return (
            <span className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-lg">
              New
            </span>
          );
        case DonationStatus.PENDING:
          return (
            <button className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-200 rounded-lg">
              Pending
            </button>
          );
        case DonationStatus.DONE:
          return (
            <span className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-lg">
              Done
            </span>
          );
        default:
          return (
            <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-300 rounded-lg">
              Unknown
            </span>
          );
      }
    },
  },
  {
    accessorKey: "comment",
    header: "Izoh",
    cell: ({ row }) => {
      return <>{row.getValue("comment")}</>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Buyurtma qilingan vaqt",
    cell: ({ row }) => {
      
      return <>{formatDateTime(row.getValue("createdAt"))}</>;
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
