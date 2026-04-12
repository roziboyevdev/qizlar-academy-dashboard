import { useEffect, useState } from 'react';
import { DataTable } from 'components/DataTable';
import { TableActions } from 'components/TableActions';
import { Sheet } from 'components/Sheet';
import { AlertDialog } from 'components/AlertDialog';
import Loader from 'components/Loader';
import { createDataColumns } from './Columns';
import CustomForm from './CustomForm';
import { StoryV2Type } from 'modules/story-v2/types';
import { useStoriesList } from 'modules/story-v2/hooks/useList';
import { useDeleteStory } from 'modules/story-v2/hooks/useDelete';
import normalizeImgUrl from 'utils/normalizeFileUrl';
import { isStoryVideo, StoryPhonePreview } from './StoryPhonePreview';

const StoryV2Page = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [data, setData] = useState<StoryV2Type>();
  const [previewStory, setPreviewStory] = useState<StoryV2Type | null>(null);

  const { data: storiesList, isLoading } = useStoriesList();

  const { triggerInfoDelete } = useDeleteStory(data?.id ?? '');
  const getRowData = (info: StoryV2Type) => {
    setData(info);
  };

  useEffect(() => {
    if (!storiesList?.length) {
      setPreviewStory(null);
      return;
    }
    setPreviewStory((prev) => {
      if (prev && storiesList.some((s) => s.id === prev.id)) return prev;
      return storiesList[0];
    });
  }, [storiesList]);

  const columns = createDataColumns({
    getRowData,
    setDialogOpen,
    setSheetOpen,
  });

  const previewUrl = previewStory?.mediaUrl ? normalizeImgUrl(String(previewStory.mediaUrl)) : '';
  const previewIsVideo = previewStory ? isStoryVideo(previewStory) : false;

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
      <aside className="flex w-full shrink-0 flex-col items-center border-b border-border pb-8 lg:sticky lg:top-4 lg:w-[min(280px,30vw)] lg:self-start lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
        {previewStory ? (
          <>
            <StoryPhonePreview story={previewStory} mediaUrl={previewUrl} isVideo={previewIsVideo} />
            <dl className="mt-5 grid w-full max-w-[260px] grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs text-muted-foreground">
              <dt>Tugash</dt>
              <dd className="text-right font-medium text-foreground">
                {previewStory.expiresAt ? new Date(previewStory.expiresAt).toLocaleString('uz-UZ') : '—'}
              </dd>
              <dt>Ko‘rishlar</dt>
              <dd className="text-right font-medium text-foreground">{previewStory.viewCount}</dd>
              <dt>Layklar</dt>
              <dd className="text-right font-medium text-foreground">{previewStory.likeCount}</dd>
            </dl>
          </>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {isLoading ? 'Yuklanmoqda…' : 'Hikoyalar ro‘yxati bo‘sh'}
          </p>
        )}
      </aside>

      <div className="min-w-0 flex-1 space-y-4">
        <TableActions sheetTriggerTitle="Hikoya qo'shish" sheetTitle="Yangi hikoya qo'shish" TableForm={CustomForm} />

        {isLoading ? (
          <Loader />
        ) : (
          <DataTable
            columns={columns}
            data={storiesList}
            onRowClick={(row) => setPreviewStory(row)}
            selectedRowId={previewStory?.id}
            getRowId={(r) => r.id}
          />
        )}

        <Sheet sheetTitle="Hikoyani tahrirlash" isOpen={isSheetOpen} setSheetOpen={setSheetOpen}>
          <CustomForm key={data?.id ?? 'new'} story={data} setSheetOpen={setSheetOpen} />
        </Sheet>
        <AlertDialog
          alertTitle="Ishonchingiz komilmi? "
          alertDescription="Bu harakat orqali siz ma'lumotni o'chirib tashlaysiz."
          alertCancel="Bekor qilish"
          alertActionTitle="Davom etish"
          alertActionFunction={triggerInfoDelete}
          isOpen={isDialogOpen}
          setIsOpen={setDialogOpen}
        />
      </div>
    </div>
  );
};

export default StoryV2Page;
