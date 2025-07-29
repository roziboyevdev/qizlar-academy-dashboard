'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'components/ui/form';
import { FileField, RichTextEditor, TextField } from 'components/fields';
import LoadingButton from 'components/LoadingButton';
import useFileUploader, { useEasyFileUploader } from 'hooks/useFileUploader';
import { useState, useEffect } from 'react';
import { createSchemaWithPhotos } from './schema';
import type { ProductType } from 'modules/product/types';
import CustomSwitch from 'components/SwitchIsDreft';
import { useEditProduct } from 'modules/product/hooks/useEdit';
import { useCreateProduct } from 'modules/product/hooks/useCreate';
import NumberTextField from 'components/fields/Number';
import { useParams } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { Button } from 'components/ui/button';

interface IProps {
  product?: ProductType;
  setSheetOpen: (state: boolean) => void;
}

export default function CustomForm({ product, setSheetOpen }: IProps) {
  const { categoryId } = useParams();
  const initialState = product?.title ? product?.isActive : true;
  const [switchState, setSwitchState] = useState<boolean>(initialState);
  const [state, setState] = useState(false);
  const { uploadFile: easyFileUpload, isPending } = useEasyFileUploader();

  // Photo field'lar soni
  const getInitialPhotoCount = () => {
    if (product?.photos && product.photos.length > 0) {
      return product.photos.length;
    }
    return 1;
  };

  const [photoCount, setPhotoCount] = useState(getInitialPhotoCount());

  const { uploadFile } = useFileUploader();
  const { triggerCreate, isPending: isInfoCreatePending } = useCreateProduct({
    setSheetOpen,
  });
  const { triggerEdit, isPending: isNotificationEditPending } = useEditProduct({
    id: product?.id,
    setSheetOpen,
  });

  // Dynamic schema yaratish
  const schema = createSchemaWithPhotos(photoCount);

  // Default values yaratish
  const getDefaultValues = () => {
    const baseValues = {
      title: product?.title || '',
      photo: product?.photo || '',
      price: product ? +product.price : '',
      count: product ? +product.count : '',
      content: product?.content || '',
      isActive: product?.isActive ?? switchState,
    };

    // Dynamic photo values qo'shish
    const photoValues: Record<string, string> = {};
    for (let i = 1; i <= photoCount; i++) {
      if (product?.photos && product.photos[i - 1]) {
        photoValues[`photo${i}`] = product.photos[i - 1].photo;
      } else {
        photoValues[`photo${i}`] = '';
      }
    }

    return { ...baseValues, ...photoValues };
  };

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(),
  });

// Photo count o'zgarganda form'ni qayta yaratish (faqat yangi field'lar uchun)
 useEffect(() => {
    if (photoCount > 1) {
      // Hozirgi form values'ni saqlash (any type bilan)
      const currentValues = form.getValues() as Record<string, any>

      // Yangi default values yaratish, lekin hozirgi values'ni saqlab qolish
      const newDefaultValues = getDefaultValues()

      // Hozirgi values bilan merge qilish
      const mergedValues: Record<string, any> = { ...newDefaultValues }

      // Mavjud field'larning qiymatlarini saqlab qolish
      Object.keys(currentValues).forEach((key) => {
        if (currentValues[key] !== undefined && currentValues[key] !== "") {
          mergedValues[key] = currentValues[key]
        }
      })

      // Form'ni yangi values bilan reset qilish
      form.reset(mergedValues)
    }
  }, [photoCount])



  const addPhotoField = () => {
    setPhotoCount((prev) => prev + 1);
  };

  const removePhotoField = () => {
    if (photoCount > 1) {
      setPhotoCount((prev) => prev - 1);
    }
  };

  async function onSubmit(formValues: any) {
    setState(true);
    try {
      // Asosiy rasmni yuklash
      let mainPhoto = formValues.photo;
      if (formValues.photo instanceof File) {
        const uploadedPhoto = await uploadFile({ photo: formValues.photo }, 'photo');
        mainPhoto = uploadedPhoto.photo;
      }

      // Qo'shimcha rasmlarni yuklash
      const uploadedPhotos: string[] = [];

      for (let i = 1; i <= photoCount; i++) {
        const photoKey = `photo${i}`;
        const photo = formValues[photoKey];

        if (photo instanceof File) {
          const uploaded = await easyFileUpload(photo);
          uploadedPhotos.push(uploaded);
        } else if (typeof photo === 'string' && photo.trim() !== '') {
          uploadedPhotos.push(photo);
        }
      }

      const data = {
        title: formValues.title,
        content: formValues.content,
        photo: mainPhoto as string,
        photos: uploadedPhotos,
        price: +formValues.price,
        count: +formValues.count,
        categoryId: categoryId,
        isActive: switchState,
      };

      if (product) {
        triggerEdit(data);
      } else {
        triggerCreate(data);
      }
    } catch (error) {
      setState(false);
      console.error('Upload error:', error);
      alert('Aniqlanmagan hatolik!');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex gap-4 flex-col my-4">
          <TextField name="title" label="Product nomi" required />
          <RichTextEditor name="content" label="Product tarifi" required />
          <NumberTextField name="price" placeholder="Narxni kiriting" label="Narxni kiriting" required />
          <FileField name="photo" label="Asosiy mahsulot rasmi" />
          <NumberTextField name="count" placeholder="Mahsulot soni" label="Mahsulot soni" required />
          <CustomSwitch
            state={switchState}
            setState={setSwitchState}
            labelText={product?.isActive || switchState ? "Product Ko'rinsin" : "Product Ko'rinmasin"}
          />

          {/* Photos bo'limi */}
          <div className="flex gap-2 flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Qo'shimcha rasmlar</h3>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={addPhotoField} className="flex items-center gap-2 bg-transparent">
                  <Plus size={16} />
                  Rasm qo'shish
                </Button>
                {photoCount > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removePhotoField}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Minus size={16} />
                    Olib tashlash
                  </Button>
                )}
              </div>
            </div>

            {Array.from({ length: photoCount }, (_, index) => (
              <div key={`photo-${index + 1}`} className="flex items-center gap-4">
                <div className="flex-1">
                  <FileField name={`photo${index + 1}`} label={`Mahsulot rasmi ${index + 1}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {product ? (
          <LoadingButton isLoading={isNotificationEditPending || state}>Tahrirlash</LoadingButton>
        ) : (
          <LoadingButton isLoading={isInfoCreatePending || state}>Saqlash</LoadingButton>
        )}
      </form>
    </Form>
  );
}

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form } from "components/ui/form";
// import { FileField, RichTextEditor, TextField } from "components/fields";
// import LoadingButton from "components/LoadingButton";
// import useFileUploader from "hooks/useFileUploader";
// import { useState } from "react";
// import { schema, useFormSchemaType } from "./schema";
// import { ProductFileType, ProductType } from "modules/product/types";
// import CustomSwitch from "components/SwitchIsDreft";
// import { useEditProduct } from "modules/product/hooks/useEdit";
// import { useCreateProduct } from "modules/product/hooks/useCreate";
// import NumberTextField from "components/fields/Number";
// import { useParams } from "react-router-dom";
// import { Plus, Minus } from "lucide-react";
// interface IProps {
//   product?: ProductType;
//   setSheetOpen: (state: boolean) => void;
// }

// export default function CustomForm({ product, setSheetOpen }: IProps) {
//   const { categoryId } = useParams();

//   const initialState = product?.title ? product?.isActive : true;
//   const [switchState, setSwitchState] = useState<boolean>(initialState);
//   const [state, setState] = useState(false);
//   const initalPhotos = product?.photos
//     ? product.photos.map((el) => el.photo)
//     : ["1"];

//   const [photos, setPhotos] = useState(initalPhotos);
//   const { uploadFile } = useFileUploader();
//   const { triggerCreate, isPending: isInfoCreatePending } = useCreateProduct({
//     setSheetOpen,
//   });
//   const { triggerEdit, isPending: isNotificationEditPending } = useEditProduct({
//     id: product?.id,
//     setSheetOpen,
//   });

//   const form = useForm<useFormSchemaType>({
//     resolver: zodResolver(schema),
//     defaultValues: product
//       ? {
//           title: product?.title,
//           photo: product?.photo,
//           photo1: product?.photos?.[1] ? product?.photos[1]?.photo : "",
//           photo2: product?.photos?.[2] ? product?.photos[2]?.photo : "",
//           photo3: product?.photos?.[3] ? product?.photos[3]?.photo : "",
//           photo4: product?.photos?.[4] ? product?.photos[4]?.photo : "",
//           photo5: product?.photos?.[5] ? product?.photos[5]?.photo : "",
//           price: +product?.price,
//           count: +product?.count,
//           content: product?.content,
//           isActive: product?.isActive,
//         }
//       : {
//           title: "",
//           photo1: "",
//           photo2: "",
//           photo3: "",
//           photo4: "",
//           photo5: "",
//           price: "",
//           count: "",
//           content: "",
//           isActive: switchState,
//         },
//   });

//   console.log(product)

//   async function onSubmit(formValues: useFormSchemaType) {
//     setState(true);
//     try {
//       const firstValue = await uploadFile<ProductFileType>(formValues, "photo");
//       const values = await uploadFile<ProductFileType>(firstValue, "photo1");
//       const values2 = await uploadFile<ProductFileType>(values, "photo2");
//       const values3 = await uploadFile<ProductFileType>(values2, "photo3");
//       const values4 = await uploadFile<ProductFileType>(values3, "photo4");
//       const values5 = await uploadFile<ProductFileType>(values4, "photo5");
//       const photos = [
//         values5.photo1,
//         values5.photo2,
//         values5.photo3,
//         values5.photo4,
//         values5.photo5,
//       ].filter((el) => el);
//       const { photo, photo1, photo2, photo3, photo4, photo5, ...restValues } =
//         values5;
//       const data = {
//         ...restValues,
//         categoryId: categoryId,
//         price: +values.price,
//         count: +values.count,
//         isActive: switchState,
//         photos,
//         photo,
//       };
//       if (product) {
//         triggerEdit(data);
//       } else {
//         triggerCreate(data);
//       }
//     } catch (error) {
//       setState(false);
//       alert("Aniqlanmagan hatolik!");
//     }
//   }

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="flex flex-col gap-2"
//       >
//         <div className="flex gap-4 flex-col my-4">
//           <TextField name="title" label="Product nomi" required />
//           <RichTextEditor name="content" label="Product tarifi" required />
//           <NumberTextField
//             name="price"
//             placeholder="Narxni kiriting"
//             label="Narxni kiriting"
//             required
//           />
//           <FileField name={`photo`} label={`Mahsulot rasmi `} />
//           <NumberTextField
//             name="count"
//             placeholder="Mahsulot soni"
//             label="Mahsulot soni"
//             required
//           />
//           <CustomSwitch
//             state={switchState}
//             setState={setSwitchState}
//             labelText={
//               product?.isActive || switchState
//                 ? "Product Ko'rinsin"
//                 : "Product Ko'rinmasin "
//             }
//           />

//           <div className="flex  gap-2 flex-col">
//             {photos.map((id, index) => (
//               <div className="flex items-center gap-4 " key={index}>
//                 <FileField
//                   name={`photo${index + 1}`}
//                   label={`Mahsulot rasmi ${index + 1}`}
//                 />
//                 <Minus
//                   className="cursor-pointer mt-8 "
//                   size={32}
//                   onClick={() => {
//                     if (photos.length > 1) {
//                       photos.splice(index, 1);
//                       setPhotos([...photos]);
//                     }
//                   }}
//                 />

//                 <Plus
//                   className="cursor-pointer mt-8 "
//                   size={32}
//                   onClick={() => {
//                     if (photos.length < 5) {
//                       setPhotos([...photos, String(photos.at(-1)) + 1]);
//                     }
//                   }}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//         {product ? (
//           <LoadingButton isLoading={isNotificationEditPending}>
//             Tahrirlash
//           </LoadingButton>
//         ) : (
//           <LoadingButton isLoading={state}>Saqlash</LoadingButton>
//         )}
//       </form>
//     </Form>
//   );
// }
