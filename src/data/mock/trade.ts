import type { ExchangeRate, TradeStatistics, CountryInfo } from "@/types";

// 환율 히스토리 데이터 타입
export type ExchangeRateHistory = {
  date: string;
  rate: number;
};

export type CurrencyTrend = {
  currency: string;
  period: "1D" | "1W" | "1M" | "3M" | "1Y";
  history: ExchangeRateHistory[];
  highestRate: number;
  lowestRate: number;
  averageRate: number;
  volatility: number;
};

// 확장된 환율 타입 (대륙 정보 포함)
export type EnhancedExchangeRate = ExchangeRate & {
  countryCode: string;
  countryName: string;
  continent:
    | "아시아"
    | "유럽"
    | "북미"
    | "남미"
    | "오세아니아"
    | "아프리카"
    | "중동";
  flag: string;
  isPopular: boolean;
};

// 전 세계 환율 정보 Mock 데이터 (50개국 이상)
export const mockGlobalExchangeRates: EnhancedExchangeRate[] = [
  // 아시아
  {
    currency: "USD",
    currencyName: "미국 달러",
    rate: 1359.4,
    change: -2.78,
    symbol: "$",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "US",
    countryName: "미국",
    continent: "북미",
    flag: "🇺🇸",
    isPopular: true,
  },
  {
    currency: "JPY",
    currencyName: "일본 엔",
    rate: 9.43,
    change: -0.08,
    symbol: "¥",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "JP",
    countryName: "일본",
    continent: "아시아",
    flag: "🇯🇵",
    isPopular: true,
  },
  {
    currency: "CNY",
    currencyName: "중국 위안",
    rate: 188.2,
    change: -0.85,
    symbol: "¥",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "CN",
    countryName: "중국",
    continent: "아시아",
    flag: "🇨🇳",
    isPopular: true,
  },
  {
    currency: "HKD",
    currencyName: "홍콩 달러",
    rate: 174.5,
    change: -1.2,
    symbol: "HK$",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "HK",
    countryName: "홍콩",
    continent: "아시아",
    flag: "🇭🇰",
    isPopular: false,
  },
  {
    currency: "TWD",
    currencyName: "대만 달러",
    rate: 42.1,
    change: 0.3,
    symbol: "NT$",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "TW",
    countryName: "대만",
    continent: "아시아",
    flag: "🇹🇼",
    isPopular: false,
  },
  {
    currency: "SGD",
    currencyName: "싱가포르 달러",
    rate: 1015.7,
    change: -0.9,
    symbol: "S$",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "SG",
    countryName: "싱가포르",
    continent: "아시아",
    flag: "🇸🇬",
    isPopular: false,
  },
  {
    currency: "THB",
    currencyName: "태국 바트",
    rate: 40.2,
    change: 1.5,
    symbol: "฿",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "TH",
    countryName: "태국",
    continent: "아시아",
    flag: "🇹🇭",
    isPopular: false,
  },
  {
    currency: "MYR",
    currencyName: "말레이시아 링깃",
    rate: 304.8,
    change: 0.7,
    symbol: "RM",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "MY",
    countryName: "말레이시아",
    continent: "아시아",
    flag: "🇲🇾",
    isPopular: false,
  },
  {
    currency: "VND",
    currencyName: "베트남 동",
    rate: 0.054,
    change: -0.2,
    symbol: "₫",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "VN",
    countryName: "베트남",
    continent: "아시아",
    flag: "🇻🇳",
    isPopular: false,
  },
  {
    currency: "IDR",
    currencyName: "인도네시아 루피아",
    rate: 0.087,
    change: 0.8,
    symbol: "Rp",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "ID",
    countryName: "인도네시아",
    continent: "아시아",
    flag: "🇮🇩",
    isPopular: false,
  },
  {
    currency: "PHP",
    currencyName: "필리핀 페소",
    rate: 23.8,
    change: 1.1,
    symbol: "₱",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "PH",
    countryName: "필리핀",
    continent: "아시아",
    flag: "🇵🇭",
    isPopular: false,
  },
  {
    currency: "INR",
    currencyName: "인도 루피",
    rate: 16.3,
    change: -0.5,
    symbol: "₹",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "IN",
    countryName: "인도",
    continent: "아시아",
    flag: "🇮🇳",
    isPopular: false,
  },

  // 유럽
  {
    currency: "EUR",
    currencyName: "유로",
    rate: 1421.5,
    change: -1.52,
    symbol: "€",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "EU",
    countryName: "유럽연합",
    continent: "유럽",
    flag: "🇪🇺",
    isPopular: true,
  },
  {
    currency: "GBP",
    currencyName: "영국 파운드",
    rate: 1702.3,
    change: -2.1,
    symbol: "£",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "GB",
    countryName: "영국",
    continent: "유럽",
    flag: "🇬🇧",
    isPopular: true,
  },
  {
    currency: "CHF",
    currencyName: "스위스 프랑",
    rate: 1524.8,
    change: -0.8,
    symbol: "Fr",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "CH",
    countryName: "스위스",
    continent: "유럽",
    flag: "🇨🇭",
    isPopular: false,
  },
  {
    currency: "SEK",
    currencyName: "스웨덴 크로나",
    rate: 127.5,
    change: 0.9,
    symbol: "kr",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "SE",
    countryName: "스웨덴",
    continent: "유럽",
    flag: "🇸🇪",
    isPopular: false,
  },
  {
    currency: "NOK",
    currencyName: "노르웨이 크로네",
    rate: 125.3,
    change: 1.2,
    symbol: "kr",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "NO",
    countryName: "노르웨이",
    continent: "유럽",
    flag: "🇳🇴",
    isPopular: false,
  },
  {
    currency: "DKK",
    currencyName: "덴마크 크로네",
    rate: 190.7,
    change: -1.1,
    symbol: "kr",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "DK",
    countryName: "덴마크",
    continent: "유럽",
    flag: "🇩🇰",
    isPopular: false,
  },
  {
    currency: "PLN",
    currencyName: "폴란드 즐로티",
    rate: 335.2,
    change: 0.6,
    symbol: "zł",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "PL",
    countryName: "폴란드",
    continent: "유럽",
    flag: "🇵🇱",
    isPopular: false,
  },
  {
    currency: "CZK",
    currencyName: "체코 코루나",
    rate: 58.9,
    change: 0.4,
    symbol: "Kč",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "CZ",
    countryName: "체코",
    continent: "유럽",
    flag: "🇨🇿",
    isPopular: false,
  },
  {
    currency: "HUF",
    currencyName: "헝가리 포린트",
    rate: 3.7,
    change: 1.8,
    symbol: "Ft",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "HU",
    countryName: "헝가리",
    continent: "유럽",
    flag: "🇭🇺",
    isPopular: false,
  },
  {
    currency: "RUB",
    currencyName: "러시아 루블",
    rate: 14.2,
    change: 3.5,
    symbol: "₽",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "RU",
    countryName: "러시아",
    continent: "유럽",
    flag: "🇷🇺",
    isPopular: false,
  },

  // 북미
  {
    currency: "CAD",
    currencyName: "캐나다 달러",
    rate: 1005.3,
    change: -1.7,
    symbol: "C$",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "CA",
    countryName: "캐나다",
    continent: "북미",
    flag: "🇨🇦",
    isPopular: false,
  },
  {
    currency: "MXN",
    currencyName: "멕시코 페소",
    rate: 66.8,
    change: 2.1,
    symbol: "$",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "MX",
    countryName: "멕시코",
    continent: "북미",
    flag: "🇲🇽",
    isPopular: false,
  },

  // 남미
  {
    currency: "BRL",
    currencyName: "브라질 헤알",
    rate: 235.7,
    change: 1.8,
    symbol: "R$",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "BR",
    countryName: "브라질",
    continent: "남미",
    flag: "🇧🇷",
    isPopular: false,
  },
  {
    currency: "ARS",
    currencyName: "아르헨티나 페소",
    rate: 1.35,
    change: 4.2,
    symbol: "$",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "AR",
    countryName: "아르헨티나",
    continent: "남미",
    flag: "🇦🇷",
    isPopular: false,
  },
  {
    currency: "CLP",
    currencyName: "칠레 페소",
    rate: 1.42,
    change: 0.9,
    symbol: "$",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "CL",
    countryName: "칠레",
    continent: "남미",
    flag: "🇨🇱",
    isPopular: false,
  },

  // 오세아니아
  {
    currency: "AUD",
    currencyName: "호주 달러",
    rate: 867.4,
    change: -0.6,
    symbol: "A$",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "AU",
    countryName: "호주",
    continent: "오세아니아",
    flag: "🇦🇺",
    isPopular: false,
  },
  {
    currency: "NZD",
    currencyName: "뉴질랜드 달러",
    rate: 808.9,
    change: -1.3,
    symbol: "NZ$",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "NZ",
    countryName: "뉴질랜드",
    continent: "오세아니아",
    flag: "🇳🇿",
    isPopular: false,
  },

  // 중동
  {
    currency: "SAR",
    currencyName: "사우디 리얄",
    rate: 362.5,
    change: -2.3,
    symbol: "﷼",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "SA",
    countryName: "사우디아라비아",
    continent: "중동",
    flag: "🇸🇦",
    isPopular: false,
  },
  {
    currency: "AED",
    currencyName: "아랍에미리트 디르함",
    rate: 370.2,
    change: -2.1,
    symbol: "د.إ",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "AE",
    countryName: "아랍에미리트",
    continent: "중동",
    flag: "🇦🇪",
    isPopular: false,
  },
  {
    currency: "QAR",
    currencyName: "카타르 리얄",
    rate: 373.4,
    change: -2.0,
    symbol: "﷼",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "QA",
    countryName: "카타르",
    continent: "중동",
    flag: "🇶🇦",
    isPopular: false,
  },
  {
    currency: "KWD",
    currencyName: "쿠웨이트 디나르",
    rate: 4421.8,
    change: -1.8,
    symbol: "د.ك",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "KW",
    countryName: "쿠웨이트",
    continent: "중동",
    flag: "🇰🇼",
    isPopular: false,
  },

  // 아프리카
  {
    currency: "ZAR",
    currencyName: "남아프리카 랜드",
    rate: 74.5,
    change: 2.3,
    symbol: "R",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "ZA",
    countryName: "남아프리카공화국",
    continent: "아프리카",
    flag: "🇿🇦",
    isPopular: false,
  },
  {
    currency: "EGP",
    currencyName: "이집트 파운드",
    rate: 27.8,
    change: 1.5,
    symbol: "£",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "EG",
    countryName: "이집트",
    continent: "아프리카",
    flag: "🇪🇬",
    isPopular: false,
  },
  {
    currency: "NGN",
    currencyName: "나이지리아 나이라",
    rate: 0.88,
    change: 3.1,
    symbol: "₦",
    lastUpdated: "2025-01-12T09:00:00Z",
    countryCode: "NG",
    countryName: "나이지리아",
    continent: "아프리카",
    flag: "🇳🇬",
    isPopular: false,
  },
];

// 기존 4개 주요 통화는 호환성을 위해 유지
export const mockExchangeRates: ExchangeRate[] = [
  {
    currency: "USD",
    currencyName: "미국 달러",
    rate: 1359.4,
    change: -2.78,
    symbol: "$",
    lastUpdated: "2025-01-12T09:00:00Z",
  },
  {
    currency: "EUR",
    currencyName: "유로",
    rate: 1421.5,
    change: -1.52,
    symbol: "€",
    lastUpdated: "2025-01-12T09:00:00Z",
  },
  {
    currency: "JPY",
    currencyName: "일본 엔",
    rate: 9.43,
    change: -0.08,
    symbol: "¥",
    lastUpdated: "2025-01-12T09:00:00Z",
  },
  {
    currency: "CNY",
    currencyName: "중국 위안",
    rate: 188.2,
    change: -0.85,
    symbol: "¥",
    lastUpdated: "2025-01-12T09:00:00Z",
  },
];

// 환율 히스토리 Mock 데이터 생성 함수
const generateExchangeRateHistory = (
  baserate: number,
  days: number,
  volatility: number = 0.02,
): ExchangeRateHistory[] => {
  const history: ExchangeRateHistory[] = [];
  let currentRate = baserate;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // 랜덤 변동 적용
    const change = (Math.random() - 0.5) * 2 * volatility;
    currentRate = currentRate * (1 + change);

    history.push({
      date: date.toISOString().split("T")[0],
      rate: Math.round(currentRate * 100) / 100,
    });
  }

  return history;
};

// 통화별 트렌드 데이터
export const mockCurrencyTrends: CurrencyTrend[] = [
  {
    currency: "USD",
    period: "1M",
    history: generateExchangeRateHistory(1400, 30, 0.015),
    highestRate: 1425.8,
    lowestRate: 1342.1,
    averageRate: 1378.5,
    volatility: 1.2,
  },
  {
    currency: "EUR",
    period: "1M",
    history: generateExchangeRateHistory(1450, 30, 0.018),
    highestRate: 1465.2,
    lowestRate: 1398.7,
    averageRate: 1431.8,
    volatility: 1.5,
  },
  {
    currency: "JPY",
    period: "1M",
    history: generateExchangeRateHistory(9.8, 30, 0.012),
    highestRate: 9.87,
    lowestRate: 9.21,
    averageRate: 9.54,
    volatility: 0.8,
  },
  {
    currency: "CNY",
    period: "1M",
    history: generateExchangeRateHistory(195, 30, 0.02),
    highestRate: 201.5,
    lowestRate: 185.3,
    averageRate: 193.2,
    volatility: 1.8,
  },
];

// 환율 뉴스 Mock 데이터
export const mockExchangeRateNews = [
  {
    id: "exr-news-001",
    title: "미국 연준 기준금리 동결, 달러 환율 하락세",
    summary:
      "연방준비제도(Fed)가 기준금리를 현 수준에서 유지하기로 결정하면서 달러 대비 원화 환율이 하락했습니다.",
    source: "한국은행",
    publishedAt: "2025-01-12T08:30:00Z",
    category: "monetary",
    impact: "medium",
  },
  {
    id: "exr-news-002",
    title: "유럽중앙은행 금리인하 시사, 유로 약세 지속",
    summary:
      "유럽중앙은행(ECB)이 경기 부양을 위한 추가 금리인하 가능성을 시사하며 유로화 환율이 약세를 보이고 있습니다.",
    source: "연합뉴스",
    publishedAt: "2025-01-11T14:20:00Z",
    category: "monetary",
    impact: "high",
  },
  {
    id: "exr-news-003",
    title: "중국 경제지표 부진, 위안화 환율 변동성 확대",
    summary:
      "중국의 12월 제조업 PMI가 예상을 하회하면서 위안화 환율의 변동성이 커지고 있습니다.",
    source: "매일경제",
    publishedAt: "2025-01-10T16:45:00Z",
    category: "economic",
    impact: "medium",
  },
];

// 국가 정보 Mock 데이터
export const mockCountries: CountryInfo[] = [
  { code: "US", name: "미국", flag: "🇺🇸" },
  { code: "CN", name: "중국", flag: "🇨🇳" },
  { code: "JP", name: "일본", flag: "🇯🇵" },
  { code: "DE", name: "독일", flag: "🇩🇪" },
  { code: "GB", name: "영국", flag: "🇬🇧" },
  { code: "VN", name: "베트남", flag: "🇻🇳" },
  { code: "TH", name: "태국", flag: "🇹🇭" },
  { code: "IN", name: "인도", flag: "🇮🇳" },
];

// 무역 통계 Mock 데이터
export const mockTradeStatistics: TradeStatistics[] = [
  {
    hsCode: "8517.12",
    period: "2024-Q4",
    exportValue: 25800000,
    importValue: 8900000,
    exportGrowthRate: 15.2,
    importGrowthRate: -3.8,
    mainExportCountries: [
      { code: "US", name: "미국", flag: "🇺🇸" },
      { code: "CN", name: "중국", flag: "🇨🇳" },
      { code: "JP", name: "일본", flag: "🇯🇵" },
    ],
    mainImportCountries: [
      { code: "CN", name: "중국", flag: "🇨🇳" },
      { code: "VN", name: "베트남", flag: "🇻🇳" },
      { code: "TH", name: "태국", flag: "🇹🇭" },
    ],
  },
  {
    hsCode: "3304.99",
    period: "2024-Q4",
    exportValue: 156000000,
    importValue: 45000000,
    exportGrowthRate: 28.5,
    importGrowthRate: 12.3,
    mainExportCountries: [
      { code: "CN", name: "중국", flag: "🇨🇳" },
      { code: "US", name: "미국", flag: "🇺🇸" },
      { code: "JP", name: "일본", flag: "🇯🇵" },
    ],
    mainImportCountries: [
      { code: "FR", name: "프랑스", flag: "🇫🇷" },
      { code: "IT", name: "이탈리아", flag: "🇮🇹" },
      { code: "US", name: "미국", flag: "🇺🇸" },
    ],
  },
  {
    hsCode: "8542.31",
    period: "2024-Q4",
    exportValue: 89500000000,
    importValue: 23400000000,
    exportGrowthRate: 8.7,
    importGrowthRate: 15.2,
    mainExportCountries: [
      { code: "CN", name: "중국", flag: "🇨🇳" },
      { code: "US", name: "미국", flag: "🇺🇸" },
      { code: "JP", name: "일본", flag: "🇯🇵" },
    ],
    mainImportCountries: [
      { code: "TW", name: "대만", flag: "🇹🇼" },
      { code: "JP", name: "일본", flag: "🇯🇵" },
      { code: "NL", name: "네덜란드", flag: "🇳🇱" },
    ],
  },
];

// 유틸리티 함수들
export const getExchangeRateByCurrency = (
  currency: string,
): ExchangeRate | undefined => {
  return mockExchangeRates.find((rate) => rate.currency === currency);
};

export const getCurrencyTrendByCurrency = (
  currency: string,
): CurrencyTrend | undefined => {
  return mockCurrencyTrends.find((trend) => trend.currency === currency);
};

export const getTradeStatisticsByHSCode = (
  hsCode: string,
): TradeStatistics | undefined => {
  return mockTradeStatistics.find((stat) => stat.hsCode === hsCode);
};

export const getCountryByCode = (code: string): CountryInfo | undefined => {
  return mockCountries.find((country) => country.code === code);
};

export const getTopExportCountries = (limit: number = 5): CountryInfo[] => {
  // 실제로는 무역 통계를 기반으로 계산해야 하지만, Mock에서는 임의로 반환
  return mockCountries.slice(0, limit);
};

export const getTopImportCountries = (limit: number = 5): CountryInfo[] => {
  // 실제로는 무역 통계를 기반으로 계산해야 하지만, Mock에서는 임의로 반환
  return mockCountries.slice(2, 2 + limit);
};

// 필터링 및 검색 유틸리티 함수들
export const getContinents = (): string[] => {
  return [
    "전체",
    "아시아",
    "유럽",
    "북미",
    "남미",
    "오세아니아",
    "아프리카",
    "중동",
  ];
};

export const getPopularCurrencies = (): EnhancedExchangeRate[] => {
  return mockGlobalExchangeRates.filter((rate) => rate.isPopular);
};

export const searchExchangeRates = (
  query: string,
  continent: string = "전체",
  showOnlyPopular: boolean = false,
): EnhancedExchangeRate[] => {
  let filtered = mockGlobalExchangeRates;

  // 대륙 필터링
  if (continent !== "전체") {
    filtered = filtered.filter((rate) => rate.continent === continent);
  }

  // 인기 통화 필터링
  if (showOnlyPopular) {
    filtered = filtered.filter((rate) => rate.isPopular);
  }

  // 검색어 필터링 (통화명, 국가명, 통화코드)
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(
      (rate) =>
        rate.currency.toLowerCase().includes(searchTerm) ||
        (rate.currencyName &&
          rate.currencyName.toLowerCase().includes(searchTerm)) ||
        rate.countryName.toLowerCase().includes(searchTerm),
    );
  }

  return filtered;
};
