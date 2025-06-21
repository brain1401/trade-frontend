import type { ImportanceLevel } from "@/types";

/**
 * 피드 아이템의 타입을 정의하는 열거형
 *
 * 대시보드에서 표시되는 다양한 종류의 업데이트 정보를 분류합니다.
 * 각 타입별로 다른 UI 스타일과 액션이 적용됩니다.
 */
export type FeedItemType =
  | "hscode_regulation" // HS Code 규제 변경
  | "cargo_status" // 화물 상태 업데이트
  | "trade_news" // 무역 관련 뉴스
  | "exchange_rate"; // 환율 변동

/**
 * 대시보드 피드에 표시되는 개별 아이템의 데이터 구조
 *
 * 사용자가 관심있어하는 항목들의 변경사항이나 업데이트를
 * 시간순으로 표시하기 위한 정보를 담고 있습니다.
 */
export type FeedItem = {
  /** 피드 아이템의 고유 식별자 */
  id: string;
  /** 피드 아이템의 유형 */
  type: FeedItemType;
  /** 피드 아이템의 제목 */
  title: string;
  /** 피드 아이템의 요약 설명 */
  summary: string;
  /** 업데이트 발생 시간 (ISO 문자열) */
  timestamp: string;
  /** 정보 출처 */
  source: string;
  /** 중요도 레벨 */
  importance: ImportanceLevel;
  /** 연관된 북마크 ID */
  bookmarkId: string;
  /** 변경사항 목록 */
  changes: string[];
};

/**
 * 북마크 타입을 정의하는 열거형
 *
 * 사용자가 북마크할 수 있는 콘텐츠의 종류를 분류합니다.
 */
export type BookmarkType = "hscode" | "tracking" | "regulation";

/**
 * 사용자 북마크 정보의 데이터 구조
 *
 * 사용자가 지속적으로 모니터링하고 싶어하는 항목들을 관리하며,
 * 해당 항목들의 변경사항을 추적할 수 있습니다.
 */
export type Bookmark = {
  /** 북마크의 고유 식별자 */
  id: string;
  /** 북마크 타입 */
  type: BookmarkType;
  /** 북마크 제목 */
  title: string;
  /** 북마크 상세 설명 */
  description: string;
  /** 북마크 생성 시간 (ISO 문자열) */
  createdAt: string;
  /** 마지막 업데이트 시간 (ISO 문자열) */
  lastUpdated: string;
  /** 모니터링 활성화 여부 */
  monitoringEnabled: boolean;
  /** 카테고리 분류 */
  category: string;
  /** 태그 목록 */
  tags: string[];
  /** 연관된 페이지 URL */
  url: string;
};

/**
 * 업데이트 피드 Mock 데이터
 *
 * 사용자 대시보드에 표시될 최신 업데이트 정보들을 담고 있습니다.
 * HS Code 규제 변경, 화물 상태, 무역 뉴스, 환율 변동 등의 정보가 포함됩니다.
 *
 * @example
 * ```typescript
 * const highImportanceItems = mockUpdatesFeed.filter(
 *   item => item.importance === "high"
 * );
 * ```
 */
export const mockUpdatesFeed: FeedItem[] = [
  {
    id: "feed-1",
    type: "hscode_regulation",
    title: "HS Code 8517.12 관련 KC 인증 요건 변경",
    summary: "휴대폰 관련 KC 인증 절차가 간소화되었습니다.",
    timestamp: "2024-01-15T14:30:00Z",
    source: "방송통신위원회",
    importance: "high",
    bookmarkId: "bookmark-1",
    changes: ["인증 기간 단축: 30일 → 15일", "서류 간소화: 8종 → 5종"],
  },
  {
    id: "feed-2",
    type: "cargo_status",
    title: "화물 MSKU1234567 통관 단계 진행",
    summary: "부산항 도착 완료, 수입신고 준비 중",
    timestamp: "2024-01-15T10:15:00Z",
    source: "관세청",
    importance: "medium",
    bookmarkId: "cargo-1",
    changes: ["현재 단계: 부산항 도착", "예상 완료: 2024-01-20"],
  },
  {
    id: "feed-3",
    type: "trade_news",
    title: "중국 리튬배터리 수입규제 강화",
    summary: "2024년 3월부터 리튬배터리 관련 안전 기준이 강화됩니다.",
    timestamp: "2024-01-14T16:45:00Z",
    source: "무역협회",
    importance: "high",
    bookmarkId: "bookmark-3",
    changes: ["안전 테스트 항목 추가", "인증서 갱신 주기 단축"],
  },
  {
    id: "feed-4",
    type: "exchange_rate",
    title: "달러-원 환율 급등",
    summary: "달러-원 환율이 1,350원을 돌파했습니다.",
    timestamp: "2024-01-14T09:30:00Z",
    source: "한국은행",
    importance: "medium",
    bookmarkId: "rate-1",
    changes: ["전일대비 +15원", "연초대비 +5.2%"],
  },
];

/**
 * 사용자 북마크 Mock 데이터
 *
 * 사용자가 저장한 북마크 목록으로, HS Code, 화물 추적, 규제 정보 등
 * 다양한 타입의 북마크를 포함합니다.
 *
 * @example
 * ```typescript
 * const hsCodeBookmarks = mockBookmarks.filter(
 *   bookmark => bookmark.type === "hscode"
 * );
 * ```
 */
export const mockBookmarks: Bookmark[] = [
  {
    id: "bookmark-1",
    type: "hscode",
    title: "HS Code 8517.12 (스마트폰)",
    description: "5G 지원 스마트폰 분류 및 규제 현황",
    createdAt: "2024-01-10T10:00:00Z",
    lastUpdated: "2024-01-15T14:30:00Z",
    monitoringEnabled: true,
    category: "전자제품",
    tags: ["5G", "휴대폰", "KC인증"],
    url: "/hscode/result/result-8517.12",
  },
  {
    id: "bookmark-2",
    type: "hscode",
    title: "HS Code 3304.99 (기타 화장품)",
    description: "K-뷰티 화장품 수출 가이드",
    createdAt: "2024-01-08T15:20:00Z",
    lastUpdated: "2024-01-12T11:45:00Z",
    monitoringEnabled: true,
    category: "화장품",
    tags: ["K-뷰티", "수출", "FDA"],
    url: "/hscode/result/result-3304.99",
  },
  {
    id: "cargo-1",
    type: "tracking",
    title: "화물 MSKU1234567",
    description: "전자제품 수입 화물 추적",
    createdAt: "2024-01-10T08:00:00Z",
    lastUpdated: "2024-01-15T10:15:00Z",
    monitoringEnabled: true,
    category: "수입",
    tags: ["전자제품", "부산항", "통관중"],
    url: "/tracking/result/MSKU1234567",
  },
  {
    id: "bookmark-3",
    type: "regulation",
    title: "리튬배터리 수입규제",
    description: "중국 리튬배터리 관련 최신 규제",
    createdAt: "2024-01-05T13:30:00Z",
    lastUpdated: "2024-01-14T16:45:00Z",
    monitoringEnabled: false,
    category: "규제",
    tags: ["리튬배터리", "중국", "안전기준"],
    url: "/search/results?q=리튬배터리+규제",
  },
  {
    id: "rate-1",
    type: "regulation",
    title: "달러-원 환율 모니터링",
    description: "USD/KRW 환율 변동 추적",
    createdAt: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-14T09:30:00Z",
    monitoringEnabled: true,
    category: "환율",
    tags: ["달러", "환율", "1350원"],
    url: "/search/results?q=달러+원+환율",
  },
];

/**
 * 카테고리별 통계 데이터
 *
 * 각 카테고리별 북마크 수, 활성 모니터링 수, 최근 업데이트 수 등의
 * 통계 정보를 제공합니다.
 */
export const mockCategoryStats = [
  {
    category: "전자제품",
    totalBookmarks: 3,
    activeMonitoring: 3,
    recentUpdates: 5,
    trend: "증가" as const,
  },
  {
    category: "화장품",
    totalBookmarks: 1,
    activeMonitoring: 1,
    recentUpdates: 2,
    trend: "증가" as const,
  },
  {
    category: "반도체",
    totalBookmarks: 1,
    activeMonitoring: 1,
    recentUpdates: 1,
    trend: "안정" as const,
  },
  {
    category: "규제",
    totalBookmarks: 6,
    activeMonitoring: 5,
    recentUpdates: 8,
    trend: "증가" as const,
  },
  {
    category: "환율",
    totalBookmarks: 3,
    activeMonitoring: 3,
    recentUpdates: 3,
    trend: "변동" as const,
  },
];

/**
 * 중요도별 통계 데이터
 *
 * 높음/보통/낮음 중요도별 아이템 수와 비율을 제공합니다.
 */
export const mockImportanceStats = {
  high: { count: 9, percentage: 45, color: "red" },
  medium: { count: 8, percentage: 40, color: "yellow" },
  low: { count: 3, percentage: 15, color: "green" },
};

/**
 * 필터링 옵션 데이터
 *
 * 대시보드에서 사용할 수 있는 다양한 필터 옵션들을 정의합니다.
 */
export const mockFilterOptions = {
  categories: [
    "전체",
    "전자제품",
    "화장품",
    "반도체",
    "자동차",
    "의약품",
    "규제",
    "환율",
  ],
  types: [
    { value: "all", label: "전체" },
    { value: "hscode", label: "HS Code" },
    { value: "tracking", label: "화물 추적" },
    { value: "regulation", label: "규제/뉴스" },
  ],
  sortOptions: [
    { value: "lastUpdated", label: "최근 업데이트순" },
    { value: "createdAt", label: "생성일순" },
    { value: "title", label: "제목순" },
    { value: "category", label: "카테고리순" },
  ],
};

/**
 * 최근 피드 아이템 조회 함수
 *
 * 타임스탬프를 기준으로 최신순으로 정렬된 피드 아이템들을 반환합니다.
 *
 * @param limit - 반환할 아이템 개수 (기본값: 10)
 * @returns 최신순으로 정렬된 피드 아이템 배열
 *
 * @example
 * ```typescript
 * const recentItems = getRecentFeedItems(5);
 * console.log(`최근 ${recentItems.length}개 업데이트`);
 * ```
 */
export const getRecentFeedItems = (limit: number = 10): FeedItem[] => {
  return mockUpdatesFeed
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, limit);
};

/**
 * 카테고리별 북마크 조회 함수
 *
 * 지정된 카테고리에 해당하는 북마크들을 필터링하여 반환합니다.
 *
 * @param category - 조회할 카테고리명 ("전체"인 경우 모든 북마크 반환)
 * @returns 해당 카테고리의 북마크 배열
 *
 * @example
 * ```typescript
 * const electronicBookmarks = getBookmarksByCategory("전자제품");
 * electronicBookmarks.forEach(bookmark => {
 *   console.log(bookmark.title);
 * });
 * ```
 */
export const getBookmarksByCategory = (category: string): Bookmark[] => {
  if (category === "전체") return mockBookmarks;
  return mockBookmarks.filter((bookmark) => bookmark.category === category);
};

/**
 * 활성 모니터링 북마크 조회 함수
 *
 * 모니터링이 활성화된 북마크들만 필터링하여 반환합니다.
 * 실시간 업데이트 알림이 필요한 북마크들을 관리할 때 사용됩니다.
 *
 * @returns 모니터링이 활성화된 북마크 배열
 *
 * @example
 * ```typescript
 * const activeBookmarks = getActiveBookmarks();
 * console.log(`활성 모니터링: ${activeBookmarks.length}개`);
 * ```
 */
export const getActiveBookmarks = (): Bookmark[] => {
  return mockBookmarks.filter((bookmark) => bookmark.monitoringEnabled);
};
