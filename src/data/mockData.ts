import type { ExchangeRate, TradeNews, HSCodeNews } from "../types";

export const mockExchangeRates: ExchangeRate[] = [
  { currency: "USD", rate: 1359.4, change: -2.78, symbol: "$" },
  { currency: "EUR", rate: 1421.5, change: -1.52, symbol: "€" },
  { currency: "JPY", rate: 9.43, change: -0.08, symbol: "¥" },
  { currency: "CNY", rate: 188.2, change: -0.85, symbol: "¥" },
];

export const mockTradeNews: TradeNews[] = [
  {
    id: 1,
    title: "글로벌 공급망 재편, 한국 기업의 대응 전략은?",
    summary:
      "미-중 갈등 심화와 팬데믹 이후 글로벌 공급망이 빠르게 재편되고 있습니다. 우리 기업들은 신흥 시장으로의 다변화와 핵심 기술 자립화에 더욱 힘써야 할 시점입니다. 정부는 관련 R&D 지원을 확대할 예정입니다.",
    source: "무역일보",
    date: "2025-06-05",
    uuid: "1",
    hscode: "8517.12",
    type: "규제",
  },
  {
    id: 2,
    title: "EU, 탄소국경조정제도(CBAM) 본격 시행 임박",
    summary:
      "유럽연합의 CBAM 시행이 코앞으로 다가오면서 국내 철강, 알루미늄 수출 기업들의 발등에 불이 떨어졌습니다. 탄소 배출량 감축 및 증빙 시스템 마련이 시급합니다.",
    source: "환경경제신문",
    date: "2025-06-04",
    uuid: "2",
    hscode: "257.85",
    type: "관세",
  },
  {
    id: 3,
    title: "인도 태평양 경제 프레임워크(IPEF) 협상 동향",
    summary:
      "디지털 무역, 청정 에너지 등 주요 의제에 대한 IPEF 회원국 간 협상이 활발히 진행 중입니다. 특히 공급망 안정화와 관련하여 구체적인 합의가 도출될지 주목됩니다.",
    source: "국제무역연구원",
    date: "2025-06-03",
    uuid: "3",
    hscode: "7657.49",
    type: "규제",
  },
  {
    id: 4,
    title: "중남미 시장, 새로운 수출 기회로 부상",
    summary:
      "최근 중남미 국가들의 경제 성장과 함께 한국산 소비재 및 중간재에 대한 수요가 증가하고 있습니다. K-컬처의 인기도 한몫하고 있어, 적극적인 시장 개척이 요구됩니다.",
    source: "수출입은행 보고서",
    date: "2025-06-02",
    uuid: "4",
    hscode: "7657.49",
    type: "규제",
  },
  {
    id: 5,
    title: "중남미 시장, 새로운 수출 기회로 부상",
    summary:
      "최근 중남미 국가들의 경제 성장과 함께 한국산 소비재 및 중간재에 대한 수요가 증가하고 있습니다. K-컬처의 인기도 한몫하고 있어, 적극적인 시장 개척이 요구됩니다.",
    source: "수출입은행 보고서",
    date: "2025-06-02",
    uuid: "5",
    hscode: "7657.49",
    type: "규제",
  },
  {
    id: 6,
    title: "중남미 시장, 새로운 수출 기회로 부상",
    summary:
      "최근 중남미 국가들의 경제 성장과 함께 한국산 소비재 및 중간재에 대한 수요가 증가하고 있습니다. K-컬처의 인기도 한몫하고 있어, 적극적인 시장 개척이 요구됩니다.",
    source: "수출입은행 보고서",
    date: "2025-06-02",
    uuid: "6",
    hscode: "7657.49",
    type: "규제",
  },
];

export const mockHSCodeNewsAll: HSCodeNews[] = [
  {
    id: 1,
    hscode: "8517.12",
    title: "스마트폰 HS Code 최신 규제 변경 안내",
    summary:
      "X국에서 스마트폰(HS Code: 8517.12) 수입 시 필요한 전자파 안전 인증 요건이 7월 1일부터 강화됩니다. 관련 서류 준비에 만전을 기하시기 바랍니다.",
    source: "관세청 공고",
    date: "2025-06-05",
    type: "규제",
    bookmarked: true,
    uuid: "1",
  },
  {
    id: 2,
    hscode: "3304.99",
    title: "화장품(HS Code: 3304.99) 관세율 인하 소식",
    summary:
      "A국과의 FTA 추가 협상 타결로 일부 기능성 화장품(HS Code: 3304.99)의 수입 관세율이 다음 달부터 2%p 인하될 예정입니다.",
    source: "FTA 포털",
    date: "2025-06-04",
    type: "관세",
    bookmarked: false,
    uuid: "2",
  },
  {
    id: 3,
    hscode: "6203.42",
    title: "면바지(HS Code: 6203.42) 원산지 규정 유의사항",
    summary:
      "B국으로 수출되는 면바지(HS Code: 6203.42)의 경우, 원단 생산지에 따른 원산지 결정 기준이 변경되어 수출 시 각별한 주의가 필요합니다.",
    source: "코트라",
    date: "2025-06-02",
    type: "뉴스",
    bookmarked: true,
    uuid: "3",
  },
  {
    id: 4,
    hscode: "9018.90",
    title: "의료기기(HS Code: 9018.90) 유럽 CE 인증 변경",
    summary:
      "특정 의료기기에 대한 유럽 MDR(Medical Device Regulation) 요구사항이 업데이트 되었습니다. 기존 CE 인증 유지 및 갱신 시 확인이 필요합니다.",
    source: "의료기기정보원",
    date: "2025-06-01",
    type: "규제",
    bookmarked: false,
    uuid: "4",
  },
  {
    id: 5,
    hscode: "0805.10",
    title: "오렌지(HS Code: 0805.10) 수입 검역 강화",
    summary:
      "C국산 오렌지에 대한 병해충 검역이 강화되어 통관 지연이 예상됩니다.",
    source: "농림축산검역본부",
    date: "2025-06-06",
    type: "규제",
    bookmarked: true,
    uuid: "5",
  },
  {
    id: 6,
    hscode: "2204.21",
    title: "포도주(HS Code: 2204.21) 라벨링 규정 변경",
    summary:
      "D국으로 수출되는 포도주의 영양 정보 및 알레르기 유발 물질 표시 규정이 변경되었습니다.",
    source: "식품안전정보원",
    date: "2025-06-07",
    type: "규제",
    bookmarked: true,
    uuid: "6",
  },
];

export const mockPopularKeywords: string[] = [
  "리튬 배터리 HS Code",
  "화장품 유럽 수출 규제",
  "의료기기 FDA 인증",
  "자동차 부품 관세율",
  "태양광 패널 인도 BIS",
];

type RecentItem = {
  text: string;
  hscode: string;
};
export const mockRecentItems: RecentItem[] = [
  {
    text: "HS Code 8517.13 (스마트폰)",
    hscode: "8517.13",
  },
  {
    text: "HS Code 3304.99 (기타 화장품)",
    hscode: "3304.99",
  },
  {
    text: "HS Code 0203.29 (냉동 돼지고기)",
    hscode: "0203.29",
  },
  {
    text: "HS Code 9018.90 (기타 의료기기)",
    hscode: "9018.90",
  },
];
