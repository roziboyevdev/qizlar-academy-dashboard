import { useState } from 'react';
import { ReviewGame } from 'modules/review-games/types';
import { useReviewGamesList } from 'modules/review-games/hooks/useReviewGamesList';
import { useDeleteReviewGame } from 'modules/review-games/hooks/useDeleteReviewGame';
import { DataTable } from 'components/DataTable';
import Loader from 'components/Loader';
import { TableActions } from 'components/TableActions';
import { Pagination } from 'components/Pagination';
import { AlertDialog } from 'components/AlertDialog';
import { Sheet } from 'components/Sheet';
import ReviewGameForm from './ReviewGameForm';
import { createReviewGameColumns } from './Columns';

const ReviewGames = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [reviewGame, setReviewGame] = useState<ReviewGame>();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: ReviewGamesList,
    paginationInfo,
    isLoading,
  } = useReviewGamesList(currentPage);
  const { triggerReviewGameDelete } = useDeleteReviewGame(reviewGame?.id!);

  const getRowData = (reviewGame: ReviewGame) => {
    setReviewGame(reviewGame);
  };

  const columns = createReviewGameColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
  });

  return (
    <div>
      <TableActions
        sheetTriggerTitle="Tahlil qo'shish"
        sheetTitle="Yangi o'yin tahlili qo'shish"
        TableForm={ReviewGameForm}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable columns={columns} data={ReviewGamesList} navigateTable />
          <Pagination
            className="justify-end mt-3"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            paginationInfo={paginationInfo}
          />
        </>
      )}

      <Sheet
        sheetTitle="O'yin tahlilini tahrirlash"
        isOpen={isSheetOpen}
        setSheetOpen={setSheetOpen}
      >
        <ReviewGameForm reviewGame={reviewGame} setSheetOpen={setSheetOpen} />
      </Sheet>
      <AlertDialog
        alertTitle="Ishonchingiz komilmi?"
        alertDescription="Bu harakat orqali siz ma'lumotni o'chirib tashlaysiz."
        alertCancel="Bekor qilish"
        alertActionTitle="Davom etish"
        alertActionFunction={triggerReviewGameDelete}
        isOpen={isDialogOpen}
        setIsOpen={setDialogOpen}
      />
    </div>
  );
};

export default ReviewGames;
