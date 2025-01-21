import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "components/ui/form";
import { FileField, SelectField, TextField } from "components/fields";
import LoadingButton from "components/LoadingButton";
import useFileUploader from "hooks/useFileUploader";
import { useState } from "react";
import { schema, useFormSchemaType } from "./schema";
import { StoryInputType, StoryType } from "modules/story/types";
import { useEditStory } from "modules/story/hooks/useEdit";
import { useCreateStory } from "modules/story/hooks/useCreate";
import DateTimePicker from "components/DateAndTimePicker";
import VideoUploadField from "components/fields/VideoUploder";
import CustomSwitch from "components/SwitchIsDreft";

interface IProps {
  certificate?: StoryType;
  setSheetOpen: (state: boolean) => void;
}
const typeData = [
  { type: "course", name: "Kurslar" },
  { type: "leaderboard", name: "Peshqadamlar" },
  { type: "shop", name: "Do'kon" },
  { type: "link", name: "Havola" },
];
export default function CustomForm({ certificate, setSheetOpen }: IProps) {
  const initialState =
    certificate?.title && certificate?.withId ? certificate?.withId : true;

  const [switchState, setSwitchState] = useState<boolean>(initialState);
  const [state, setState] = useState(false);
  const { uploadFile } = useFileUploader();
  const { triggerCreate, isPending: isInfoCreatePending } = useCreateStory({
    setSheetOpen,
  });
  const { triggerEdit, isPending: isNotificationEditPending } = useEditStory({
    id: certificate?.id,
    setSheetOpen,
  });
  const [value, setValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // get courses

  const form = useForm<useFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: certificate
      ? {
          title: certificate?.title,
          link: certificate?.link,
          // deadline: certificate?.deadline,
          cover: certificate?.cover,
          video: certificate?.video,
        }
      : {
          title: "",
          link: "",
          // deadline: "",
          cover: "",
          video: "",
        },
  });

  async function onSubmit(formValues: useFormSchemaType) {
    try {
      if (!value) {
        return setErrorMessage("Hikoya tugash vaqtini kiriting");
      }
      setState(true);
      const formattedValues = { ...formValues, deadline: value };

      const values = await uploadFile<StoryInputType>(formattedValues, "cover");
      const valuesWithVideo = await uploadFile<StoryInputType>(values, "video");
      console.log(valuesWithVideo);
      console.log({ withId: false });

      if (certificate) {
        triggerEdit({
          ...valuesWithVideo,
          withId: valuesWithVideo.type === "course" ? true : false,
        });
      } else {
        triggerCreate({
          ...valuesWithVideo,
          withId: valuesWithVideo.type === "course" ? true : false,
        });
      }
    } catch (error) {
      setState(false);
      alert("Aniqlanmagan hatolik!");
    }
  }

  

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <div className="flex gap-4 flex-col my-4">
          <TextField name="title" label="Hikoya nomi" required />
          <TextField name="link" label="Hikoya linki" required />

          <TextField name="content" label="Hikoya  kontenti" required />
          <SelectField
            name="type"
            data={typeData}
            placeholder="Hikoya  turini tanlang..."
            label="Hikoya  turini tanglang"
          />
          {/* 
          <CustomSwitch
            state={switchState}
            setState={setSwitchState}
            labelText={
              certificate?.withId || switchState
                ? "Idli bunner"
                : "Idsiz  bunner"
            }/> */}
          <DateTimePicker
            value={value}
            setValue={setValue}
            title="Hikoyani tugash vaqtini kiriting"
            defaultValue={certificate?.deadline}
            errorMessage={errorMessage}
          />

          <FileField name="cover" label="Hikoya rasmi" />
          <VideoUploadField
            name="video"
            label="Hikoya videosi"
            defaultValue={certificate?.video}
          />
        </div>
        {certificate ? (
          <LoadingButton isLoading={isNotificationEditPending}>
            Tahrirlash
          </LoadingButton>
        ) : (
          <LoadingButton isLoading={state}>Saqlash</LoadingButton>
        )}
      </form>
    </Form>
  );
}
