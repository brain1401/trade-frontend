import { useState } from "react";
import { CalendarDays, Filter, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { DateRange as ReactDayPickerDateRange } from "react-day-picker";
import type {
  CountryOption,
  PeriodOption,
  DateRange,
} from "@/data/mock/tradeStatistics";

// 필터 옵션 타입 정의
export type FilterOptions = {
  selectedCountry: string;
  selectedPeriod: string;
  dateRange?: DateRange;
  useCustomDateRange: boolean;
};

// 컴포넌트 Props 타입
type TradeStatisticsFilterProps = {
  countries: CountryOption[];
  periods: PeriodOption[];
  filterOptions: FilterOptions;
  onFilterChange: (options: FilterOptions) => void;
  className?: string;
};

// THEME_GUIDE.md 기준 ContentCard 패턴 적용
export default function TradeStatisticsFilter({
  countries,
  periods,
  filterOptions,
  onFilterChange,
  className,
}: TradeStatisticsFilterProps) {
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);

  // 국가 선택 변경 핸들러
  const handleCountryChange = (countryCode: string) => {
    onFilterChange({
      ...filterOptions,
      selectedCountry: countryCode,
    });
  };

  // 기간 선택 변경 핸들러
  const handlePeriodChange = (periodValue: string) => {
    onFilterChange({
      ...filterOptions,
      selectedPeriod: periodValue,
      useCustomDateRange: false,
    });
  };

  // 커스텀 날짜 범위 선택 핸들러
  const handleDateRangeChange = (
    dateRange: ReactDayPickerDateRange | undefined,
  ) => {
    if (dateRange?.from && dateRange?.to) {
      onFilterChange({
        ...filterOptions,
        dateRange: {
          from: dateRange.from,
          to: dateRange.to,
        },
        useCustomDateRange: true,
      });
    }
  };

  // 선택된 국가 정보 조회
  const selectedCountryInfo = countries.find(
    (c) => c.code === filterOptions.selectedCountry,
  );

  // 선택된 기간 정보 조회
  const selectedPeriodInfo = periods.find(
    (p) => p.value === filterOptions.selectedPeriod,
  );

  return (
    <Card className={cn("mb-4 py-0", className)}>
      {/* 헤더 섹션 - THEME_GUIDE.md 패턴 준수 */}
      <div className="flex flex-row items-center justify-between border-b p-4 md:p-4">
        <div className="flex items-center space-x-2">
          <Filter className="text-primary-600" size={20} />
          <h2 className="!mt-0 text-lg font-semibold text-neutral-800">
            통계 필터
          </h2>
        </div>
        <div className="text-xs text-neutral-500">
          {selectedCountryInfo?.flag} {selectedCountryInfo?.name} ·{" "}
          {filterOptions.useCustomDateRange
            ? "커스텀 기간"
            : selectedPeriodInfo?.label}
        </div>
      </div>

      {/* 필터 컨트롤 섹션 */}
      <div className="p-4 md:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* 국가 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              <Globe className="mr-1.5 inline" size={14} />
              대상 국가
            </label>
            <Select
              value={filterOptions.selectedCountry}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="국가를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center space-x-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 기간 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              <CalendarDays className="mr-1.5 inline" size={14} />
              기간 선택
            </label>
            <Select
              value={filterOptions.selectedPeriod}
              onValueChange={handlePeriodChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="기간을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 커스텀 날짜 범위 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              커스텀 기간
            </label>
            <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filterOptions.dateRange && "text-neutral-500",
                  )}
                >
                  <CalendarDays className="mr-2" size={14} />
                  {filterOptions.dateRange?.from ? (
                    filterOptions.dateRange.to ? (
                      <>
                        {format(filterOptions.dateRange.from, "PPP", {
                          locale: ko,
                        })}{" "}
                        -{" "}
                        {format(filterOptions.dateRange.to, "PPP", {
                          locale: ko,
                        })}
                      </>
                    ) : (
                      format(filterOptions.dateRange.from, "PPP", {
                        locale: ko,
                      })
                    )
                  ) : (
                    "날짜 범위 선택"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filterOptions.dateRange?.from}
                  selected={filterOptions.dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* 필터 요약 정보 */}
        <div className="mt-4 rounded-lg bg-neutral-50 p-3">
          <p className="text-sm text-neutral-600">
            <strong className="text-neutral-800">현재 필터:</strong>{" "}
            {selectedCountryInfo?.flag} {selectedCountryInfo?.name}
            {filterOptions.selectedCountry !== "ALL" && "과의 무역"}
            {" · "}
            {filterOptions.useCustomDateRange && filterOptions.dateRange
              ? `${format(filterOptions.dateRange.from, "yyyy.MM", { locale: ko })} - ${format(filterOptions.dateRange.to, "yyyy.MM", { locale: ko })}`
              : selectedPeriodInfo?.label}
          </p>
        </div>
      </div>
    </Card>
  );
}
