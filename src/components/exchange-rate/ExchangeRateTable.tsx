import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Search, Star } from "lucide-react";
import ContentCard from "@/components/common/ContentCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  mockGlobalExchangeRates,
  getContinents,
  searchExchangeRates,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import { formatChange, formatRate } from "./utils";
import type { SortOption, SortDirection } from "./types";

// 환율 테이블 컴포넌트
function ExchangeRateTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("전체");
  const [showOnlyPopular, setShowOnlyPopular] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("currency");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // 필터링된 환율 데이터
  const filteredRates = useMemo(() => {
    const results = searchExchangeRates(
      searchQuery,
      selectedContinent,
      showOnlyPopular,
    );

    // 정렬 적용
    results.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "currency":
          aValue = a.currency;
          bValue = b.currency;
          break;
        case "rate":
          aValue = a.rate;
          bValue = b.rate;
          break;
        case "change":
          aValue = a.change;
          bValue = b.change;
          break;
        case "country":
          aValue = a.countryName;
          bValue = b.countryName;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? comparison : -comparison;
      } else {
        const comparison = (aValue as number) - (bValue as number);
        return sortDirection === "asc" ? comparison : -comparison;
      }
    });

    return results;
  }, [searchQuery, selectedContinent, showOnlyPopular, sortBy, sortDirection]);

  const handleSort = (column: SortOption) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const continents = getContinents();

  return (
    <ContentCard
      title="전 세계 환율 현황"
      titleRightElement={
        <div className="flex items-center space-x-2">
          <Badge
            variant="secondary"
            className="rounded-full px-2 py-0.5 text-xs"
          >
            {filteredRates.length}개 통화
          </Badge>
          <Badge variant="default" className="rounded-full px-2 py-0.5 text-xs">
            실시간
          </Badge>
        </div>
      }
    >
      {/* 검색 및 필터 */}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute top-1/2 left-3 -translate-y-1/2 transform text-neutral-400"
            />
            <Input
              placeholder="통화명, 국가명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedContinent}
            onValueChange={setSelectedContinent}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {continents.map((continent) => (
                <SelectItem key={continent} value={continent}>
                  {continent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={showOnlyPopular ? "default" : "outline"}
            size="sm"
            onClick={() => setShowOnlyPopular(!showOnlyPopular)}
            className="whitespace-nowrap"
          >
            <Star
              size={14}
              className={cn("mr-1", showOnlyPopular && "fill-current")}
            />
            인기 통화
          </Button>
        </div>
      </div>

      {/* 환율 테이블 */}
      <div className="rounded-lg border border-neutral-100">
        <ScrollArea className="h-96">
          <table className="w-full">
            <thead className="sticky top-0 border-b border-neutral-100 bg-neutral-50">
              <tr>
                <th
                  className="cursor-pointer p-3 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={() => handleSort("currency")}
                >
                  <div className="flex items-center space-x-1">
                    <span>통화</span>
                    {sortBy === "currency" &&
                      (sortDirection === "asc" ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      ))}
                  </div>
                </th>
                <th
                  className="cursor-pointer p-3 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={() => handleSort("country")}
                >
                  <div className="flex items-center space-x-1">
                    <span>국가</span>
                    {sortBy === "country" &&
                      (sortDirection === "asc" ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      ))}
                  </div>
                </th>
                <th
                  className="cursor-pointer p-3 text-right text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={() => handleSort("rate")}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>환율 (KRW)</span>
                    {sortBy === "rate" &&
                      (sortDirection === "asc" ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      ))}
                  </div>
                </th>
                <th
                  className="cursor-pointer p-3 text-right text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={() => handleSort("change")}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>변동률</span>
                    {sortBy === "change" &&
                      (sortDirection === "asc" ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      ))}
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-neutral-700">
                  대륙
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRates.map((rate) => (
                <tr
                  key={rate.currency}
                  className="hover:bg-neutral-25 cursor-pointer border-b border-neutral-100"
                >
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-neutral-800">
                        {rate.currency}
                      </span>
                      <span className="text-sm text-neutral-500">
                        {rate.symbol}
                      </span>
                      {rate.isPopular && (
                        <Star
                          size={12}
                          className="fill-current text-warning-500"
                        />
                      )}
                    </div>
                    <p className="text-xs text-neutral-500">
                      {rate.currencyName}
                    </p>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{rate.flag}</span>
                      <span className="text-sm text-neutral-800">
                        {rate.countryName}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="font-semibold text-neutral-800">
                      {formatRate(rate.rate)}
                    </div>
                    <div className="text-xs text-neutral-500">
                      1,000원 ={" "}
                      {(1000 / rate.rate).toFixed(
                        rate.currency === "JPY" ? 0 : 2,
                      )}{" "}
                      {rate.currency}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    {formatChange(rate.change)}
                  </td>
                  <td className="p-3 text-center">
                    <Badge
                      variant="secondary"
                      className="rounded-full px-2 py-0.5 text-xs"
                    >
                      {rate.continent}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRates.length === 0 && (
            <div className="p-8 text-center text-neutral-500">
              <Search size={48} className="mx-auto mb-2 text-neutral-300" />
              <p className="text-sm">검색 결과가 없습니다.</p>
              <p className="text-xs">다른 검색어나 필터를 시도해보세요.</p>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="mt-4 text-right text-xs text-neutral-400">
        최종 업데이트: {new Date().toLocaleString("ko-KR")} | 데이터 제공:
        관세청 API
      </div>
    </ContentCard>
  );
}

export default ExchangeRateTable;
