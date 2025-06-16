import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 필터 설정 객체 타입
 *
 * 각 필터 옵션의 키와 라벨을 정의하는 설정 객체입니다.
 * 이 설정을 통해 UI에서 동적으로 필터 버튼을 렌더링할 수 있습니다.
 *
 * @template T - 필터 키의 타입 (string 리터럴 유니온)
 */
export type FilterConfig<T extends string> = {
  /**
   * 필터의 고유 식별자
   *
   * - 필터링 함수에서 사용되는 키값
   * - UI에서 활성 상태 확인 시 사용
   * - string 리터럴 타입으로 타입 안전성 보장
   */
  key: T;

  /**
   * 사용자에게 표시되는 필터 이름
   *
   * - 필터 버튼의 텍스트로 사용
   * - 접근성을 위한 aria-label로도 활용 가능
   * - 한국어 또는 다국어 지원
   */
  label: string;
};

/**
 * 필터링 함수 타입 정의
 *
 * 배열 데이터와 필터 키를 받아서 필터링된 결과를 반환하는 함수의 타입입니다.
 * 사용자 정의 비즈니스 로직을 구현할 수 있도록 외부에서 주입받는 구조입니다.
 *
 * @template TItem - 배열 항목의 타입
 * @template TFilterKey - 필터 키의 타입 (string 리터럴 유니온)
 *
 * @param items - 필터링할 원본 배열 데이터
 * @param filterKey - 적용할 필터의 키
 * @returns 필터링된 배열 데이터
 */
type FilterFunction<TItem, TFilterKey extends string> = (
  items: TItem[],
  filterKey: TFilterKey,
) => TItem[];

/**
 * 버튼 스타일 커스터마이징 옵션
 */
type ButtonStyleOptions = {
  /** 필터 버튼들의 기본 클래스명 */
  filterButtonClassName?: string;

  /** 활성 필터 버튼의 클래스명 */
  activeFilterButtonClassName?: string;

  /** 더보기 버튼의 클래스명 */
  loadMoreButtonClassName?: string;

  /** 리셋 버튼의 클래스명 */
  resetButtonClassName?: string;

  /** 버튼 컨테이너의 클래스명 */
  containerClassName?: string;
};

/**
 * useFilteredPagination 훅의 매개변수 타입 (UI 포함)
 *
 * @template TItem - 배열 항목의 타입
 * @template TFilterKey - 필터 키의 타입 (string 리터럴 유니온)
 */
type UseFilteredPaginationParams<TItem, TFilterKey extends string> = {
  /** 필터링할 원본 데이터 배열 */
  data: TItem[];

  /** 필터링 로직을 구현한 함수 */
  filterFunction: FilterFunction<TItem, TFilterKey>;

  /** 필터 설정 배열 (버튼 생성용) */
  filterConfigs: FilterConfig<TFilterKey>[];

  /** 기본으로 적용될 필터 키 */
  defaultFilter: TFilterKey;

  /** 초기 표시할 항목 개수 (기본값: 3) */
  initialItemsPerPage?: number;

  /** "더보기" 클릭 시 추가로 로드할 항목 개수 (기본값: 3) */
  incrementSize?: number;

  /** 버튼 스타일 커스터마이징 옵션 */
  buttonStyles?: ButtonStyleOptions;
};

/**
 * useFilteredPagination 훅의 반환 타입 (UI 포함)
 *
 * @template TItem - 배열 항목의 타입
 * @template TFilterKey - 필터 키의 타입 (string 리터럴 유니온)
 */
type UseFilteredPaginationReturn<TItem, TFilterKey extends string> = {
  // 상태
  /** 현재 활성화된 필터 키 */
  currentFilter: TFilterKey;

  /** 현재 표시되고 있는 항목 개수 */
  displayCount: number;

  // 계산된 값
  /** 현재 필터가 적용된 전체 데이터 (페이지네이션 적용 전) */
  filteredItems: TItem[];

  /** 실제로 화면에 표시되는 데이터 (페이지네이션 적용 후) */
  displayedItems: TItem[];

  /** 모든 항목이 로드되었는지 여부 (더보기 버튼 표시 제어용) */
  allItemsLoaded: boolean;

  // 액션
  /**
   * 필터를 변경하는 함수
   *
   * @param filter - 적용할 필터 키
   */
  setFilter: (filter: TFilterKey) => void;

  /**
   * 더 많은 항목을 로드하는 함수
   */
  loadMore: () => void;

  /**
   * 상태를 초기값으로 리셋하는 함수
   */
  reset: () => void;

  // UI 컴포넌트들
  /**
   * 필터 버튼들 JSX 컴포넌트
   *
   * THEME_GUIDE.md 기반 스타일 적용:
   * - 기본: rounded-full px-3 py-2 text-xs (비활성)
   * - 활성: variant="default" bg-primary-600 text-white
   */
  FilterButtons: React.ReactElement;

  /**
   * 더보기 버튼 JSX 컴포넌트
   *
   * THEME_GUIDE.md 기반 스타일 적용:
   * - variant="link" + ChevronRight 아이콘
   * - className="h-auto p-0 text-sm hover:underline text-primary-600"
   */
  LoadMoreButton: React.ReactElement | null;

  /**
   * 리셋 버튼 JSX 컴포넌트
   *
   * THEME_GUIDE.md 기반 스타일 적용:
   * - variant="outline"
   * - className="border-neutral-300 bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
   */
  ResetButton: React.ReactElement;
};

/**
 * 배열 데이터에 대한 필터링 및 페이지네이션 기능을 제공하는 제네릭 훅 (UI 포함)
 *
 * ## 주요 기능
 *
 * - 타입 안전한 필터링: TypeScript 제네릭으로 완전한 타입 지원
 * - 유연한 필터링 로직: 사용자 정의 필터링 함수 지원
 * - 점진적 로딩: 성능 최적화를 위한 페이지네이션
 * - 상태 관리: 필터 상태와 표시 개수 자동 관리
 * - 자동 UI 생성: THEME_GUIDE.md 기반 일관된 버튼 스타일 적용
 *
 * ## 핵심 설계 원칙
 *
 * 이 훅은 다음과 같은 원칙으로 설계되었습니다:
 *
 * 1. 관심사의 분리: 로직과 UI를 함께 제공하되 커스터마이징 가능
 * 2. 단일 책임: 필터링과 페이지네이션에만 집중
 * 3. 타입 안전성: 컴파일 타임 타입 체크로 오류 방지
 * 4. 재사용성: 모든 배열 타입에 대해 사용 가능
 * 5. 확장성: 필요에 따라 쉽게 기능 추가 가능
 * 6. 디자인 일관성: THEME_GUIDE.md 기반 일관된 스타일 적용
 *
 * ## 버튼 스타일 가이드 (THEME_GUIDE.md 기반)
 *
 * - **필터 버튼**: rounded-full px-3 py-2 text-xs (기본), variant="default" (활성)
 * - **더보기 버튼**: variant="link" + ChevronRight 아이콘
 * - **리셋 버튼**: variant="outline" 스타일
 * - **커스터마이징**: buttonStyles prop으로 className 오버라이드 가능
 *
 * @template TItem - 배열 항목의 타입
 * @template TFilterKey - 필터 키의 타입 (string 리터럴 유니온)
 *
 * @param params - 훅 설정 매개변수 (필터 설정 포함)
 * @returns 필터링 및 페이지네이션 상태와 액션들, UI 컴포넌트들
 *
 * @since 1.0.0
 * @author AI HS Code 레이더 시스템 Frontend Team
 */
export const useFilteredPagination = <TItem, TFilterKey extends string>({
  data,
  filterFunction,
  filterConfigs,
  defaultFilter,
  initialItemsPerPage = 3,
  incrementSize = 3,
  buttonStyles = {},
}: UseFilteredPaginationParams<TItem, TFilterKey>): UseFilteredPaginationReturn<
  TItem,
  TFilterKey
> => {
  const [currentFilter, setCurrentFilter] = useState<TFilterKey>(defaultFilter);
  const [displayCount, setDisplayCount] = useState(initialItemsPerPage);

  // 필터링된 데이터 계산 - 사용자 정의 필터링 함수 적용
  const filteredItems = useMemo(
    () => filterFunction(data, currentFilter),
    [data, currentFilter, filterFunction],
  );

  // 표시할 데이터 계산 - 페이지네이션 적용
  const displayedItems = useMemo(
    () => filteredItems.slice(0, displayCount),
    [filteredItems, displayCount],
  );

  // 모든 항목이 로드되었는지 확인 - 더보기 버튼 표시 제어용
  const allItemsLoaded = displayCount >= filteredItems.length;

  // 필터 변경 함수 - 필터 변경 시 표시 개수 초기화
  const setFilter = useCallback(
    (filter: TFilterKey) => {
      setCurrentFilter(filter);
      setDisplayCount(initialItemsPerPage);
    },
    [initialItemsPerPage],
  );

  // 더 많은 항목 로드 함수 - 점진적 로딩
  const loadMore = useCallback(() => {
    setDisplayCount((prev) => prev + incrementSize);
  }, [incrementSize]);

  // 상태 초기화 함수 - 필터와 표시 개수를 기본값으로 리셋
  const reset = useCallback(() => {
    setCurrentFilter(defaultFilter);
    setDisplayCount(initialItemsPerPage);
  }, [defaultFilter, initialItemsPerPage]);

  // 필터 버튼들 JSX 컴포넌트 생성 - THEME_GUIDE.md 기반 스타일 적용
  const FilterButtons = useMemo(
    () => (
      <div
        className={cn("flex flex-wrap gap-2", buttonStyles.containerClassName)}
      >
        {filterConfigs.map((config) => {
          const isActive = currentFilter === config.key;
          return (
            <Button
              key={config.key}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(config.key)}
              className={cn(
                // THEME_GUIDE.md 기반 필터 버튼 스타일
                "rounded-full px-3 py-2 text-xs font-medium",
                isActive
                  ? cn(
                      "bg-primary-600 text-white hover:bg-primary-700",
                      buttonStyles.activeFilterButtonClassName,
                    )
                  : cn(
                      "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-primary-600",
                      buttonStyles.filterButtonClassName,
                    ),
              )}
              aria-label={`${config.label} 필터 적용`}
            >
              {config.label}
            </Button>
          );
        })}
      </div>
    ),
    [filterConfigs, currentFilter, setFilter, buttonStyles],
  );

  // 더보기 버튼 JSX 컴포넌트 생성 - THEME_GUIDE.md 기반 스타일 적용
  const LoadMoreButton = useMemo(
    () =>
      !allItemsLoaded ? (
        <Button
          variant="link"
          onClick={loadMore}
          className={cn(
            // THEME_GUIDE.md 기반 더보기 링크 스타일
            "flex h-auto items-center p-0 text-sm text-primary-600 hover:underline",
            buttonStyles.loadMoreButtonClassName,
          )}
          aria-label="더 많은 항목 로드"
        >
          더보기
          <ChevronRight size={16} className="ml-1" />
        </Button>
      ) : null,
    [allItemsLoaded, loadMore, buttonStyles],
  );

  // 리셋 버튼 JSX 컴포넌트 생성 - THEME_GUIDE.md 기반 스타일 적용
  const ResetButton = useMemo(
    () => (
      <Button
        variant="outline"
        size="sm"
        onClick={reset}
        className={cn(
          // THEME_GUIDE.md 기반 outline 버튼 스타일
          "border-neutral-300 bg-neutral-200 text-neutral-700 hover:bg-neutral-300",
          buttonStyles.resetButtonClassName,
        )}
        aria-label="필터 및 페이지네이션 초기화"
      >
        초기화
      </Button>
    ),
    [reset, buttonStyles],
  );

  return {
    // 상태
    currentFilter,
    displayCount,

    // 계산된 값
    filteredItems,
    displayedItems,
    allItemsLoaded,

    // 액션
    setFilter,
    loadMore,
    reset,

    // UI 컴포넌트들
    FilterButtons,
    LoadMoreButton,
    ResetButton,
  };
};
