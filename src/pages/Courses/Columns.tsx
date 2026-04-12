import type { ColumnDef } from '@tanstack/react-table';
import type { Course } from 'modules/courses/types';
import { DataTableRowActions } from 'components/DataTableRowActions';
import { Link } from 'react-router-dom';
import CustomSwitch from 'components/SwitchIsDreft';
import { Button } from 'components/ui/button';
import normalizeImgUrl from 'utils/normalizeFileUrl';

interface IProps {
  getRowData: (course: Course) => void;
  setSheetOpen: (state: boolean) => void;
  setDialogOpen: (state: boolean) => void;
  currentPage: number;
  toggleActive: (course: Course, isActive: boolean) => void;
}

export const createCourseColumns = ({ getRowData, setSheetOpen, setDialogOpen, currentPage, toggleActive }: IProps): ColumnDef<Course, unknown>[] => [
  {
    accessorKey: 'amount',
    header: 'T/R',
    cell: ({ row }) => row.index + 1 + (currentPage - 1) * 10,
  },
  {
    accessorKey: 'title',
    header: 'Kurs nomi',
  },
  {
    id: 'courseVisual',
    header: 'Rasm',
    cell: ({ row }) => {
      const banner = String(row.original.banner || '');
      const icon = String(row.original.icon || '');
      const src = normalizeImgUrl(banner || icon);
      if (!src) {
        return <span className="text-muted-foreground text-sm">—</span>;
      }
      return (
        <img
          src={src}
          alt=""
          width={80}
          height={52}
          className="rounded-md object-cover border bg-muted"
          style={{ maxHeight: 52 }}
          loading="lazy"
        />
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive: boolean = row.getValue('isActive') || false;
      return (
        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <CustomSwitch
            state={isActive}
            setState={(next) => toggleActive(row.original, next)}
            labelText={isActive ? "Ko'rinadigan" : "Ko'rinmaydigan "}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'influencer',
    header: 'Kurs influencer',
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <Button asChild size="sm">
          <Link
            to={`/courses/${id}/influencer`}
            onClick={(e) => e.stopPropagation()}
          >
            Influencer
          </Link>
        </Button>
      );
    },
  },
  {
    accessorKey: 'ratingCount',
    header: 'Izohlar',
    cell: ({ row }) => {
      const count = row.getValue('ratingCount') as number;
      const id = row.original.id;

      return (
        <Link
          to={`/courses/${id}/comments`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center px-3 py-1 rounded-md bg-foreground text-background text-sm font-medium transition-colors hover:opacity-90"
        >
          {count ?? 0} ta
        </Link>
      );
    },
  },
  {
    accessorKey: 'id',
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
            addTestEl={<Link to={`/exam/${row.getValue('id')}`}>Yakuniy test qo'shish</Link>}
            showBattle={true}
            addBattleEl={<Link to={`/battle-question/${row.getValue('id')}`}>Battle test qo'shish</Link>}
          />
        </div>
      );
    },
  },
];