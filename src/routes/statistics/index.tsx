import { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { addYears, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { AlertCircle, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { TradeBalanceChart } from "@/components/statistics/TradeBalanceChart";
import { MajorTradingPartners } from "@/components/statistics/MajorTradingPartners";
import { TopImportItems } from "@/components/statistics/TopImportItems";
import { TradeOverviewSummary } from "@/components/statistics/TradeOverviewSummary";
import { statisticsQueries } from "@/lib/api/statistics";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { countries } from "@/data/countries";
import { Skeleton } from "@/components/ui/skeleton";
import { createFileRoute } from "@tanstack/react-router";
import { DateRangePicker } from "@/components/ui/date-range-picker";

const REPORTER_CODE = "410"; // 대한민국

type Country = (typeof countries)[number];

function CountryCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? countries.find((country: Country) => country.value === value)
                ?.label
            : "국가 선택..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="국가 검색..." />
          <CommandList>
            <CommandEmpty>결과 없음.</CommandEmpty>
            <CommandGroup>
              {countries.map((country: Country) => (
                <CommandItem
                  key={country.value}
                  value={country.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === country.value ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {country.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function StatisticsContent({
  partnerCode,
  startPeriod,
  endPeriod,
}: {
  partnerCode: string;
  startPeriod: string;
  endPeriod: string;
}) {
  const {
    data: statsData,
    isError,
    isLoading,
    error,
  } = useQuery(
    statisticsQueries.detail({
      reporterCode: REPORTER_CODE,
      partnerCode: partnerCode,
      StartPeriod: startPeriod,
      EndPeriod: endPeriod,
    }),
  );

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>오류 발생</AlertTitle>
        <AlertDescription>
          데이터를 불러오는 중 오류가 발생했습니다: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-1/2 w-1/2 animate-spin" />
      </div>
    );
  }

  if (!statsData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>데이터 없음</AlertTitle>
        <AlertDescription>
          선택된 국가에 대한 통계 데이터가 존재하지 않거나 완전하지 않습니다.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <TradeOverviewSummary
        exportValue={statsData.totalExportValue}
        importValue={statsData.totalImportValue}
      />
      <TradeBalanceChart data={statsData.topExportCategories} />
      <MajorTradingPartners data={statsData.topExportProducts} />
      <TopImportItems data={statsData.topImportProducts} />
    </div>
  );
}

function StatisticsPage() {
  const [partnerCode, setPartnerCode] = useState<string>("840"); // 기본값: 미국
  const [date, setDate] = useState<DateRange | undefined>({
    from: addYears(new Date(), -1),
    to: new Date(),
  });

  const startPeriod = date?.from ? format(date.from, "yyyy") : undefined;
  const endPeriod = date?.to ? format(date.to, "yyyy") : undefined;

  const renderContent = () => {
    if (partnerCode && startPeriod && endPeriod) {
      return (
        <StatisticsContent
          partnerCode={partnerCode}
          startPeriod={startPeriod}
          endPeriod={endPeriod}
        />
      );
    }
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>국가 및 기간 선택</AlertTitle>
        <AlertDescription>
          상대 국가와 조회 기간을 선택하여 무역 통계를 확인하세요.
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">무역 통계 대시보드</h1>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <DateRangePicker date={date} onDateChange={setDate} />
          <CountryCombobox value={partnerCode} onChange={setPartnerCode} />
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        }
      >
        {renderContent()}
      </Suspense>
    </div>
  );
}

export const Route = createFileRoute("/statistics/")({
  component: StatisticsPage,
});
