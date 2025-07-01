import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { FlagIcon } from "@/components/common/FlagIcon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ExchangeRateCardProps } from "./ExchangeRateCard";

const krwFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
});

export const columns: ColumnDef<ExchangeRateCardProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "koreanName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          국가
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { koreanName, flagUrl } = row.original;
      return (
        <div className="flex items-center space-x-2">
          <FlagIcon
            src={flagUrl}
            alt={`${koreanName} 국기`}
            className="h-5 w-7"
          />
          <span>{koreanName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "currencyCode",
    header: "통화코드",
  },
  {
    accessorKey: "importRate",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            수입 환율
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const importRate = row.original.importRate;
      if (!importRate) {
        return <div className="text-right text-neutral-500">N/A</div>;
      }
      return (
        <div className="text-right font-medium">
          {krwFormatter.format(importRate.exchangeRate)}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const rateA = rowA.original.importRate?.exchangeRate ?? -1;
      const rateB = rowB.original.importRate?.exchangeRate ?? -1;
      return rateA - rateB;
    },
  },
  {
    accessorKey: "exportRate",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            수출 환율
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const exportRate = row.original.exportRate;
      if (!exportRate) {
        return <div className="text-right text-neutral-500">N/A</div>;
      }
      return (
        <div className="text-right font-medium">
          {krwFormatter.format(exportRate.exchangeRate)}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const rateA = rowA.original.exportRate?.exchangeRate ?? -1;
      const rateB = rowB.original.exportRate?.exchangeRate ?? -1;
      return rateA - rateB;
    },
  },
  {
    id: "lastUpdated",
    accessorFn: (row) =>
      row.importRate?.lastUpdated || row.exportRate?.lastUpdated,
    header: () => <div className="text-center">기준 시간</div>,
    cell: ({ row }) => {
      const lastUpdated =
        row.original.importRate?.lastUpdated ||
        row.original.exportRate?.lastUpdated;
      if (!lastUpdated) {
        return <div className="text-center text-neutral-500">N/A</div>;
      }
      return (
        <div className="text-center">
          {new Date(lastUpdated).toLocaleString("ko-KR")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { currencyCode } = row.original;

      return (
        <div className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>작업</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(currencyCode)}
              >
                통화코드 복사
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
