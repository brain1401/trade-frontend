import type { ImportanceLevel } from "@/types/base";
import type { UpdateFeed, DashboardSummary } from "@/types/dashboard";
import type { BookmarkType as BookmarkTypeEnum } from "@/types/bookmark";

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
  type: BookmarkTypeEnum;
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
 *   item => item.importance === "HIGH"
 * );
 * ```
 */
export const mockUpdatesFeed: UpdateFeed[] = [
  {
    id: 1,
    feedType: "HS_CODE_REGULATION_UPDATE",
    targetType: "HS_CODE",
    targetValue: "8517.12",
    title: "HS Code 8517.12 관련 KC 인증 요건 변경",
    content: "휴대폰 관련 KC 인증 절차가 간소화되었습니다.",
    changeDetails: {
      previous: "인증 기간: 30일, 서류: 8종",
      current: "인증 기간: 15일, 서류: 5종",
      effectiveDate: "2024-02-01T00:00:00Z",
    },
    sourceUrl: "https://rra.go.kr/notice/8517-12-kc-change",
    importance: "HIGH",
    isRead: false,
    createdAt: "2024-01-15T14:30:00Z",
  },
  {
    id: 2,
    feedType: "CARGO_STATUS_UPDATE",
    targetType: "CARGO",
    targetValue: "MSKU1234567",
    title: "화물 MSKU1234567 통관 단계 진행",
    content: "부산항 도착 완료, 수입신고 준비 중입니다.",
    changeDetails: {
      current: "부산항 도착",
      completedAt: "2024-01-15T10:15:00Z",
    },
    sourceUrl: "https://customs.go.kr/tracking/MSKU1234567",
    importance: "MEDIUM",
    isRead: false,
    createdAt: "2024-01-15T10:15:00Z",
  },
  {
    id: 3,
    feedType: "TRADE_NEWS",
    targetType: "HS_CODE",
    targetValue: "8507.60",
    title: "중국 리튬배터리 수입규제 강화",
    content: "2024년 3월부터 리튬배터리 관련 안전 기준이 강화됩니다.",
    changeDetails: {
      current: "안전 테스트 항목 추가, 인증서 갱신 주기 단축",
      effectiveDate: "2024-03-01T00:00:00Z",
    },
    sourceUrl: "https://trade.go.kr/news/lithium-battery-regulation",
    importance: "HIGH",
    isRead: true,
    createdAt: "2024-01-14T16:45:00Z",
  },
  {
    id: 4,
    feedType: "POLICY_UPDATE",
    targetType: "HS_CODE",
    targetValue: "ALL",
    title: "관세율 일괄 조정 발표",
    content: "주요 수입품목의 관세율이 전면 재조정됩니다.",
    changeDetails: {
      current: "평균 관세율 2%p 인하",
      effectiveDate: "2024-04-01T00:00:00Z",
    },
    sourceUrl: "https://customs.go.kr/policy/tariff-adjustment-2024",
    importance: "MEDIUM",
    isRead: true,
    createdAt: "2024-01-14T09:30:00Z",
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
 *   bookmark => bookmark.type === "HS_CODE"
 * );
 * ```
 */
export const mockBookmarks: Bookmark[] = [
  {
    id: "bookmark-1",
    type: "HS_CODE",
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
    type: "HS_CODE",
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
    type: "CARGO",
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
    type: "HS_CODE",
    title: "HS Code 8507.60 (리튬배터리)",
    description: "중국 리튬배터리 관련 최신 규제",
    createdAt: "2024-01-05T13:30:00Z",
    lastUpdated: "2024-01-14T16:45:00Z",
    monitoringEnabled: false,
    category: "규제",
    tags: ["리튬배터리", "중국", "안전기준"],
    url: "/search/results?q=리튬배터리+규제",
  },
];

/**
 * 대시보드 요약 정보 Mock 데이터
 *
 * 북마크, 피드, 활동 등의 요약 통계를 제공합니다.
 */
export const mockDashboardSummary: DashboardSummary = {
  bookmarks: {
    total: 4,
    activeMonitoring: 3,
    byType: {
      HS_CODE: 3,
      CARGO: 1,
    },
  },
  feeds: {
    unreadCount: 2,
    todayCount: 2,
    weekCount: 4,
    byImportance: {
      HIGH: 2,
      MEDIUM: 2,
      LOW: 0,
    },
  },
  recentActivity: [
    {
      type: "BOOKMARK_ADDED",
      message: "HS Code 8517.12를 북마크에 추가했습니다",
      timestamp: "2024-01-15T14:30:00Z",
      relatedData: {
        id: "bookmark-1",
        type: "HS_CODE",
      },
    },
    {
      type: "FEED_RECEIVED",
      message: "화물 MSKU1234567 상태가 업데이트되었습니다",
      timestamp: "2024-01-15T10:15:00Z",
      relatedData: {
        id: "2",
        type: "CARGO_STATUS_UPDATE",
      },
    },
    {
      type: "ALERT_TRIGGERED",
      message: "리튬배터리 수입규제 강화 알림",
      timestamp: "2024-01-14T16:45:00Z",
      relatedData: {
        id: "3",
        type: "TRADE_NEWS",
      },
    },
  ],
  quickStats: {
    searchCount: 47,
    totalSavedTime: "3시간 25분",
    accuracyRate: "94.5%",
  },
};

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
];

/**
 * 중요도별 통계 데이터
 *
 * 높음/보통/낮음 중요도별 아이템 수와 비율을 제공합니다.
 */
export const mockImportanceStats = {
  HIGH: { count: 2, percentage: 45, color: "red" },
  MEDIUM: { count: 2, percentage: 40, color: "yellow" },
  LOW: { count: 0, percentage: 15, color: "green" },
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
    { value: "HS_CODE", label: "HS Code" },
    { value: "CARGO", label: "화물 추적" },
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
export const getRecentFeedItems = (limit: number = 10): UpdateFeed[] => {
  return mockUpdatesFeed
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
