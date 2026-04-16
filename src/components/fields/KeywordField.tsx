"use client"

import { Button } from "components/ui/button"
import { FormField, FormItem, FormLabel, FormMessage } from "components/ui/form"
import { Input } from "components/ui/input"
import type React from "react"

import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"


import http from "services/api"

interface Skill {
  id: string
  title: string
}

interface IProps {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  suggestions?: string[]
}

export default function KeywordField({ placeholder, required, name, label, suggestions = [] }: IProps) {
  const { control, setValue, getValues } = useFormContext()
  const [keyword, setKeyword] = useState("")
  const [isObjectData, setIsObjectData] = useState(false)
  const [originalData, setOriginalData] = useState<Skill[] | string[]>([])
  const [keywords, setKeywords] = useState<string[]>([])

  useEffect(() => {
    const formValues = getValues(name) || []
    setOriginalData(formValues)

    if (Array.isArray(formValues) && formValues.length > 0 && typeof formValues[0] === "object") {
      setIsObjectData(true)
      const titles = formValues.map((value: Skill) => value.title)
      setKeywords(titles)
    } else {
      setIsObjectData(false)
      setKeywords(formValues as string[])
    }
  }, [getValues, name])

  const addKeyword = (value: string) => {
    const trimmedValue = value.trim()
    if (trimmedValue && !keywords.includes(trimmedValue)) {
      const updatedKeywords = [...keywords, trimmedValue]
      setKeywords(updatedKeywords)

      if (isObjectData) {
        const updatedValues = [...(originalData as Skill[])]
        if (!updatedValues.some((item) => item.title === trimmedValue)) {
          updatedValues.push({
            id: `temp-${Date.now()}`,
            title: trimmedValue,
          })
        }
        setValue(name, updatedValues)
      } else {
        setValue(name, updatedKeywords)
      }
    }
  }

  const handleAddKeyword = () => {
    addKeyword(keyword)
    setKeyword("")
  }

  const handleRemoveKeyword = (removeKeyword: string) => {
    const updatedKeywords = keywords.filter((kw) => kw !== removeKeyword)
    setKeywords(updatedKeywords)

    if (isObjectData) {
      const updatedValues = (originalData as Skill[]).filter((item) => item.title !== removeKeyword)
      setOriginalData(updatedValues)
      setValue(name, updatedValues)
    } else {
      setOriginalData(updatedKeywords)
      setValue(name, updatedKeywords)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddKeyword()
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          {label && (
            <FormLabel>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <div className="flex gap-2">
            <Input
              value={keyword}
              placeholder={placeholder}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button type="button" onClick={handleAddKeyword} variant="outline" className="border-primary/50 text-primary">
              Qo'shish
            </Button>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Tanlash mumkin:</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions
                  .filter((s) => !keywords.includes(s))
                  .slice(0, 15)
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addKeyword(s)}
                      className="px-2 py-0.5 text-[11px] rounded-md bg-muted/70 border border-border text-muted-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all"
                    >
                      + {s}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Selected Keywords */}
          <div className="mt-3 flex flex-wrap gap-2">
            {keywords.map((kw, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-lg flex items-center gap-2 text-sm animate-in zoom-in-95 duration-200"
              >
                {kw}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="text-primary hover:text-primary-foreground hover:bg-primary/50 rounded-full w-4 h-4 flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}


