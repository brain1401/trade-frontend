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
import type { SimplifiedExchangeRate } from "./ExchangeRateTable";

type CreateColumnsProps = {
  baseCurrency: string;
};

const createFormatter = (currency: string) => {
  try {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  } catch (e) {
    // 지원하지 않는 통화 코드의 경우, 통화 표시 없이 숫자만 표시
    return new Intl.NumberFormat("ko-KR", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }
};

export const createColumns = ({
  baseCurrency,
}: CreateColumnsProps): ColumnDef<SimplifiedExchangeRate>[] => {
  const krwFormatter = createFormatter("KRW");

  return [
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          국가
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
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
      accessorKey: "rate",
      header: ({ column }) => (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            원화 환율
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const rate = row.original.rate;
        if (rate === null) {
          return <div className="text-right text-neutral-500">N/A</div>;
        }
        return (
          <div className="text-right font-medium">
            {krwFormatter.format(rate)}
          </div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const rateA = rowA.original.rate ?? -1;
        const rateB = rowB.original.rate ?? -1;
        return rateA - rateB;
      },
    },
    {
      id: "convertedAmount",
      header: () => (
        <div className="text-right">{`변환된 금액 (${baseCurrency})`}</div>
      ),
      cell: ({ row, table }) => {
        const allRows = table.options.data;
        const baseCurrencyInfo = allRows.find(
          (r) => r.currencyCode === baseCurrency,
        );

        // KRW를 base로 할 경우, KRW는 데이터 목록에 없으므로 baseRate는 1로 처리
        const baseRate =
          baseCurrency === "KRW" ? 1 : (baseCurrencyInfo?.rate ?? null);
        const currentRowRate = row.original.rate;

        if (currentRowRate === null || baseRate === null) {
          return <div className="text-right text-neutral-500">N/A</div>;
        }

        const baseAmount = (
          table.options.meta as { baseAmount?: number } | undefined
        )?.baseAmount;

        if (typeof baseAmount !== "number") {
          return <div className="text-right text-neutral-500">-</div>;
        }

        // 현재 행이 기준 통화와 같을 경우, 입력된 금액을 그대로 표시
        if (row.original.currencyCode === baseCurrency) {
          return (
            <div className="text-right font-bold text-primary-600">
              {createFormatter(baseCurrency).format(baseAmount)}
            </div>
          );
        }

        const convertedAmount = (baseAmount * baseRate) / currentRowRate;
        return (
          <div className="text-right font-bold text-primary-600">
            {createFormatter(row.original.currencyCode).format(convertedAmount)}
          </div>
        );
      },
      enableSorting: false,
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
};
