import { Suspense, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { addYears, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  AlertCircle,
  Check,
  ChevronsUpDown,
  Loader2,
  Search,
} from "lucide-react";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { z } from "zod";

import { TradeBalanceChart } from "@/components/statistics/TradeBalanceChart";
import { TopExportItems } from "@/components/statistics/TopExportItems";
import { TopImportItems } from "@/components/statistics/TopImportItems";
import { TradeOverviewSummary } from "@/components/statistics/TradeOverviewSummary";
import { statisticsQueries } from "@/lib/api/statistics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { YearCombobox } from "@/components/statistics/YearCombobox";
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
import { DateRangePicker } from "@/components/ui/date-range-picker";

const REPORTER_CODE = "410"; // 대한민국
type Country = (typeof countries)[number];

// 검색 파라미터 스키마 정의
const statsSearchSchema = z.object({
  partnerCode: z.string().optional().default("156"),
  startYear: z.string().optional().default("2024"),
  endYear: z.string().optional().default("2024"),
});

export const Route = createFileRoute("/statistics/")({
  validateSearch: (search) => statsSearchSchema.parse(search),
  component: StatisticsPage,
});

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
            ? countries.find((country) => country.value === value)?.label
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
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={country.label}
                  onSelect={() => {
                    onChange(country.value);
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
  } = useQuery({
    ...statisticsQueries.detail({
      reporterCode: REPORTER_CODE,
      partnerCode: partnerCode,
      StartPeriod: startPeriod,
      EndPeriod: endPeriod,
    }),
    staleTime: 1000 * 60 * 20, // 20분
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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

  if (!statsData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>데이터 없음</AlertTitle>
        <AlertDescription>
          선택된 국가와 기간에 대한 통계 데이터가 없습니다. 다른 조건을
          선택해주세요.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. 총 수출액, 총 수입액, 무역수지 */}
      <TradeOverviewSummary
        exportValue={statsData.totalExportValue}
        importValue={statsData.totalImportValue}
      />

      {/* 2. 주요 수출/수입 카테고리 그래프 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TradeBalanceChart
          title="주요 수출 카테고리"
          data={statsData.topExportCategories}
          category="수출액(억 달러)"
          color="blue"
        />
        <TradeBalanceChart
          title="주요 수입 카테고리"
          data={statsData.topImportCategories}
          category="수입액(억 달러)"
          color="cyan"
        />
      </div>

      {/* 3. 주요 수출/수입 품목 TOP 5 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
        <TopExportItems
          title="주요 수출 품목 TOP 5"
          data={statsData.topExportProducts}
        />
        <TopImportItems
          title="주요 수입 품목 TOP 5"
          data={statsData.topImportProducts}
        />
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트
function StatisticsPage() {
  const searchParams = useSearch({ from: "/statistics/" });
  const navigate = useNavigate({ from: "/statistics" });

  const [currentPartnerCode, setCurrentPartnerCode] = useState(
    searchParams.partnerCode,
  );
  const [currentStartYear, setCurrentStartYear] = useState(
    searchParams.startYear,
  );
  const [currentEndYear, setCurrentEndYear] = useState(searchParams.endYear);

  // URL 파라미터가 변경될 때 UI 상태도 동기화
  useEffect(() => {
    setCurrentPartnerCode(searchParams.partnerCode);
    setCurrentStartYear(searchParams.startYear);
    setCurrentEndYear(searchParams.endYear);
  }, [searchParams]);

  // 검색 버튼 클릭 시 URL 파라미터를 업데이트하여 데이터 재조회
  const handleSearch = () => {
    navigate({
      search: {
        partnerCode: currentPartnerCode,
        startYear: currentStartYear,
        endYear: currentEndYear,
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">무역 통계 대시보드</h1>

        {/* 필터링 UI 영역 */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {/* 연도 입력 필드 */}
          <div className="flex items-end gap-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="startYear">시작 연도</Label>
              <YearCombobox
                value={currentStartYear}
                onChange={setCurrentStartYear}
              />
            </div>
            <span className="pb-2">~</span>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="endYear">종료 연도</Label>
              <YearCombobox
                value={currentEndYear}
                onChange={setCurrentEndYear}
              />
            </div>
          </div>

          {/* 국가 선택 콤보박스 */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>상대 국가</Label>
            <CountryCombobox
              value={currentPartnerCode}
              onChange={setCurrentPartnerCode}
            />
          </div>

          {/* 검색 버튼 */}
          <Button onClick={handleSearch} className="self-end">
            <Search className="mr-2 h-4 w-4" />
            검색
          </Button>
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
        {searchParams.partnerCode &&
        searchParams.startYear &&
        searchParams.endYear ? (
          <StatisticsContent
            partnerCode={searchParams.partnerCode}
            startPeriod={searchParams.startYear}
            endPeriod={searchParams.endYear}
          />
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>국가 및 기간 선택</AlertTitle>
            <AlertDescription>
              상대 국가와 조회 기간을 선택하여 무역 통계를 확인하세요.
            </AlertDescription>
          </Alert>
        )}
      </Suspense>
    </div>
  );
}
