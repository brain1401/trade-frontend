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
  {
    id: "feed-5",
    type: "hscode_regulation",
    title: "HS Code 8542.31 (메모리 반도체) FTA 관세율 개정",
    summary: "한-미 FTA 협정에 따라 메모리 반도체 관세율이 인하됩니다.",
    timestamp: "2024-01-15T11:20:00Z",
    source: "관세청",
    importance: "high",
    bookmarkId: "bookmark-4",
    changes: ["관세율 인하: 8% → 6%", "적용 시점: 2024-02-01"],
  },
  {
    id: "feed-6",
    type: "cargo_status",
    title: "화물 TCLU9876543 통관 완료",
    summary: "인천항 수입 화물 통관 완료, 내륙 운송 시작",
    timestamp: "2024-01-15T08:45:00Z",
    source: "관세청",
    importance: "medium",
    bookmarkId: "cargo-2",
    changes: ["통관 완료", "내륙 운송 시작", "예상 도착: 2024-01-16"],
  },
  {
    id: "feed-7",
    type: "trade_news",
    title: "EU 화장품 CPNP 등록 의무화 시행",
    summary: "EU 수출 화장품의 CPNP 등록이 의무화됩니다.",
    timestamp: "2024-01-14T13:30:00Z",
    source: "KOTRA",
    importance: "high",
    bookmarkId: "bookmark-5",
    changes: ["CPNP 등록 의무화", "미등록 시 통관 불가", "시행일: 2024-03-01"],
  },
  {
    id: "feed-8",
    type: "hscode_regulation",
    title: "HS Code 8703.23 (하이브리드 자동차) 환경부담금 인하",
    summary: "친환경 자동차 환경부담금이 추가 인하됩니다.",
    timestamp: "2024-01-14T15:10:00Z",
    source: "환경부",
    importance: "medium",
    bookmarkId: "bookmark-6",
    changes: ["환경부담금 50% 인하", "적용 기간: 2024-2025년"],
  },
  {
    id: "feed-9",
    type: "cargo_status",
    title: "화물 HJMU5555444 검사 지연",
    summary: "화학제품 검사로 인한 통관 지연 발생",
    timestamp: "2024-01-14T12:20:00Z",
    source: "관세청",
    importance: "high",
    bookmarkId: "cargo-3",
    changes: ["검사 지연", "예상 완료: 2024-01-17", "추가 서류 요청"],
  },
  {
    id: "feed-10",
    type: "trade_news",
    title: "일본 식품 수입 방사능 검사 강화",
    summary: "후쿠시마 오염수 방류로 일본 식품 검사가 강화됩니다.",
    timestamp: "2024-01-14T10:00:00Z",
    source: "식약처",
    importance: "high",
    bookmarkId: "bookmark-7",
    changes: ["검사 항목 확대", "검사 시간 연장", "증명서 추가 요구"],
  },
  {
    id: "feed-11",
    type: "exchange_rate",
    title: "엔화 약세 지속",
    summary: "엔화 약세로 일본 수입품 가격 경쟁력 상승",
    timestamp: "2024-01-13T16:30:00Z",
    source: "한국은행",
    importance: "medium",
    bookmarkId: "rate-2",
    changes: ["달러-엔 150엔 돌파", "원-엔 900원대 진입"],
  },
  {
    id: "feed-12",
    type: "hscode_regulation",
    title: "HS Code 2710.19 (석유제품) 원산지 증명 강화",
    summary: "러시아 제재로 석유제품 원산지 증명이 강화됩니다.",
    timestamp: "2024-01-13T14:15:00Z",
    source: "산업통상자원부",
    importance: "high",
    bookmarkId: "bookmark-8",
    changes: ["원산지 증명서 필수", "제재 대상국 확인 강화", "시행일: 즉시"],
  },
  {
    id: "feed-13",
    type: "cargo_status",
    title: "화물 OOLU7777888 부산항 대기",
    summary: "컨테이너 적체로 부산항 대기 중",
    timestamp: "2024-01-13T11:45:00Z",
    source: "관세청",
    importance: "medium",
    bookmarkId: "cargo-4",
    changes: ["부산항 도착", "적체로 대기 중", "예상 지연: 2-3일"],
  },
  {
    id: "feed-14",
    type: "trade_news",
    title: "인도 섬유 수입 GST 세율 인상",
    summary: "인도 정부가 섬유 제품 GST 세율을 인상했습니다.",
    timestamp: "2024-01-13T09:20:00Z",
    source: "KOTRA",
    importance: "medium",
    bookmarkId: "bookmark-9",
    changes: [
      "GST 세율: 12% → 18%",
      "적용일: 2024-02-01",
      "한국 섬유 수출 영향",
    ],
  },
  {
    id: "feed-15",
    type: "hscode_regulation",
    title: "HS Code 3004.90 (의약품) 수입 허가 간소화",
    summary: "의약품 수입 허가 절차가 간소화됩니다.",
    timestamp: "2024-01-12T17:30:00Z",
    source: "식약처",
    importance: "medium",
    bookmarkId: "bookmark-10",
    changes: ["허가 기간 단축: 90일 → 60일", "온라인 신청 확대"],
  },
  {
    id: "feed-16",
    type: "cargo_status",
    title: "화물 CMAU3333222 광양항 통관 진행",
    summary: "철강 제품 통관 진행 중, 정상 처리 예상",
    timestamp: "2024-01-12T14:10:00Z",
    source: "관세청",
    importance: "low",
    bookmarkId: "cargo-5",
    changes: ["통관 진행 중", "정상 처리", "예상 완료: 2024-01-15"],
  },
  {
    id: "feed-17",
    type: "trade_news",
    title: "베트남 전자제품 수입 관세 인하",
    summary: "EVFTA 협정에 따라 베트남 전자제품 관세가 인하됩니다.",
    timestamp: "2024-01-12T10:40:00Z",
    source: "KOTRA",
    importance: "high",
    bookmarkId: "bookmark-11",
    changes: ["관세율 단계적 인하", "스마트폰 관세 0%", "적용일: 2024-01-15"],
  },
  {
    id: "feed-18",
    type: "exchange_rate",
    title: "유로화 강세 지속",
    summary: "유로화 강세로 유럽 수출 수익성 개선",
    timestamp: "2024-01-12T08:30:00Z",
    source: "한국은행",
    importance: "medium",
    bookmarkId: "rate-3",
    changes: ["유로-달러 1.10 상승", "원-유로 1,480원 돌파"],
  },
  {
    id: "feed-19",
    type: "hscode_regulation",
    title: "HS Code 9018.31 (의료기기) CE 인증 강화",
    summary: "EU 의료기기 CE 인증 기준이 강화됩니다.",
    timestamp: "2024-01-11T16:20:00Z",
    source: "식약처",
    importance: "high",
    bookmarkId: "bookmark-12",
    changes: [
      "CE 인증 기준 강화",
      "임상 데이터 요구 확대",
      "시행일: 2024-05-01",
    ],
  },
  {
    id: "feed-20",
    type: "cargo_status",
    title: "화물 TEMU9999111 평택항 도착",
    summary: "자동차 부품 화물 평택항 도착 완료",
    timestamp: "2024-01-11T13:55:00Z",
    source: "관세청",
    importance: "low",
    bookmarkId: "cargo-6",
    changes: ["평택항 도착", "통관 대기", "예상 완료: 2024-01-13"],
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
  {
    id: "bookmark-4",
    type: "hscode",
    title: "HS Code 8542.31 (메모리 반도체)",
    description: "D-RAM 메모리 칩 분류 및 FTA 관세율",
    createdAt: "2024-01-05T09:30:00Z",
    lastUpdated: "2024-01-15T11:20:00Z",
    monitoringEnabled: true,
    category: "반도체",
    tags: ["메모리", "D-RAM", "FTA"],
    url: "/hscode/result/result-8542.31",
  },
  {
    id: "cargo-2",
    type: "tracking",
    title: "화물 TCLU9876543",
    description: "의류 수입 화물 추적",
    createdAt: "2024-01-12T14:00:00Z",
    lastUpdated: "2024-01-15T08:45:00Z",
    monitoringEnabled: true,
    category: "수입",
    tags: ["의류", "인천항", "통관완료"],
    url: "/tracking/result/TCLU9876543",
  },
  {
    id: "bookmark-5",
    type: "regulation",
    title: "EU 화장품 CPNP 등록",
    description: "유럽 화장품 수출 필수 규제 사항",
    createdAt: "2024-01-03T11:15:00Z",
    lastUpdated: "2024-01-14T13:30:00Z",
    monitoringEnabled: true,
    category: "규제",
    tags: ["EU", "화장품", "CPNP"],
    url: "/search/results?q=EU+CPNP+등록",
  },
  {
    id: "bookmark-6",
    type: "hscode",
    title: "HS Code 8703.23 (하이브리드 자동차)",
    description: "친환경 자동차 분류 및 인센티브",
    createdAt: "2024-01-02T16:45:00Z",
    lastUpdated: "2024-01-14T15:10:00Z",
    monitoringEnabled: true,
    category: "자동차",
    tags: ["하이브리드", "친환경", "환경부담금"],
    url: "/hscode/result/result-8703.23",
  },
  {
    id: "cargo-3",
    type: "tracking",
    title: "화물 HJMU5555444",
    description: "화학제품 수입 화물 추적",
    createdAt: "2024-01-11T10:30:00Z",
    lastUpdated: "2024-01-14T12:20:00Z",
    monitoringEnabled: true,
    category: "수입",
    tags: ["화학제품", "검사지연", "부산항"],
    url: "/tracking/result/HJMU5555444",
  },
  {
    id: "bookmark-7",
    type: "regulation",
    title: "일본 식품 방사능 검사",
    description: "일본 수입 식품 방사능 검사 강화 조치",
    createdAt: "2024-01-01T08:20:00Z",
    lastUpdated: "2024-01-14T10:00:00Z",
    monitoringEnabled: true,
    category: "규제",
    tags: ["일본", "식품", "방사능"],
    url: "/search/results?q=일본+식품+방사능+검사",
  },
  {
    id: "bookmark-8",
    type: "hscode",
    title: "HS Code 2710.19 (석유제품)",
    description: "휘발유, 경유 등 석유제품 분류",
    createdAt: "2023-12-28T13:40:00Z",
    lastUpdated: "2024-01-13T14:15:00Z",
    monitoringEnabled: true,
    category: "석유화학",
    tags: ["석유제품", "원산지", "제재"],
    url: "/hscode/result/result-2710.19",
  },
  {
    id: "cargo-4",
    type: "tracking",
    title: "화물 OOLU7777888",
    description: "기계부품 수입 화물 추적",
    createdAt: "2024-01-10T15:20:00Z",
    lastUpdated: "2024-01-13T11:45:00Z",
    monitoringEnabled: true,
    category: "수입",
    tags: ["기계부품", "부산항", "적체"],
    url: "/tracking/result/OOLU7777888",
  },
  {
    id: "bookmark-9",
    type: "regulation",
    title: "인도 섬유 GST 세율",
    description: "인도 섬유 수출 관련 GST 세율 변경",
    createdAt: "2023-12-25T10:10:00Z",
    lastUpdated: "2024-01-13T09:20:00Z",
    monitoringEnabled: true,
    category: "규제",
    tags: ["인도", "섬유", "GST"],
    url: "/search/results?q=인도+섬유+GST",
  },
  {
    id: "bookmark-10",
    type: "hscode",
    title: "HS Code 3004.90 (의약품)",
    description: "기타 의약품 분류 및 수입 허가",
    createdAt: "2023-12-20T14:30:00Z",
    lastUpdated: "2024-01-12T17:30:00Z",
    monitoringEnabled: true,
    category: "의약품",
    tags: ["의약품", "수입허가", "식약처"],
    url: "/hscode/result/result-3004.90",
  },
  {
    id: "cargo-5",
    type: "tracking",
    title: "화물 CMAU3333222",
    description: "철강 제품 수입 화물 추적",
    createdAt: "2024-01-09T12:00:00Z",
    lastUpdated: "2024-01-12T14:10:00Z",
    monitoringEnabled: false,
    category: "수입",
    tags: ["철강", "광양항", "통관중"],
    url: "/tracking/result/CMAU3333222",
  },
  {
    id: "bookmark-11",
    type: "regulation",
    title: "베트남 EVFTA 관세 인하",
    description: "한-베트남 FTA 전자제품 관세 인하",
    createdAt: "2023-12-15T16:50:00Z",
    lastUpdated: "2024-01-12T10:40:00Z",
    monitoringEnabled: true,
    category: "규제",
    tags: ["베트남", "EVFTA", "전자제품"],
    url: "/search/results?q=베트남+EVFTA+관세",
  },
  {
    id: "bookmark-12",
    type: "hscode",
    title: "HS Code 9018.31 (의료기기)",
    description: "주사기 및 의료용 바늘 분류",
    createdAt: "2023-12-10T11:25:00Z",
    lastUpdated: "2024-01-11T16:20:00Z",
    monitoringEnabled: true,
    category: "의료기기",
    tags: ["의료기기", "CE인증", "EU"],
    url: "/hscode/result/result-9018.31",
  },
  {
    id: "cargo-6",
    type: "tracking",
    title: "화물 TEMU9999111",
    description: "자동차 부품 수입 화물 추적",
    createdAt: "2024-01-08T09:15:00Z",
    lastUpdated: "2024-01-11T13:55:00Z",
    monitoringEnabled: true,
    category: "수입",
    tags: ["자동차부품", "평택항", "통관대기"],
    url: "/tracking/result/TEMU9999111",
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
  {
    id: "rate-2",
    type: "regulation",
    title: "엔화 환율 모니터링",
    description: "JPY/KRW 환율 변동 추적",
    createdAt: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-13T16:30:00Z",
    monitoringEnabled: true,
    category: "환율",
    tags: ["엔화", "환율", "900원"],
    url: "/search/results?q=엔화+환율",
  },
  {
    id: "rate-3",
    type: "regulation",
    title: "유로화 환율 모니터링",
    description: "EUR/KRW 환율 변동 추적",
    createdAt: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-01-12T08:30:00Z",
    monitoringEnabled: true,
    category: "환율",
    tags: ["유로", "환율", "1480원"],
    url: "/search/results?q=유로+환율",
  },
];

// 카테고리별 통계 데이터 추가
export const mockCategoryStats = [
  {
    category: "전자제품",
    totalBookmarks: 3,
    activeMonitoring: 3,
    recentUpdates: 5,
    trend: "증가",
  },
  {
    category: "화장품",
    totalBookmarks: 1,
    activeMonitoring: 1,
    recentUpdates: 2,
    trend: "증가",
  },
  {
    category: "반도체",
    totalBookmarks: 1,
    activeMonitoring: 1,
    recentUpdates: 1,
    trend: "안정",
  },
  {
    category: "자동차",
    totalBookmarks: 1,
    activeMonitoring: 1,
    recentUpdates: 1,
    trend: "안정",
  },
  {
    category: "의약품",
    totalBookmarks: 1,
    activeMonitoring: 1,
    recentUpdates: 1,
    trend: "증가",
  },
  {
    category: "의료기기",
    totalBookmarks: 1,
    activeMonitoring: 1,
    recentUpdates: 1,
    trend: "증가",
  },
  {
    category: "석유화학",
    totalBookmarks: 1,
    activeMonitoring: 1,
    recentUpdates: 1,
    trend: "주의",
  },
  {
    category: "규제",
    totalBookmarks: 6,
    activeMonitoring: 5,
    recentUpdates: 8,
    trend: "증가",
  },
  {
    category: "환율",
    totalBookmarks: 3,
    activeMonitoring: 3,
    recentUpdates: 3,
    trend: "변동",
  },
];

// 중요도별 통계 데이터 추가
export const mockImportanceStats = {
  high: {
    count: 9,
    percentage: 45,
    color: "red",
  },
  medium: {
    count: 8,
    percentage: 40,
    color: "yellow",
  },
  low: {
    count: 3,
    percentage: 15,
    color: "green",
  },
};

// 최근 7일간 업데이트 트렌드 데이터 추가
export const mockUpdateTrend = [
  { date: "2024-01-09", count: 2 },
  { date: "2024-01-10", count: 3 },
  { date: "2024-01-11", count: 4 },
  { date: "2024-01-12", count: 5 },
  { date: "2024-01-13", count: 4 },
  { date: "2024-01-14", count: 6 },
  { date: "2024-01-15", count: 8 },
];

// 북마크 필터링 옵션 데이터 추가
export const mockFilterOptions = {
  categories: [
    "전체",
    "전자제품",
    "화장품",
    "반도체",
    "자동차",
    "의약품",
    "의료기기",
    "석유화학",
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
  monitoringStatus: [
    { value: "all", label: "전체" },
    { value: "enabled", label: "모니터링 활성" },
    { value: "disabled", label: "모니터링 비활성" },
  ],
};

// 피드 필터링 옵션 데이터 추가
export const mockFeedFilterOptions = {
  types: [
    { value: "all", label: "전체" },
    { value: "hscode_regulation", label: "HS Code 규제" },
    { value: "cargo_status", label: "화물 상태" },
    { value: "trade_news", label: "무역 뉴스" },
    { value: "exchange_rate", label: "환율" },
  ],
  importance: [
    { value: "all", label: "전체" },
    { value: "high", label: "높음" },
    { value: "medium", label: "보통" },
    { value: "low", label: "낮음" },
  ],
  timeRange: [
    { value: "today", label: "오늘" },
    { value: "week", label: "최근 7일" },
    { value: "month", label: "최근 30일" },
    { value: "all", label: "전체" },
  ],
};

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

export type CategoryStat = {
  category: string;
  totalBookmarks: number;
  activeMonitoring: number;
  recentUpdates: number;
  trend: "증가" | "감소" | "안정" | "주의" | "변동";
};

export type ImportanceStat = {
  count: number;
  percentage: number;
  color: string;
};

export type UpdateTrend = {
  date: string;
  count: number;
};

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterOptions = {
  categories: string[];
  types: FilterOption[];
  sortOptions: FilterOption[];
  monitoringStatus: FilterOption[];
};

export type FeedFilterOptions = {
  types: FilterOption[];
  importance: FilterOption[];
  timeRange: FilterOption[];
};
