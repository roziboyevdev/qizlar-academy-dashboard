"use client"

import { useMutation } from "@tanstack/react-query"
import { useToast } from "components/ui/use-toast"

import type { CourseInput } from "../types"
import { queryClient } from "services/react-query"
import { showErrorToast } from "utils/showErrorToast"
import { EditCourse } from "../api"

interface IHook {
  setSheetOpen: (state: boolean) => void
}

export type EditCourseVariables = { id: string; values: CourseInput }

export const useEditCourse = ({ setSheetOpen }: IHook) => {
  const { toast } = useToast()

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: ({ id, values }: EditCourseVariables) => {
      if (!id) {
        return Promise.reject(new Error("Kurs identifikatori topilmadi"))
      }
      return EditCourse({ values, id })
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Muvaffaqiyat!",
        description: "Kurs muvaffaqiyatli tahrirlandi.",
      })
      queryClient.invalidateQueries({ queryKey: ["courses_list"] })
      setSheetOpen(false)
    },
    onError: (error: any) => showErrorToast(error),
  })

  return {
    triggerCourseEdit: mutate,
    isPending,
    isSuccess,
    isError,
  }
}
