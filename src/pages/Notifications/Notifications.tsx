import { useState } from 'react';
import { Notification } from 'modules/notifications/types';
import { useNotificationsList } from 'modules/notifications/hooks/useNotificationsList';
import { useDeleteNotification } from 'modules/notifications/hooks/useDeleteNotification';
import { DataTable } from 'components/DataTable';
import { TableActions } from 'components/TableActions';
import { Sheet } from 'components/Sheet';
import { AlertDialog } from 'components/AlertDialog';
import Loader from 'components/Loader';
import { createNotificationColumns } from './Columns';
import NotificationForm from './NotificationForm';

const Notifications = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [notification, setNotification] = useState<Notification>();

  const { data: notificationsList, isLoading } = useNotificationsList();
  const { triggerNotificationDelete } = useDeleteNotification(
    notification?.id!
  );

  const getRowData = (notification: Notification) => {
    setNotification(notification);
  };

  const columns = createNotificationColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
  });

  return (
    <div>
      <TableActions
        sheetTriggerTitle="Bildirishnoma qo'shish"
        sheetTitle="Yangi bildirishnoma qo'shish"
        TableForm={NotificationForm}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} data={notificationsList} />
      )}

      <Sheet
        sheetTitle="Kursni tahrirlash"
        isOpen={isSheetOpen}
        setSheetOpen={setSheetOpen}
      >
        <NotificationForm
          notification={notification}
          setSheetOpen={setSheetOpen}
        />
      </Sheet>
      <AlertDialog
        alertTitle="Ishonchingiz komilmi?"
        alertDescription="Bu harakat orqali siz ma'lumotni o'chirib tashlaysiz."
        alertCancel="Bekor qilish"
        alertActionTitle="Davom etish"
        alertActionFunction={triggerNotificationDelete}
        isOpen={isDialogOpen}
        setIsOpen={setDialogOpen}
      />
    </div>
  );
};

export default Notifications;
