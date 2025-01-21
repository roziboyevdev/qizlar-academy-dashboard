import { useState } from 'react';
import { Afisha } from 'modules/afisha/types';
import { useAfishaList } from 'modules/afisha/hooks/useAfishaList';
import { useDeleteAfisha } from 'modules/afisha/hooks/useDeleteAfisha';
import { DataTable } from 'components/DataTable';
import Loader from 'components/Loader';
import { TableActions } from 'components/TableActions';
import { Pagination } from 'components/Pagination';
import { AlertDialog } from 'components/AlertDialog';
import { Sheet } from 'components/Sheet';
import AfishaForm from './AfishaForm';
import { createAfishaColumns } from './Columns';

const AfishaPage = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [afisha, setAfisha] = useState<Afisha>();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: afishaList,
    paginationInfo,
    isLoading,
  } = useAfishaList(currentPage);
  const { triggerAfishaDelete } = useDeleteAfisha(afisha?.id!);

  const getRowData = (afisha: Afisha) => {
    setAfisha(afisha);
  };

  const columns = createAfishaColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
  });

  return (
    <div>
      <TableActions
        sheetTriggerTitle="Afisha qo'shish"
        sheetTitle="Yangi afisha qo'shish."
        TableForm={AfishaForm}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable columns={columns} data={afishaList} />
          <Pagination
            className="justify-end mt-3"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            paginationInfo={paginationInfo}
          />
        </>
      )}

      <Sheet
        sheetTitle="Afishani tahrirlash"
        isOpen={isSheetOpen}
        setSheetOpen={setSheetOpen}
      >
        <AfishaForm afisha={afisha} setSheetOpen={setSheetOpen} />
      </Sheet>
      <AlertDialog
        alertTitle="Ishonchingiz komilmi?"
        alertDescription="Bu harakat orqali siz ma'lumotni o'chirib tashlaysiz."
        alertCancel="Bekor qilish"
        alertActionTitle="Davom etish"
        alertActionFunction={triggerAfishaDelete}
        isOpen={isDialogOpen}
        setIsOpen={setDialogOpen}
      />
    </div>
  );
};

export default AfishaPage;
