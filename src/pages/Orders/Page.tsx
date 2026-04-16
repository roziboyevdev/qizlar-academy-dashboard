import { useState } from 'react';
import { DataTable } from 'components/DataTable';
import Loader from 'components/Loader';
import { createDataColumns } from './Columns';
import { Pagination } from 'components/Pagination';
import { useOredersList } from 'modules/orders/hooks/useList';
import type { IOrder } from 'modules/orders/types';

import { useDeleteOrder } from 'modules/orders/hooks/useDelete';
import { AlertDialog } from 'components/AlertDialog';
import SelectWithoutForm from 'components/fields/SelectWithoutForm';
import { Button } from 'components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from 'components/ui/sheet';
import OrdersForm from './OrdersForm';

const statusData = [
  { id: 'ALL_STATUS', name: 'Barchasi' },
  { id: 'PENDING', name: 'Kutilmoqda' },
  { id: 'PAID', name: "To'langan" },
  { id: 'SHIPPED', name: 'Yo‘lda' },
  { id: 'DELIVERED', name: 'Yetkazildi' },
  { id: 'CANCELLED', name: 'Bekor' },
  { id: 'REFUNDED', name: 'Qaytarilgan' },
];

const OrdersPage = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [data, setData] = useState<IOrder>();
  const [currentPage, setCurrentPage] = useState(1);

  const [status, setStatus] = useState<string>('ALL_STATUS');

  const [searchFilters, setSearchFilters] = useState({
    status: 'ALL_STATUS' as string,
  });

  const filters = {
    status: searchFilters.status !== 'ALL_STATUS' ? searchFilters.status : undefined,
  };

  const { data: orders, isLoading, pagenationInfo } = useOredersList(currentPage, filters);

  const handleSearch = () => {
    setSearchFilters({
      status,
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setStatus('ALL_STATUS');
    setSearchFilters({
      status: 'ALL_STATUS',
    });
    setCurrentPage(1);
  };

  const { triggerOrderDelete } = useDeleteOrder(data?.id!);
  const getRowData = (info: IOrder) => {
    setData(info);
  };

  const columns = createDataColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
    currentPage,
  });

  const handleSheetClose = () => {
    setSheetOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Jami {pagenationInfo?.count ?? 0} ta </h2>
        <h1 className="text-2xl font-bold">Buyurtmalar (admin)</h1>
      </div>

      <div className="mb-4 p-4 border border-border rounded-2xl bg-card shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1 block text-muted-foreground">Status</label>
            <SelectWithoutForm
              data={statusData}
              placeholder="Status bo'yicha..."
              onChange={(value) => setStatus(value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSearch}>Qo‘llash</Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Tozalash
          </Button>
        </div>
      </div>

      <div className="flex justify-between p-4">
        <h1 className="text-2xl font-bold">Ro‘yxat</h1>
        <Button onClick={() => setSheetOpen(true)}>Kursni aktivlashtirish</Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable columns={columns} data={orders} />
          <Pagination
            className="justify-end mt-3"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            paginationInfo={pagenationInfo}
          />
        </>
      )}

      <Sheet open={isSheetOpen} onOpenChange={handleSheetClose}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Aktivlashtirish</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <OrdersForm setSheetOpen={setSheetOpen} />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog
        alertTitle="Ishonchingiz komilmi?"
        alertDescription="Buyurtma bekor qilinadi (status: CANCELLED)."
        alertCancel="Bekor qilish"
        alertActionTitle="Davom etish"
        alertActionFunction={triggerOrderDelete}
        isOpen={isDialogOpen}
        setIsOpen={setDialogOpen}
      />
    </div>
  );
};

export default OrdersPage;
