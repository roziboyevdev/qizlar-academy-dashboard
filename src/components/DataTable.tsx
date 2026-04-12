"use client"

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/ui/table"
import type { CSSProperties, Dispatch, SetStateAction } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "utils/styleUtils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]

  // navigation
  navigateTable?: boolean
  queryParams?: Record<string, string>
  customNavigationUrl?: (rowData: TData) => string

  /** Qator bosilganda (masalan, yon panelda preview) */
  onRowClick?: (row: TData) => void
  selectedRowId?: string
  getRowId?: (row: TData) => string

  // ✅ pagination
  pageNumber?: number
  pageSize?: number
  totalPages?: number
  setPageNumber?: Dispatch<SetStateAction<number>>
  setPageSize?: Dispatch<SetStateAction<number>>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  navigateTable,
  queryParams,
  customNavigationUrl,
  onRowClick,
  selectedRowId,
  getRowId,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const navigate = useNavigate()

  const rowId = (row: TData) => {
    if (getRowId) return getRowId(row)
    return String((row as { id?: string }).id ?? '')
  }

  const buildNavigationUrl = (row: any) => {
    if (customNavigationUrl) {
      return customNavigationUrl(row.original)
    }

    const baseUrl = row.getValue("id")
    if (queryParams && Object.keys(queryParams).length > 0) {
      const searchParams = new URLSearchParams(queryParams)
      return `${baseUrl}?${searchParams.toString()}`
    }

    return baseUrl
  }

  return (
    <div className="rounded-md border border-border bg-card text-card-foreground">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const styles: CSSProperties = header.getSize() !== 150 ? { width: `${header.getSize()}px` } : {}
                return (
                  <TableHead key={header.id} style={styles}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(
                  (navigateTable || onRowClick) && "cursor-pointer",
                  selectedRowId && rowId(row.original) === selectedRowId && "bg-muted/60",
                  "animate-in fade-in slide-in-from-bottom-1 duration-500 fill-mode-both"
                )}
                style={{ animationDelay: `${row.index * 40}ms` }}
                onClick={() => {
                  if (navigateTable) {
                    navigate(buildNavigationUrl(row))
                  } else if (onRowClick) {
                    onRowClick(row.original)
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}


