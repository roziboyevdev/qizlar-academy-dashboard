import { useState } from 'react';
import { useGrandmastersList } from 'modules/grandmasters/hooks/useGrandmastersList';
import { useDeleteGrandmaster } from 'modules/grandmasters/hooks/useDeleteGrandmaster';
import { Grandmaster } from 'modules/grandmasters/types';
import { Sheet } from 'components/Sheet';
import { DataTable } from 'components/DataTable';
import { TableActions } from 'components/TableActions';
import { AlertDialog } from 'components/AlertDialog';
import { Pagination } from 'components/Pagination';
import { createGrandmasterColumns } from './Columns';
import GrandmasterForm from './GrandmasterForm';
import Loader from 'components/Loader';

const Grandmasters = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [grandmaster, setGrandmaster] = useState<Grandmaster>();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: grandmastersList,
    paginationInfo,
    isLoading,
  } = useGrandmastersList(currentPage);
  const { triggerGrandmasterDelete } = useDeleteGrandmaster(grandmaster?.id!);

  const getRowData = (grandmasters: Grandmaster) => {
    setGrandmaster(grandmasters);
  };

  const columns = createGrandmasterColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
  });

  return (
    <div>
      <TableActions
        sheetTriggerTitle="Grandmaster qo'shish"
        sheetTitle="Yangi grandmaster qo'shish."
        TableForm={GrandmasterForm}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable columns={columns} data={grandmastersList} />
          <Pagination
            className="justify-end mt-3"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            paginationInfo={paginationInfo}
          />
        </>
      )}

      <Sheet
        sheetTitle="Grandmasterni tahrirlash"
        isOpen={isSheetOpen}
        setSheetOpen={setSheetOpen}
      >
        <GrandmasterForm
          grandmaster={grandmaster}
          setSheetOpen={setSheetOpen}
        />
      </Sheet>
      <AlertDialog
        alertTitle="Ishonchingiz komilmi?"
        alertDescription="Bu harakat orqali siz ma'lumotni o'chirib tashlaysiz."
        alertCancel="Bekor qilish"
        alertActionTitle="Davom etish"
        alertActionFunction={triggerGrandmasterDelete}
        isOpen={isDialogOpen}
        setIsOpen={setDialogOpen}
      />
    </div>
  );
};

export default Grandmasters;
