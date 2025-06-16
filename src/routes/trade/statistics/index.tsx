import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import StatisticsSummaryCard from "@/components/trade/StatisticsSummaryCard";
import TradeBalanceChart from "@/components/trade/TradeBalanceChart";
import CountryStatsTable from "@/components/trade/CountryStatsTable";
import ProductStatsGrid from "@/components/trade/ProductStatsGrid";
import TradeStatisticsFilterModal, {
  type ExtendedFilterOptions,
} from "@/components/trade/TradeStatisticsFilterModal";
import {
  getStatisticsSummary,
  getTopExportCountries,
  getTopImportCountries,
  getTopExportProducts,
  getTopImportProducts,
  getCountryFilteredData,
  getDateRangeFilteredData,
  availableCountries,
  periodOptions,
} from "@/data/mock/tradeStatistics";

export const Route = createFileRoute("/trade/statistics/")({
  component: RouteComponent,
});

// 공통 스타일 상수 (THEME_GUIDE.md 기준)
const CARD_SPACING_CLASSES = "mt-8";

function RouteComponent() {
  // 필터 상태 관리 (확장된 필터 옵션)
  const [filterOptions, setFilterOptions] = useState<ExtendedFilterOptions>({
    selectedCountry: "ALL",
    selectedPeriod: "12m",
    useCustomDateRange: false,
    exportCountries: [],
    importCountries: [],
    tradeType: "all",
    showBalanceOnly: false,
  });

  // 필터링된 데이터 계산 (메모이제이션 적용 - 확장된 필터 지원)
  const filteredData = useMemo(() => {
    let baseData;

    if (filterOptions.useCustomDateRange && filterOptions.dateRange) {
      // 커스텀 날짜 범위 사용 시
      const balanceChart = getDateRangeFilteredData(filterOptions.dateRange);
      baseData = {
        summary: getStatisticsSummary(),
        balanceChart,
        exportCountries: getTopExportCountries(6),
        importCountries: getTopImportCountries(6),
        exportProducts: getTopExportProducts(6),
        importProducts: getTopImportProducts(6),
      };
    } else {
      // 국가 및 기간 필터 사용 시
      baseData = getCountryFilteredData(
        filterOptions.selectedCountry,
        filterOptions.selectedPeriod,
      );
    }

    // 확장된 필터 옵션 적용
    let filteredExportCountries = baseData.exportCountries;
    let filteredImportCountries = baseData.importCountries;

    // 수출 국가 필터 적용
    if (filterOptions.exportCountries.length > 0) {
      filteredExportCountries = filteredExportCountries.filter((country) =>
        filterOptions.exportCountries.includes(country.countryCode),
      );
    }

    // 수입 국가 필터 적용
    if (filterOptions.importCountries.length > 0) {
      filteredImportCountries = filteredImportCountries.filter((country) =>
        filterOptions.importCountries.includes(country.countryCode),
      );
    }

    // 무역수지 필터 적용
    if (filterOptions.showBalanceOnly) {
      filteredExportCountries = filteredExportCountries.filter(
        (country) => Math.abs(country.tradeBalance) > 0,
      );
      filteredImportCountries = filteredImportCountries.filter(
        (country) => Math.abs(country.tradeBalance) > 0,
      );
    }

    return {
      ...baseData,
      exportCountries: filteredExportCountries,
      importCountries: filteredImportCountries,
    };
  }, [filterOptions]);

  // 필터 변경 핸들러
  const handleFilterChange = (newOptions: ExtendedFilterOptions) => {
    setFilterOptions(newOptions);
  };

  return (
    <div className="w-full space-y-6">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">무역 통계</h1>
        <p className="text-sm text-neutral-600">
          국가별, 기간별 필터링을 통해 맞춤형 무역 통계 및 주요 지표를 확인하실
          수 있습니다.
        </p>
      </div>

      {/* 필터 섹션 - THEME_GUIDE.md 준수 (모달 방식) */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* 현재 필터 요약 정보 */}
        <div className="text-sm text-neutral-600">
          <span className="font-medium text-neutral-800">현재 필터:</span>
          {
            availableCountries.find(
              (c) => c.code === filterOptions.selectedCountry,
            )?.flag
          }{" "}
          {
            availableCountries.find(
              (c) => c.code === filterOptions.selectedCountry,
            )?.name
          }
          {" · "}
          {
            periodOptions.find((p) => p.value === filterOptions.selectedPeriod)
              ?.label
          }
          {(filterOptions.exportCountries.length > 0 ||
            filterOptions.importCountries.length > 0) && (
            <span className="text-primary-600">{" · "}세부 필터 적용 중</span>
          )}
        </div>

        {/* 필터 모달 버튼 */}
        <TradeStatisticsFilterModal
          countries={availableCountries}
          periods={periodOptions}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* 통계 요약 카드 - 필터링된 데이터 사용 */}
      <StatisticsSummaryCard data={filteredData.summary} />

      {/* 무역 수지 차트 - 필터링된 데이터 사용 */}
      <TradeBalanceChart
        data={filteredData.balanceChart}
        className={CARD_SPACING_CLASSES}
      />

      {/* 국가별 통계 테이블 섹션 - 필터링된 데이터 사용 (2행 배치) */}
      <div className="space-y-6">
        <CountryStatsTable
          data={filteredData.exportCountries}
          title="주요 수출 대상국"
        />
        <CountryStatsTable
          data={filteredData.importCountries}
          title="주요 수입 대상국"
        />
      </div>

      {/* 품목별 통계 그리드 섹션 - 필터링된 데이터 사용 */}
      <ProductStatsGrid
        data={filteredData.exportProducts}
        title="주요 수출 품목"
        className={CARD_SPACING_CLASSES}
      />

      <ProductStatsGrid
        data={filteredData.importProducts}
        title="주요 수입 품목"
        className={CARD_SPACING_CLASSES}
      />

      {/* 하단 안내 */}
      <div className="mt-12 border-t border-neutral-100 pt-6 text-center">
        <p className="text-xs text-neutral-500">
          데이터 출처: 관세청, UN COMTRADE | 최종 업데이트:{" "}
          {new Date().toLocaleDateString("ko-KR")}
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          * 모든 금액은 미국 달러(USD) 기준이며, 성장률은 전년 동월 대비
          기준입니다.
        </p>
      </div>
    </div>
  );
}
