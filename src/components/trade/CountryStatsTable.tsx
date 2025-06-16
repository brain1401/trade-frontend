import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";
import ContentCard from "@/components/common/ContentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type CountryStatsData = {
  rank: number;
  countryCode: string;
  countryName: string;
  flag: string;
  exportValue: number;
  importValue: number;
  tradeBalance: number;
  exportGrowth: number;
  importGrowth: number;
  tradeShare: number;
};

type CountryStatsTableProps = {
  data: CountryStatsData[];
  title: string;
  className?: string;
};

// 값 포맷팅 함수
const formatValue = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  return `${(value / 1_000).toFixed(0)}K`;
};

// 성장률 포맷팅 함수
const formatGrowthRate = (rate: number): string => {
  const sign = rate >= 0 ? "+" : "";
  return `${sign}${rate.toFixed(1)}%`;
};

// 성장률 뱃지 스타일 결정 함수
const getGrowthBadgeVariant = (
  rate: number,
): "default" | "secondary" | "destructive" => {
  if (rate > 5) return "default"; // 파란색 (높은 성장)
  if (rate >= 0) return "secondary"; // 회색 (보통 성장)
  return "destructive"; // 빨간색 (마이너스 성장)
};

// 정렬 상태 아이콘 컴포넌트
const SortIcon = ({ isSorted }: { isSorted: false | "asc" | "desc" }) => {
  if (isSorted === "asc") {
    return <ArrowUp size={12} className="ml-1" />;
  }
  if (isSorted === "desc") {
    return <ArrowDown size={12} className="ml-1" />;
  }
  return <ArrowUpDown size={12} className="ml-1" />;
};

const CountryStatsTable = ({
  data,
  title,
  className = "",
}: CountryStatsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  // TanStack Table 컬럼 정의 (타입 안정성을 위해 직접 정의)
  const columns = useMemo<ColumnDef<CountryStatsData>[]>(
    () => [
      {
        accessorKey: "rank",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs font-medium tracking-wider text-neutral-700 uppercase hover:text-neutral-900"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            순위
            <SortIcon isSorted={column.getIsSorted()} />
          </Button>
        ),
        cell: ({ getValue }) => (
          <div className="flex items-center">
            <span className="text-lg font-bold text-neutral-500">
              {getValue() as number}
            </span>
          </div>
        ),
        enableSorting: true,
      },

      {
        accessorKey: "countryName",
        header: "국가",
        cell: ({ row }) => (
          <div className="flex items-center">
            <span className="mr-2 text-xl">{row.original.flag}</span>
            <div>
              <div className="font-medium text-neutral-800">
                {row.original.countryName}
              </div>
              <div className="text-xs text-neutral-500">
                {row.original.countryCode}
              </div>
            </div>
          </div>
        ),
        enableSorting: true,
      },

      {
        accessorKey: "exportValue",
        header: ({ column }) => (
          <div className="text-right">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs font-medium tracking-wider text-neutral-700 uppercase hover:text-neutral-900"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <SortIcon isSorted={column.getIsSorted()} />
              수출액
            </Button>
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="text-right font-medium text-neutral-800">
            ${formatValue(getValue() as number)}
          </div>
        ),
        enableSorting: true,
      },

      {
        accessorKey: "importValue",
        header: ({ column }) => (
          <div className="text-right">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs font-medium tracking-wider text-neutral-700 uppercase hover:text-neutral-900"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <SortIcon isSorted={column.getIsSorted()} />
              수입액
            </Button>
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="text-right font-medium text-neutral-800">
            ${formatValue(getValue() as number)}
          </div>
        ),
        enableSorting: true,
      },

      {
        accessorKey: "tradeBalance",
        header: "무역수지",
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return (
            <div
              className={cn(
                "text-right font-medium",
                value >= 0 ? "text-info-500" : "text-danger-500",
              )}
            >
              {formatValue(Math.abs(value))}
            </div>
          );
        },
        enableSorting: true,
      },

      {
        id: "growth",
        header: "성장률",
        cell: ({ row }) => (
          <div className="flex flex-col items-center space-y-1">
            <Badge
              variant={getGrowthBadgeVariant(row.original.exportGrowth)}
              className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
            >
              수출 {formatGrowthRate(row.original.exportGrowth)}
            </Badge>
            <Badge
              variant={getGrowthBadgeVariant(row.original.importGrowth)}
              className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
            >
              수입 {formatGrowthRate(row.original.importGrowth)}
            </Badge>
          </div>
        ),
        enableSorting: false,
      },

      {
        accessorKey: "tradeShare",
        header: ({ column }) => (
          <div className="text-right">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs font-medium tracking-wider text-neutral-700 uppercase hover:text-neutral-900"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <SortIcon isSorted={column.getIsSorted()} />
              점유율
            </Button>
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="text-right font-medium text-neutral-800">
            {(getValue() as number).toFixed(1)}%
          </div>
        ),
        enableSorting: true,
      },
    ],
    [],
  );

  // TanStack Table 인스턴스 생성
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <ContentCard
      title={title}
      className={className}
      titleRightElement={
        <Button
          variant="link"
          size="sm"
          className="flex h-auto items-center p-0 text-sm text-primary-600 hover:underline"
        >
          전체보기 <ChevronRight size={16} className="ml-0.5" />
        </Button>
      }
    >
      {/* 데스크톱 테이블 뷰 */}
      <div className="hidden md:block">
        <div className="w-full overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="bg-neutral-50 px-4 py-3 text-left text-xs font-medium tracking-wider text-neutral-700 uppercase"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3 text-sm text-neutral-800"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 모바일 반응형 카드 뷰 */}
      <div className="mt-4 block space-y-3 md:hidden">
        {table.getRowModel().rows.map((row) => {
          const country = row.original;
          return (
            <div key={row.id} className="rounded-lg border bg-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2 text-lg font-bold text-neutral-500">
                    {country.rank}
                  </span>
                  <span className="mr-2 text-xl">{country.flag}</span>
                  <div>
                    <div className="font-medium text-neutral-800">
                      {country.countryName}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {country.countryCode}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-600">점유율</div>
                  <div className="font-medium text-neutral-800">
                    {country.tradeShare.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-neutral-600">수출액</div>
                  <div className="font-medium text-neutral-800">
                    ${formatValue(country.exportValue)}
                  </div>
                </div>
                <div>
                  <div className="text-neutral-600">수입액</div>
                  <div className="font-medium text-neutral-800">
                    ${formatValue(country.importValue)}
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-2">
                <div className="flex space-x-2">
                  <Badge
                    variant={getGrowthBadgeVariant(country.exportGrowth)}
                    className="rounded-full px-2 py-0.5 text-xs"
                  >
                    수출 {formatGrowthRate(country.exportGrowth)}
                  </Badge>
                  <Badge
                    variant={getGrowthBadgeVariant(country.importGrowth)}
                    className="rounded-full px-2 py-0.5 text-xs"
                  >
                    수입 {formatGrowthRate(country.importGrowth)}
                  </Badge>
                </div>
                <div
                  className={cn(
                    "text-sm font-medium",
                    country.tradeBalance >= 0
                      ? "text-info-500"
                      : "text-danger-500",
                  )}
                >
                  {formatValue(Math.abs(country.tradeBalance))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ContentCard>
  );
};

export default CountryStatsTable;
export type { CountryStatsData };
