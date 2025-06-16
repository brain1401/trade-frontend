import { useState } from "react";
import {
  CalendarDays,
  Filter,
  Globe,
  ArrowUpDown,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { DateRange as ReactDayPickerDateRange } from "react-day-picker";
import type {
  CountryOption,
  PeriodOption,
  DateRange,
} from "@/data/mock/tradeStatistics";

// 확장된 필터 옵션 타입 정의
export type ExtendedFilterOptions = {
  selectedCountry: string;
  selectedPeriod: string;
  dateRange?: DateRange;
  useCustomDateRange: boolean;
  // 새로운 필터 옵션들
  exportCountries: string[]; // 수출 대상국 필터
  importCountries: string[]; // 수입 대상국 필터
  tradeType: "all" | "export" | "import"; // 무역 유형
  minTradeValue?: number; // 최소 거래액
  showBalanceOnly: boolean; // 흑자/적자만 표시
};

// 컴포넌트 Props 타입
type TradeStatisticsFilterModalProps = {
  countries: CountryOption[];
  periods: PeriodOption[];
  filterOptions: ExtendedFilterOptions;
  onFilterChange: (options: ExtendedFilterOptions) => void;
  className?: string;
};

// THEME_GUIDE.md 기준 Dialog 패턴 적용
export default function TradeStatisticsFilterModal({
  countries,
  periods,
  filterOptions,
  onFilterChange,
  className,
}: TradeStatisticsFilterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [localFilterOptions, setLocalFilterOptions] =
    useState<ExtendedFilterOptions>(filterOptions);

  // 필터 적용 핸들러
  const handleApplyFilters = () => {
    onFilterChange(localFilterOptions);
    setIsOpen(false);
  };

  // 활성 필터 개수 계산
  const activeFiltersCount =
    (filterOptions.selectedCountry !== "ALL" ? 1 : 0) +
    (filterOptions.exportCountries.length > 0 ? 1 : 0) +
    (filterOptions.importCountries.length > 0 ? 1 : 0) +
    (filterOptions.tradeType !== "all" ? 1 : 0) +
    (filterOptions.showBalanceOnly ? 1 : 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex items-center space-x-2 border-neutral-300 bg-neutral-50 text-neutral-700 hover:bg-neutral-100",
            className,
          )}
        >
          <Settings size={16} />
          <span>상세 필터</span>
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs text-white">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Filter className="text-primary-600" size={20} />
            <span>무역 통계 상세 필터</span>
          </DialogTitle>
          <DialogDescription>
            다양한 조건으로 무역 통계를 필터링하여 원하는 정보를 확인하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 필터 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-800">
              기본 필터
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* 국가 선택 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-700">
                  <Globe className="mr-1.5 inline" size={14} />
                  대상 국가
                </Label>
                <Select
                  value={localFilterOptions.selectedCountry}
                  onValueChange={(value) =>
                    setLocalFilterOptions({
                      ...localFilterOptions,
                      selectedCountry: value,
                    })
                  }
                >
                  <SelectTrigger>
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
                <Label className="text-sm font-medium text-neutral-700">
                  <CalendarDays className="mr-1.5 inline" size={14} />
                  기간 선택
                </Label>
                <Select
                  value={localFilterOptions.selectedPeriod}
                  onValueChange={(value) =>
                    setLocalFilterOptions({
                      ...localFilterOptions,
                      selectedPeriod: value,
                      useCustomDateRange: false,
                    })
                  }
                >
                  <SelectTrigger>
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
            </div>
          </div>

          <Separator />

          {/* 수출 국가 필터 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-800">
              수출 대상국 필터
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {countries
                .filter((country) => country.code !== "ALL")
                .map((country) => (
                  <div
                    key={`export-${country.code}`}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`export-${country.code}`}
                      checked={localFilterOptions.exportCountries.includes(
                        country.code,
                      )}
                      onCheckedChange={(checked) => {
                        const updatedCountries = checked
                          ? [
                              ...localFilterOptions.exportCountries,
                              country.code,
                            ]
                          : localFilterOptions.exportCountries.filter(
                              (c) => c !== country.code,
                            );
                        setLocalFilterOptions({
                          ...localFilterOptions,
                          exportCountries: updatedCountries,
                        });
                      }}
                    />
                    <Label
                      htmlFor={`export-${country.code}`}
                      className="cursor-pointer text-sm font-medium text-neutral-700"
                    >
                      {country.flag} {country.name}
                    </Label>
                  </div>
                ))}
            </div>
          </div>

          <Separator />

          {/* 수입 국가 필터 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-800">
              수입 대상국 필터
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {countries
                .filter((country) => country.code !== "ALL")
                .map((country) => (
                  <div
                    key={`import-${country.code}`}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`import-${country.code}`}
                      checked={localFilterOptions.importCountries.includes(
                        country.code,
                      )}
                      onCheckedChange={(checked) => {
                        const updatedCountries = checked
                          ? [
                              ...localFilterOptions.importCountries,
                              country.code,
                            ]
                          : localFilterOptions.importCountries.filter(
                              (c) => c !== country.code,
                            );
                        setLocalFilterOptions({
                          ...localFilterOptions,
                          importCountries: updatedCountries,
                        });
                      }}
                    />
                    <Label
                      htmlFor={`import-${country.code}`}
                      className="cursor-pointer text-sm font-medium text-neutral-700"
                    >
                      {country.flag} {country.name}
                    </Label>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="flex justify-between space-x-4 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              const resetOptions: ExtendedFilterOptions = {
                selectedCountry: "ALL",
                selectedPeriod: "12m",
                useCustomDateRange: false,
                exportCountries: [],
                importCountries: [],
                tradeType: "all",
                showBalanceOnly: false,
              };
              setLocalFilterOptions(resetOptions);
            }}
            className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
          >
            필터 초기화
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              취소
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-primary-600 text-white hover:bg-primary-700"
            >
              필터 적용
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
