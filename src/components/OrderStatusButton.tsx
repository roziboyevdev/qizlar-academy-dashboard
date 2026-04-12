import { Row } from '@tanstack/react-table';
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import type { IOrder, OrderAdminStatus } from 'modules/orders/types';
import { useEditOrder } from 'modules/orders/hooks/useEdit';
import { useCancelOrder } from 'modules/orders/hooks/useCancel';

interface IProps {
  row: Row<IOrder>;
  getRowData?: (data: IOrder) => void;
}

const STATUS_LABEL: Record<OrderAdminStatus, string> = {
  PENDING: 'Kutilmoqda',
  PAID: "To'langan",
  SHIPPED: 'Yo‘lda',
  DELIVERED: 'Yetkazildi',
  CANCELLED: 'Bekor',
  REFUNDED: 'Qaytarilgan',
};

const statusStyle: Record<OrderAdminStatus, string> = {
  PENDING: 'text-yellow-800 bg-yellow-200',
  PAID: 'text-white bg-emerald-600',
  SHIPPED: 'text-white bg-blue-600',
  DELIVERED: 'text-white bg-green-700',
  CANCELLED: 'text-white bg-red-500',
  REFUNDED: 'text-white bg-slate-600',
};

const nextStatuses: OrderAdminStatus[] = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export const OrderStatusButton = ({ row, getRowData }: IProps) => {
  const { mutate, isPending } = useEditOrder();
  const { triggerCencelOrder } = useCancelOrder(row.original.id);
  const st = (row.original.status as OrderAdminStatus) || 'PENDING';

  const handleStatusChange = (status: OrderAdminStatus) => {
    const order = row.original;
    mutate({ status, id: order.id });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`flex items-center px-3 py-1 text-sm font-medium rounded-lg ${statusStyle[st] ?? 'bg-muted'}`}
        >
          {STATUS_LABEL[st] ?? st}
          <EllipsisVertical className="h-4 w-4 stroke-1 ml-1" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {nextStatuses.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(status);
            }}
            disabled={isPending || status === st}
          >
            {STATUS_LABEL[status]}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="text-red-500 focus:text-red-600 dark:focus:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            triggerCencelOrder();
          }}
          disabled={isPending}
        >
          Bekor qilish (CANCELLED)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
