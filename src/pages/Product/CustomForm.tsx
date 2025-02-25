import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "components/ui/form";
import { FileField, TextField } from "components/fields";
import LoadingButton from "components/LoadingButton";
import useFileUploader from "hooks/useFileUploader";
import { useState } from "react";
import { schema, useFormSchemaType } from "./schema";
import { ProductFileType, ProductType } from "modules/product/types";
import CustomSwitch from "components/SwitchIsDreft";
import { useEditProduct } from "modules/product/hooks/useEdit";
import { useCreateProduct } from "modules/product/hooks/useCreate";
import NumberTextField from "components/fields/Number";
import { useParams } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
interface IProps {
  product?: ProductType;
  setSheetOpen: (state: boolean) => void;
}

export default function CustomForm({ product, setSheetOpen }: IProps) {
  const { categoryId } = useParams();

  const initialState = product?.title ? product?.isActive : true;
  const [switchState, setSwitchState] = useState<boolean>(initialState);
  const [state, setState] = useState(false);
  const initalPhotos = product?.photos
    ? product.photos.map((el) => el.photo)
    : ["1"];

  const [photos, setPhotos] = useState(initalPhotos);
  const { uploadFile } = useFileUploader();
  const { triggerCreate, isPending: isInfoCreatePending } = useCreateProduct({
    setSheetOpen,
  });
  const { triggerEdit, isPending: isNotificationEditPending } = useEditProduct({
    id: product?.id,
    setSheetOpen,
  });

  const form = useForm<useFormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          title: product?.title,
          photo: product?.photo,
          photo1: product?.photos?.[1] ? product?.photos[1]?.photo : "",
          photo2: product?.photos?.[2] ? product?.photos[2]?.photo : "",
          photo3: product?.photos?.[3] ? product?.photos[3]?.photo : "",
          photo4: product?.photos?.[4] ? product?.photos[4]?.photo : "",
          photo5: product?.photos?.[5] ? product?.photos[5]?.photo : "",
          price: +product?.price,
          count: +product?.count,
          content: product?.content,
          isActive: product?.isActive,
        }
      : {
          title: "",
          photo1: "",
          photo2: "",
          photo3: "",
          photo4: "",
          photo5: "",
          price: "",
          count: "",
          content: "",
          isActive: switchState,
        },
  });

  async function onSubmit(formValues: useFormSchemaType) {
    setState(true);
    try {
      const firstValue = await uploadFile<ProductFileType>(formValues, "photo");
      const values = await uploadFile<ProductFileType>(firstValue, "photo1");
      const values2 = await uploadFile<ProductFileType>(values, "photo2");
      const values3 = await uploadFile<ProductFileType>(values2, "photo3");
      const values4 = await uploadFile<ProductFileType>(values3, "photo4");
      const values5 = await uploadFile<ProductFileType>(values4, "photo5");
      const photos = [
        values5.photo1,
        values5.photo2,
        values5.photo3,
        values5.photo4,
        values5.photo5,
      ].filter((el) => el);
      const { photo, photo1, photo2, photo3, photo4, photo5, ...restValues } =
        values5;
      const data = {
        ...restValues,
        categoryId: categoryId,
        price: +values.price,
        count: +values.count,
        isActive: switchState,
        photos,
        photo,
      };
      if (product) {
        triggerEdit(data);
      } else {
        triggerCreate(data);
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
          <TextField name="title" label="Product nomi" required />
          <TextField name="content" label="Product tarifi" required />
          <NumberTextField
            name="price"
            placeholder="Narxni kiriting"
            label="Narxni kiriting"
            required
          />
          <FileField name={`photo`} label={`Mahsulot rasmi `} />
          <NumberTextField
            name="count"
            placeholder="Mahsulot soni"
            label="Mahsulot soni"
            required
          />
          <CustomSwitch
            state={switchState}
            setState={setSwitchState}
            labelText={
              product?.isActive || switchState
                ? "Product Ko'rinsin"
                : "Product Ko'rinmasin "
            }
          />

          <div className="flex  gap-2 flex-col">
            {photos.map((id, index) => (
              <div className="flex items-center gap-4 " key={index}>
                <FileField
                  name={`photo${index + 1}`}
                  label={`Mahsulot rasmi ${index + 1}`}
                />
                <Minus
                  className="cursor-pointer mt-8 "
                  size={32}
                  onClick={() => {
                    if (photos.length > 1) {
                      photos.splice(index, 1);
                      setPhotos([...photos]);
                    }
                  }}
                />
                <Plus
                  className="cursor-pointer mt-8 "
                  size={32}
                  onClick={() => {
                    if (photos.length < 5) {
                      setPhotos([...photos, String(photos.at(-1)) + 1]);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        {product ? (
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
