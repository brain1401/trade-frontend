// 기존 Mock 데이터를 새로운 구조로 re-export
export {
  mockTradeNews,
  mockHSCodeNews as mockHSCodeNewsAll,
} from "./mock/news";
export { mockExchangeRates } from "./mock/trade";

// 레거시 지원을 위한 변환된 데이터 - 기존 형태 유지
export const mockPopularKeywords: string[] = [
  "리튬 배터리 HS Code",
  "화장품 유럽 수출 규제",
  "의료기기 FDA 인증",
  "자동차 부품 관세율",
  "태양광 패널 인도 BIS",
];

// 기존 구조로 변환된 최근 항목 데이터
export const mockRecentItems = [
  {
    text: "HS Code 8517.12 (스마트폰)",
    hscode: "8517.12",
  },
  {
    text: "HS Code 3304.99 (기타 화장품)",
    hscode: "3304.99",
  },
  {
    text: "HS Code 8542.31 (반도체)",
    hscode: "8542.31",
  },
  {
    text: "HS Code 9018.90 (기타 의료기기)",
    hscode: "9018.90",
  },
];
