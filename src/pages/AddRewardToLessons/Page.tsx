import { useState } from 'react';
import { DataTable } from 'components/DataTable';
import { TableActions } from 'components/TableActions';
import { Sheet } from 'components/Sheet';
import { AlertDialog } from 'components/AlertDialog';
import Loader from 'components/Loader';
import { createDataColumns } from './Columns';
import CustomForm from './CustomForm';
import { Pagination } from 'components/Pagination';
import { useCourseRewardList } from 'modules/add-reward-to-lessons/hooks/useList';
import { useDeleteCourseReward } from 'modules/add-reward-to-lessons/hooks/useDelete';
import { ICourseReward } from 'modules/add-reward-to-lessons/types';

const AddRewardToLessons = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [data, setData] = useState<ICourseReward>();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: couseAssitants, isLoading, paginationInfo } = useCourseRewardList(currentPage, '04e06c75-f402-4e53-a220-4f9a1f7c0b4d');

  
  const { triggerInfoDelete } = useDeleteCourseReward(data?.id!);
  const getRowData = (info: ICourseReward) => {
    setData(info);
  };

  const columns = createDataColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
  });

  console.log(couseAssitants, 'courseAsistants');

  return (
    <div>
      <TableActions sheetTriggerTitle="Kurs assistantni qo'shish" sheetTitle="Yangi Kurs assistantni qo'shish" TableForm={CustomForm} />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable columns={columns} data={couseAssitants} />
          {paginationInfo && (
            <Pagination
              className="justify-end mt-3"
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              paginationInfo={paginationInfo}
            />
          )}
        </>
      )}

      <Sheet sheetTitle="Kurs assistantni  tahrirlash" isOpen={isSheetOpen} setSheetOpen={setSheetOpen}>
        <CustomForm selectedData={data} setSheetOpen={setSheetOpen} />
      </Sheet>

      <AlertDialog
        alertTitle="Ishonchingiz komilmi?"
        alertDescription="Bu harakat orqali siz ma'lumotni o'chirib tashlaysiz."
        alertCancel="Bekor qilish"
        alertActionTitle="Davom etish"
        alertActionFunction={triggerInfoDelete}
        isOpen={isDialogOpen}
        setIsOpen={setDialogOpen}
      />
    </div>
  );
};

export default AddRewardToLessons;
