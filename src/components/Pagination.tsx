import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from 'components/ui/pagination';
import { cn } from 'utils/styleUtils';

interface PaginationInfo {
  current_page: number;
  next_page: number;
  prev_page: number;
  total_pages: number;
  total_records: number;
}

interface IProps {
  className: string;
  currentPage: number;
  setCurrentPage: (state: number) => void;
  paginationInfo: PaginationInfo;
}

export const Pagination = ({
  className,
  currentPage,
  setCurrentPage,
  paginationInfo,
}: IProps) => {
  const { total_pages, prev_page, next_page, current_page } = paginationInfo;
  const handleNextPage = () => {
    if (currentPage < total_pages) {
      setCurrentPage(current_page + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(current_page - 1);
    }
  };

  return (
    <PaginationRoot className={cn(className, 'dark:text-slate-400')}>
      <PaginationContent>
        <PaginationItem className="cursor-pointer select-none">
          <PaginationPrevious onClick={handlePrevPage} />
        </PaginationItem>
        {prev_page > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {prev_page > 0 && (
          <PaginationItem className="cursor-pointer select-none">
            <PaginationLink onClick={handlePrevPage}>
              {prev_page}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem className="cursor-pointer select-none">
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>
        {next_page > 0 && (
          <>
            <PaginationItem className="cursor-pointer select-none">
              <PaginationLink onClick={handleNextPage}>
                {next_page}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        <PaginationItem className="cursor-pointer select-none">
          <PaginationNext onClick={handleNextPage} />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
};
