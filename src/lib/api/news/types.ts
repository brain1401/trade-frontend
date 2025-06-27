/**
 * 뉴스 아이템 타입
 */
export type NewsItem = {
  /** 뉴스 ID */
  id: string;
  /** 제목 */
  title: string;
  /** 요약 */
  summary: string;
  /** 출처명 */
  sourceName: string;
  /** 출처 URL */
  sourceUrl: string;
  /** 발행 시간 */
  publishedAt: string;
  /** 카테고리 */
  category: string;
  /** 우선순위 */
  priority: number;
  /** 활성 상태 */
  isActive: boolean;
  /** 관련 HS Code 목록 */
  relatedHsCodes: string[];
  /** 생성 시간 */
  createdAt: string;
};

/**
 * 뉴스 상세 정보 타입
 */
export type NewsDetail = NewsItem & {
  /** 본문 내용 */
  content: string;
  /** 관련 HS Code 상세 정보 */
  relatedHsCodes: Array<{
    hsCode: string;
    productName: string;
    oldTariffRate?: string;
    newTariffRate?: string;
  }>;
  /** 태그 목록 */
  tags: string[];
  /** 조회수 */
  viewCount: number;
};

/**
 * 뉴스 목록 응답 타입
 */
export type NewsListResponse = {
  /** 뉴스 목록 */
  news: NewsItem[];
  /** 페이지네이션 정보 */
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  /** 카테고리 목록 */
  categories: Array<{
    name: string;
    count: number;
  }>;
};
