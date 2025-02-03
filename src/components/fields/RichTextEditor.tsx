// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from 'components/ui/form';
// import { useFormContext } from 'react-hook-form';
// import QuillEditor from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// interface IProps {
//   name: string;
//   label?: string;
//   placeholder?: string;
//   required?: boolean;
// }

// export default function RichTextEditor({
//   name,
//   label,
//   required,
//   placeholder,
// }: IProps) {
//   const { control } = useFormContext();

//   const formats = [
//     'header',
//     'bold',
//     'italic',
//     'underline',
//     'strike',
//     'blockquote',
//     'list',
//     'bullet',
//     'link',
//   ];
//   const modules = {
//     toolbar: {
//       container: [
//         [{ header: [1, 2, 3, 4, false] }],
//         ['bold', 'italic', 'underline', 'blockquote'],
//         [{ list: 'ordered' }, { list: 'bullet' }, 'link'],
//       ],
//     },
//     clipboard: {
//       matchVisual: true,
//     },
//   };

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem>
//           {label && (
//             <FormLabel>
//               {`${label} `}
//               {required && (
//                 <span className="text-red-500 dark:text-red-900">*</span>
//               )}
//             </FormLabel>
//           )}
//           <FormControl>
//             <QuillEditor
//               theme="snow"
//               value={field.value}
//               onChange={field.onChange}
//               formats={formats}
//               modules={modules}
//               placeholder={placeholder}
//             />
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { useFormContext } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRef, useMemo } from "react";
import { useEasyFileUploader } from "hooks/useFileUploader";
import normalizeImgUrl from "utils/normalizeFileUrl";

interface IProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export default function RichTextEditor({
  name,
  label,
  required,
  placeholder,
}: IProps) {
  const { control } = useFormContext();
  const quillRef = useRef<ReactQuill | null>(null);
  const { uploadFile: easyUpload } = useEasyFileUploader();
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
  ];

  // Rasm yuklash handlerini funksiyaga biriktirish
  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const imageUrl = await easyUpload(file);
console.log(imageUrl);

          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection();
          if (range && quill) {
            quill.insertEmbed(range.index, "image", normalizeImgUrl(imageUrl));
          }
        } catch (error) {
          console.error("Rasm yuklashda xatolik:", error);
        }
      }
    };
  };

  // Modullarni `useMemo` bilan bir marta yaratamiz
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }, "link", "image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    };
  }, []); // `[]` bilan hech qanday statega bog'lanmaydi

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {`${label} `}
              {required && (
                <span className="text-red-500 dark:text-red-900">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={field.value}
              onChange={field.onChange}
              formats={formats}
              modules={modules}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
