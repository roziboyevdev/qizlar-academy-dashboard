import { useMemo, useState } from 'react';
import { DataTable } from 'components/DataTable';
import Loader from 'components/Loader';
import { TableActions } from 'components/TableActions';
import { AlertDialog } from 'components/AlertDialog';
import { Sheet } from 'components/Sheet';
import CourseForm from './CourseForm';
import { createVacancyColumns } from './Columns';
import type { IPromocode } from 'modules/promocode/types';
import { usePromocodesList } from 'modules/promocode/hooks/useList';
import { useDeletePromocode } from 'modules/promocode/hooks/useDelete';
import { useProductsList } from 'modules/product/hooks/useList';
import SelectWithoutForm from 'components/fields/SelectWithoutForm';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { usePromoCodeStats } from 'modules/promocode/hooks/usePromoCodeStats';

const PromocodePage = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  /** Qator bo‘yicha tahrirlash / qo‘shish sheet (DataTableRowActions) */
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [course, setCourse] = useState<IPromocode>();
  const [productId, setProductId] = useState('');

  const { data: productsList } = useProductsList(100, 1, '');
  const productOptions = useMemo(
    () =>
      (productsList ?? []).map((p) => ({
        id: p.id,
        name: p.title,
      })),
    [productsList]
  );

  const { data: coursesList, isLoading } = usePromocodesList({
    productId,
    isEnabled: true,
  });

  const { data: statsRows, isLoading: statsLoading } = usePromoCodeStats();

  const { triggerVacancyDelete } = useDeletePromocode(course?.id || '');

  const getRowData = (row: IPromocode) => {
    setCourse(row);
  };

  const columns = createVacancyColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
  });

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="min-w-[240px]">
          <p className="text-sm font-medium mb-1">Mahsulot</p>
          <SelectWithoutForm
            data={productOptions}
            placeholder="Mahsulotni tanlang..."
            onChange={(value) => setProductId(String(value))}
          />
        </div>
        <TableActions sheetTriggerTitle="Excel yuklash" sheetTitle="Promokodlar Excel" TableForm={CourseForm} />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Promokod statistikasi</CardTitle>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <Loader />
          ) : (
            <div className="overflow-x-auto text-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 pr-2">Mahsulot</th>
                    <th className="py-2 pr-2">Jami</th>
                    <th className="py-2 pr-2">Ishlatilgan</th>
                    <th className="py-2">Mavjud</th>
                  </tr>
                </thead>
                <tbody>
                  {(statsRows ?? []).map((r) => (
                    <tr key={r.productId} className="border-b border-border/60">
                      <td className="py-2 pr-2">{r.productTitle}</td>
                      <td className="py-2 pr-2">{r.total}</td>
                      <td className="py-2 pr-2">{r.used}</td>
                      <td className="py-2">{r.available}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {!productId ? (
        <p className="text-muted-foreground text-center py-8">Promokodlarni ko‘rish uchun mahsulotni tanlang.</p>
      ) : isLoading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} data={coursesList} />
      )}

      <Sheet sheetTitle="Excel yuklash" isOpen={isSheetOpen} setSheetOpen={setSheetOpen}>
        <CourseForm setSheetOpen={setSheetOpen} />
      </Sheet>

      <AlertDialog
        alertTitle="Ishonchingiz komilmi?"
        alertDescription="Backendda promokodni o‘chirish yo‘q — bu tugma faqat xabar beradi."
        alertCancel="Bekor qilish"
        alertActionTitle="Davom etish"
        alertActionFunction={triggerVacancyDelete}
        isOpen={isDialogOpen}
        setIsOpen={setDialogOpen}
      />
    </div>
  );
};

export default PromocodePage;
