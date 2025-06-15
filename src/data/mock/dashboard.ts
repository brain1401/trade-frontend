// 대시보드 관련 목업 데이터

export const mockUpdatesFeed = [
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

export const mockBookmarks = [
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
];

export type FeedItemType =
  | "hscode_regulation"
  | "cargo_status"
  | "trade_news"
  | "exchange_rate";
export type BookmarkType = "hscode" | "tracking" | "regulation";
export type ImportanceLevel = "high" | "medium" | "low";

export type FeedItem = {
  id: string;
  type: FeedItemType;
  title: string;
  summary: string;
  timestamp: string;
  source: string;
  importance: ImportanceLevel;
  bookmarkId: string;
  changes: string[];
};

export type Bookmark = {
  id: string;
  type: BookmarkType;
  title: string;
  description: string;
  createdAt: string;
  lastUpdated: string;
  monitoringEnabled: boolean;
  category: string;
  tags: string[];
  url: string;
};
