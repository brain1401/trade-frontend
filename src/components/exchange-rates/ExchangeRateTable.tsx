"use client";

import { useMemo, useState } from "react";
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createColumns } from "./ExchangeRateColumn";
import { useConsolidatedExchangeRates } from "@/hooks/useConsolidatedExchangeRates";
import type { ExchangeRate } from "@/lib/api";
import { ExchangeRateTableToolbar } from "./ExchangeRateTableToolbar";
import { Button } from "../ui/button";

export type SimplifiedExchangeRate = {
  currencyCode: string;
  koreanName: string;
  flagUrl: string;
  rate: number | null;
};

type Props = {
  data: ExchangeRate[];
};

export default function ExchangeRateTable({ data }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [baseAmount, setBaseAmount] = useState(32300);
  const [baseCurrency, setBaseCurrency] = useState("JPY");

  const consolidatedRates = useConsolidatedExchangeRates(data);

  const simplifiedData = useMemo((): SimplifiedExchangeRate[] => {
    return consolidatedRates.map((item) => ({
      currencyCode: item.currencyCode,
      koreanName: item.koreanName,
      flagUrl: item.flagUrl,
      rate:
        item.importRate?.exchangeRate ?? item.exportRate?.exchangeRate ?? null,
    }));
  }, [consolidatedRates]);

  const columns = useMemo(
    () => createColumns({ baseCurrency }),
    [baseCurrency],
  );

  const table = useReactTable({
    data: simplifiedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      baseAmount,
    },
  });

  return (
    <div className="w-full space-y-4">
      <ExchangeRateTableToolbar
        table={table}
        data={data}
        baseAmount={baseAmount}
        setBaseAmount={setBaseAmount}
        baseCurrency={baseCurrency}
        setBaseCurrency={setBaseCurrency}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} /{" "}
          {table.getFilteredRowModel().rows.length} 개 선택됨
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            이전
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
