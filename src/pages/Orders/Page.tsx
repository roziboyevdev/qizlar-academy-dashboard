import { useState } from 'react';
import { DataTable } from 'components/DataTable';
import Loader from 'components/Loader';
import { createDataColumns } from './Columns';
import { Pagination } from 'components/Pagination';
import { useOredersList } from 'modules/orders/hooks/useList';
import { IOrder } from 'modules/orders/types';
import { useEditOrder } from 'modules/orders/hooks/useEdit';

const OrdersPage = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [data, setData] = useState<IOrder>();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: categories, isLoading, pagenationInfo } = useOredersList(currentPage);


  const getRowData = (info: IOrder) => {
    setData(info);
  };

  // demo
  const columns = createDataColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
    currentPage,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Jami {pagenationInfo?.total_records || 0} ta </h2>
        <h1 className="text-2xl font-bold">Buyurtmalar</h1>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable columns={columns} data={categories} />
          <Pagination className="justify-end mt-3" currentPage={currentPage} setCurrentPage={setCurrentPage} paginationInfo={pagenationInfo} />
        </>
      )}
    </div>
  );
};

export default OrdersPage;
