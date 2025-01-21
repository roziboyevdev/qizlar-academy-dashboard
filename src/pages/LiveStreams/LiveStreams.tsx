import { useState } from 'react';
import { LiveStream } from 'modules/live-streams/types';
import { useLiveStreamsList } from 'modules/live-streams/hooks/useLiveStreamsList';
import { useDeleteLiveStream } from 'modules/live-streams/hooks/useDeleteLiveStream';
import { createLiveStreamColumns } from './Columns';
import Loader from 'components/Loader';
import { Sheet } from 'components/Sheet';
import { TableActions } from 'components/TableActions';
import { DataTable } from 'components/DataTable';
import { AlertDialog } from 'components/AlertDialog';
import LiveStreamForm from './LiveStreamForm';

const LiveStreams = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [liveStream, setLiveStream] = useState<LiveStream>();

  const { data: liveStreamsList, isLoading } = useLiveStreamsList();
  const { triggerLiveStreamDelete } = useDeleteLiveStream(liveStream?.id!);

  const getRowData = (liveStream: LiveStream) => {
    setLiveStream(liveStream);
  };

  const columns = createLiveStreamColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
  });

  return (
    <div>
      <TableActions
        sheetTriggerTitle="Jonli efir qo'shish"
        sheetTitle="Yangi jonli efir qo'shish"
        TableForm={LiveStreamForm}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} data={liveStreamsList} />
      )}

      <Sheet
        sheetTitle="Kursni tahrirlash"
        isOpen={isSheetOpen}
        setSheetOpen={setSheetOpen}
      >
        <LiveStreamForm liveStream={liveStream} setSheetOpen={setSheetOpen} />
      </Sheet>
      <AlertDialog
        alertTitle="Ishonchingiz komilmi?"
        alertDescription="Bu harakat orqali siz ma'lumotni o'chirib tashlaysiz."
        alertCancel="Bekor qilish"
        alertActionTitle="Davom etish"
        alertActionFunction={triggerLiveStreamDelete}
        isOpen={isDialogOpen}
        setIsOpen={setDialogOpen}
      />
    </div>
  );
};

export default LiveStreams;
