import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "components/DataTableRowActions";
import { Donation, Profile } from "modules/donation/types";
import { UserCertificate } from "modules/user-certificate/types";
import { formatDateTime } from "utils/formatDateTime";

interface IProps {
  getRowData: (notification: UserCertificate) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
  currentPage: number;
}

export const createDataColumns = ({
  getRowData,
  setSheetOpen,
  setDialogOpen,
  currentPage,
}: IProps): ColumnDef<UserCertificate>[] => [
  {
    accessorKey: "amount",
    header: "T/R",
    cell: ({ row }) => row.index + 1 + (currentPage - 1) * 10,
  },
  {
    accessorKey: "profile",
    header: "Talaba",
    cell: ({ row }) => {
      const profile = row.getValue<Profile>("profile");
      return (
        <>{profile ? profile?.first_name + " " + profile?.last_name : ""}</>
      );
    },
  },
  {
    accessorKey: "user",
    header: "Tel/Email",
    cell: ({ row }) => {
      const user: { phone_number: string; email: string } =
        row.getValue("user");
      return <>{user?.phone_number ? user?.phone_number : user?.email}</>;
    },
  },
  {
    accessorKey: "course",
    header: "Kurs",
    cell: ({ row }) => {
      const course: { name: string }[] = row.getValue("course");
      console.log(course);

      return (
        <>
          {course.map((item, index) => (
            <span key={index}>{item.name}</span>
          ))}
        </>
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
