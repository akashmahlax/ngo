"use client"

import * as React from "react"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUpDown,
} from "lucide-react"

export interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchKey?: string
  searchPlaceholder?: string
  pageSize?: number
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKey,
  searchPlaceholder = "Search...",
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("")
  const [sortField, setSortField] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSizeState, setPageSizeState] = React.useState(pageSize)

  // Filter data
  const filteredData = React.useMemo(() => {
    if (!search || !searchKey) return data
    
    return data.filter((item) => {
      const value = item[searchKey]
      return value?.toString().toLowerCase().includes(search.toLowerCase())
    })
  }, [data, search, searchKey])

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortField) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortField, sortDirection])

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSizeState
    const end = start + pageSizeState
    return sortedData.slice(start, end)
  }, [sortedData, currentPage, pageSizeState])

  const totalPages = Math.ceil(sortedData.length / pageSizeState)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getValue = (row: T, key: keyof T | string) => {
    if (typeof key === "string" && key.includes(".")) {
      return key.split(".").reduce((obj, k) => obj?.[k], row)
    }
    return row[key as keyof T]
  }

  return (
    <div className={className}>
      {/* Search and controls */}
      {(searchKey || pageSize !== 10) && (
        <div className="flex items-center justify-between mb-4">
          {searchKey && (
            <div className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Rows per page
            </p>
            <Select
              value={pageSizeState.toString()}
              onValueChange={(value) => {
                setPageSizeState(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key as string}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.key as string)}
                      className="h-auto p-0 font-semibold"
                    >
                      {column.label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key as string}>
                      {column.render
                        ? column.render(getValue(row, column.key), row)
                        : String(getValue(row, column.key))}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * pageSizeState + 1, sortedData.length)} to{" "}
            {Math.min(currentPage * pageSizeState, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
