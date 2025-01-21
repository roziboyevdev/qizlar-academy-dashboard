import { useState } from 'react';
import { Book } from 'modules/books/types';
import { useDeleteBook } from 'modules/books/hooks/useDeleteBook';
import { useBooksList } from 'modules/books/hooks/useBooksList';
import { Sheet } from 'components/Sheet';
import { DataTable } from 'components/DataTable';
import { AlertDialog } from 'components/AlertDialog';
import { TableActions } from 'components/TableActions';
import { Pagination } from 'components/Pagination';
import Loader from 'components/Loader';
import { createBookColumns } from './Columns';
import BookForm from './BookForm';

const Books = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [book, setBook] = useState<Book>();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: booksList,
    paginationInfo,
    isLoading,
  } = useBooksList(currentPage);
  const { triggerBookDelete } = useDeleteBook(book?.id!);

  const getRowData = (book: Book) => {
    setBook(book);
  };

  const columns = createBookColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
  });

  return (
    <div>
      <TableActions
        sheetTriggerTitle="Kitob qo'shish"
        sheetTitle="Yangi kitob qo'shish."
        TableForm={BookForm}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable columns={columns} data={booksList} />
          <Pagination
            className="justify-end mt-3"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            paginationInfo={paginationInfo}
          />
        </>
      )}

      <Sheet
        sheetTitle="Kursni tahrirlash"
        isOpen={isSheetOpen}
        setSheetOpen={setSheetOpen}
      >
        <BookForm book={book} setSheetOpen={setSheetOpen} />
      </Sheet>
      <AlertDialog
        alertTitle="Ishonchingiz komilmi?"
        alertDescription="Bu harakat orqali siz ma'lumotni o'chirib tashlaysiz."
        alertCancel="Bekor qilish"
        alertActionTitle="Davom etish"
        alertActionFunction={triggerBookDelete}
        isOpen={isDialogOpen}
        setIsOpen={setDialogOpen}
      />
    </div>
  );
};

export default Books;
