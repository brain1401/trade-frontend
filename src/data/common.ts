import {
  BarChart,
  DollarSign,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
} from "lucide-react";

import type { CountryInfo } from "@/types/base";

export type MenuItem = {
  title: string;
  icon: React.ElementType;
  url: string;
  requiresAuth: boolean;
};

export const menuItems: MenuItem[] = [
  {
    title: "환율",
    icon: DollarSign,
    url: "/exchange-rates",
    requiresAuth: false,
  },
  {
    title: "뉴스",
    icon: Newspaper,
    url: "/news",
    requiresAuth: false,
  },
  {
    title: "무역 통계",
    icon: BarChart,
    url: "/statistics",
    requiresAuth: false,
  },
  {
    title: "대시보드",
    icon: LayoutDashboard,
    url: "/dashboard",
    requiresAuth: true,
  },
  {
    title: "채팅",
    icon: MessageSquare,
    url: "/dashboard/history",
    requiresAuth: true,
  },
];

// 국가 정보 데이터 (전체 시스템에서 공통 사용)
export const COUNTRIES: CountryInfo[] = [
  { code: "KR", name: "한국", flag: "🇰🇷" },
  { code: "US", name: "미국", flag: "🇺🇸" },
  { code: "CN", name: "중국", flag: "🇨🇳" },
  { code: "JP", name: "일본", flag: "🇯🇵" },
  { code: "DE", name: "독일", flag: "🇩🇪" },
  { code: "GB", name: "영국", flag: "🇬🇧" },
  { code: "FR", name: "프랑스", flag: "🇫🇷" },
  { code: "IT", name: "이탈리아", flag: "🇮🇹" },
  { code: "VN", name: "베트남", flag: "🇻🇳" },
  { code: "TH", name: "태국", flag: "🇹🇭" },
  { code: "IN", name: "인도", flag: "🇮🇳" },
  { code: "TW", name: "대만", flag: "🇹🇼" },
  { code: "SA", name: "사우디아라비아", flag: "🇸🇦" },
  { code: "AU", name: "호주", flag: "🇦🇺" },
  { code: "NL", name: "네덜란드", flag: "🇳🇱" },
];

/**
 * 한국의 리포터 코드 (UN Comtrade 표준)
 */
export const KOR_REPORTER_CODE = "410";

// 주요 통화 정보
export const CURRENCIES = {
  USD: { symbol: "$", name: "미국 달러" },
  EUR: { symbol: "€", name: "유로" },
  JPY: { symbol: "¥", name: "일본 엔" },
  CNY: { symbol: "¥", name: "중국 위안" },
  GBP: { symbol: "£", name: "영국 파운드" },
} as const;

// 주요 HS 코드 카테고리
export const HS_CATEGORIES = [
  "전자제품",
  "화장품",
  "반도체",
  "자동차",
  "의약품",
  "의료기기",
  "석유화학",
  "섬유",
  "식품",
  "기계",
] as const;

/**
 * 국가 코드로 해당 국가 정보를 조회합니다
 *
 * 시스템에서 사용하는 표준 국가 코드(ISO 3166-1 alpha-2)를 기반으로
 * 해당 국가의 상세 정보를 반환합니다.
 *
 * @param code - 조회할 국가 코드 (예: "KR", "US", "CN")
 * @returns 국가 정보 객체 또는 코드가 존재하지 않을 경우 undefined
 *
 * @example
 * 기본 사용법:
 * ```typescript
 * const korea = getCountryByCode("KR");
 * console.log(korea?.name); // "한국"
 * console.log(korea?.flag); // "🇰🇷"
 * ```
 *
 * @example
 * 존재하지 않는 코드 처리:
 * ```typescript
 * const unknown = getCountryByCode("XX");
 * if (unknown) {
 *   console.log(unknown.name);
 * } else {
 *   console.log("해당 국가를 찾을 수 없습니다");
 * }
 * ```
 */
export const getCountryByCode = (code: string): CountryInfo | undefined => {
  return COUNTRIES.find((country) => country.code === code);
};

/**
 * 여러 국가 코드로 해당하는 국가 정보 배열을 조회합니다
 *
 * 국가 코드 배열을 받아서 각 코드에 해당하는 국가 정보를 조회하고,
 * 유효한 국가 정보만 포함된 배열을 반환합니다. 존재하지 않는 코드는 자동으로 제외됩니다.
 *
 * @param codes - 조회할 국가 코드 배열
 * @returns 유효한 국가 정보들의 배열 (빈 배열일 수 있음)
 *
 * @example
 * 여러 국가 조회:
 * ```typescript
 * const countries = getCountriesByCodes(["KR", "US", "JP"]);
 * console.log(countries.length); // 3
 * countries.forEach(country => {
 *   console.log(`${country.flag} ${country.name}`);
 * });
 * // 🇰🇷 한국
 * // 🇺🇸 미국
 * // 🇯🇵 일본
 * ```
 *
 * @example
 * 일부 유효하지 않은 코드 포함:
 * ```typescript
 * const countries = getCountriesByCodes(["KR", "XX", "US", "YY"]);
 * console.log(countries.length); // 2 (유효한 것만)
 * console.log(countries.map(c => c.code)); // ["KR", "US"]
 * ```
 *
 * @example
 * 빈 배열 또는 모든 코드가 유효하지 않은 경우:
 * ```typescript
 * const emptyResult = getCountriesByCodes([]);
 * console.log(emptyResult.length); // 0
 *
 * const invalidResult = getCountriesByCodes(["XX", "YY"]);
 * console.log(invalidResult.length); // 0
 * ```
 */
export const getCountriesByCodes = (codes: string[]): CountryInfo[] => {
  return codes
    .map((code) => getCountryByCode(code))
    .filter(Boolean) as CountryInfo[];
};
