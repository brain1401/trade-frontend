import React from "react";
import ContentCard from "@/components/common/ContentCard";
import HSCodeInfoItem from "./HSCodeInfoItem";
import {
  useFilteredPagination,
  type FilterConfig,
} from "@/hooks/common/useFilteredPagination";
import type { HSCodeInfo } from "@/types";
import { mockHSCodeInfoData } from "@/data/mock/hscodeInfo";

type FilterOptionType =
  | "latest"
  | "regulation"
  | "tariff"
  | "certification"
  | "bookmarked";

type HSCodeInfoSectionProps = {
  hsCode?: string; // 특정 HS Code 필터링용
  title?: string; // 커스텀 제목
  showHSCodeFilter?: boolean; // HS Code 필터 표시 여부
};

function HSCodeInfoSection({
  hsCode,
  title = "HS Code별 최신 정보",
  showHSCodeFilter = false,
}: HSCodeInfoSectionProps) {
  // 필터 설정 배열
  const filterConfigs: FilterConfig<FilterOptionType>[] = [
    { key: "latest", label: "최신순" },
    { key: "regulation", label: "규제" },
    { key: "tariff", label: "관세" },
    { key: "certification", label: "인증" },
    { key: "bookmarked", label: "북마크" },
  ];

  // 필터링 함수 정의 - HSCodeInfo 배열에 대한 비즈니스 로직
  const filterHSCodeInfo = (
    infos: HSCodeInfo[],
    filterKey: FilterOptionType,
  ) => {
    let filteredInfos = infos;

    // 특정 HS Code 필터링
    if (hsCode) {
      filteredInfos = filteredInfos.filter((info) => info.hsCode === hsCode);
    }

    // 카테고리별 필터링
    switch (filterKey) {
      case "latest":
        return [...filteredInfos].sort(
          (a, b) =>
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime(),
        );
      case "regulation":
        return filteredInfos.filter((info) => info.type === "regulation");
      case "tariff":
        return filteredInfos.filter((info) => info.type === "tariff");
      case "certification":
        return filteredInfos.filter((info) => info.type === "certification");
      case "bookmarked":
        // 현재는 모든 정보 표시 (북마크 기능은 추후 구현)
        return filteredInfos;
      default:
        return filteredInfos;
    }
  };

  // 제네릭 훅 사용
  const {
    displayedItems: hsCodeInfoToShow,
    FilterButtons,
    LoadMoreButton,
    currentFilter,
  } = useFilteredPagination({
    data: mockHSCodeInfoData,
    filterFunction: filterHSCodeInfo,
    filterConfigs,
    defaultFilter: "latest" as FilterOptionType,
    initialItemsPerPage: 5,
    incrementSize: 5,
  });

  return (
    <ContentCard
      title={hsCode ? `${hsCode} 관련 최신 정보` : title}
      titleRightElement={FilterButtons}
    >
      {hsCodeInfoToShow.length > 0 ? (
        <div className="space-y-2">
          {hsCodeInfoToShow.map((info) => (
            <HSCodeInfoItem key={info.uuid} {...info} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm text-neutral-500">
            {currentFilter === "bookmarked"
              ? "북마크된 정보가 없습니다."
              : hsCode
                ? `${hsCode}에 대한 정보가 없습니다.`
                : "표시할 정보가 없습니다."}
          </p>
          {hsCode && (
            <p className="mt-2 text-xs text-neutral-400">
              다른 HS Code로 검색하거나 모니터링을 설정해 보세요.
            </p>
          )}
        </div>
      )}
      {LoadMoreButton && (
        <div className="mt-3 text-right">{LoadMoreButton}</div>
      )}
    </ContentCard>
  );
}

export default HSCodeInfoSection;
