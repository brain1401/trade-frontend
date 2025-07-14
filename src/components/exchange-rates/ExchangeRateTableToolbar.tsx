"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { type Table } from "@tanstack/react-table";
import { Check, ChevronsUpDown, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ExchangeRate } from "@/lib/api/exchange-rates/types";

type CurrencyOption = {
  value: string;
  label: string;
};

type ExchangeRateTableToolbarProps<TData> = {
  table: Table<TData>;
  data: ExchangeRate[];
  baseAmount: number;
  setBaseAmount: (amount: number) => void;
  baseCurrency: string;
  setBaseCurrency: (currency: string) => void;
};

export function ExchangeRateTableToolbar<TData>({
  table,
  data,
  baseAmount,
  setBaseAmount,
  baseCurrency,
  setBaseCurrency,
}: ExchangeRateTableToolbarProps<TData>) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // currencyOptions 메모이제이션 - data 변경 시에만 재계산
  const currencyOptions = useMemo<CurrencyOption[]>(() => {
    // data가 없거나 빈 배열인 경우 기본값 반환
    if (data.length === 0) {
      return [{ value: "KRW", label: "대한민국 원 (KRW)" }];
    }

    // Map을 사용하여 중복된 통화 코드 제거
    const currencyMap = new Map<string, CurrencyOption>();

    // KRW를 먼저 추가 (최상단 고정)
    currencyMap.set("KRW", { value: "KRW", label: "대한민국 원 (KRW)" });

    // data에서 고유한 통화들을 추가
    data.forEach((rate) => {
      if (
        rate.currencyCode &&
        rate.currencyName &&
        !currencyMap.has(rate.currencyCode)
      ) {
        currencyMap.set(rate.currencyCode, {
          value: rate.currencyCode,
          label: `${rate.currencyName} (${rate.currencyCode})`,
        });
      }
    });

    return Array.from(currencyMap.values());
  }, [data]);

  // 마지막 업데이트 시간 계산
  const lastUpdated = useMemo(() => {
    if (data.length === 0) {
      return null;
    }
    // 데이터 중에서 가장 최신 lastUpdated 값을 찾음
    // 각 ExchangeRate 객체에 lastUpdated가 직접 있다고 가정
    const latestDate = data.reduce(
      (latest, current) => {
        if (current.lastUpdated) {
          const currentDate = new Date(current.lastUpdated);
          if (latest === null || currentDate > latest) {
            return currentDate;
          }
        }
        return latest;
      },
      null as Date | null,
    );

    return latestDate ? latestDate.toLocaleString("ko-KR") : null;
  }, [data]);

  // 기준 금액 변경 핸들러 최적화
  const handleBaseAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBaseAmount(Number(e.target.value));
    },
    [setBaseAmount],
  );

  // 통화 선택 핸들러 최적화
  const handleCurrencySelect = useCallback(
    (currentValue: string) => {
      setBaseCurrency(
        currentValue.toUpperCase() === baseCurrency
          ? ""
          : currentValue.toUpperCase(),
      );
      setOpen(false);
    },
    [baseCurrency, setBaseCurrency],
  );

  // 검색어 디바운싱을 위한 useEffect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      table.getColumn("koreanName")?.setFilterValue(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, table]);

  // 검색어 변경 핸들러 최적화
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    [],
  );

  // 컬럼 가시성 토글 핸들러 최적화
  const handleColumnToggle = useCallback(
    (columnId: string) => (checked: boolean) => {
      table.getColumn(columnId)?.toggleVisibility(checked);
    },
    [table],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-md border p-4">
        <span className="text-sm font-medium">환율 계산기 : </span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[250px] justify-between"
            >
              {baseCurrency
                ? currencyOptions.find(
                    (option) => option.value === baseCurrency,
                  )?.label
                : "통화 선택..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0">
            <Command>
              <CommandInput placeholder="통화 검색..." />
              <CommandList>
                <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                <CommandGroup>
                  {currencyOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleCurrencySelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          baseCurrency === option.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Input
          type="number"
          value={baseAmount}
          onChange={handleBaseAmountChange}
          className="w-36 bg-white"
          aria-label="기준 금액"
        />
        <span className="text-sm font-medium" />
      </div>
      <div className="flex items-center">
        <Input
          placeholder="국가명 검색..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
        {/* 마지막 업데이트 시간 표시 */}
        {lastUpdated && (
          <div className="ml-3 text-sm text-neutral-500">
            기준 시간: {lastUpdated}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              컬럼 표시 <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={handleColumnToggle(column.id)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
