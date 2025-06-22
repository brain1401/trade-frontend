import type { TradeNews, HSCodeNews } from "@/types/news";

/**
 * 무역 뉴스 Mock 데이터 배열
 *
 * 글로벌 공급망, 규제 변경, 무역 정책 등 무역 관련 최신 뉴스 정보를 제공합니다.
 * 각 뉴스는 카테고리별로 분류되어 있으며 중요도에 따라 우선순위가 매겨집니다.
 *
 * @example
 * ```typescript
 * const latestNews = mockTradeNews.slice(0, 3);
 * console.log(latestNews[0].title); // "글로벌 공급망 재편, 한국 기업의 대응 전략은?"
 * ```
 */
export const mockTradeNews: TradeNews[] = [
  {
    uuid: "trade-news-1",
    title: "글로벌 공급망 재편, 한국 기업의 대응 전략은?",
    summary:
      "미-중 갈등 심화와 팬데믹 이후 글로벌 공급망이 빠르게 재편되고 있습니다. 우리 기업들은 신흥 시장으로의 다변화와 핵심 기술 자립화에 더욱 힘써야 할 시점입니다.",
    content: "글로벌 공급망 재편에 따른 한국 기업의 대응 전략 상세 내용...",
    source: "무역일보",
    category: "무역",
    tags: ["공급망", "무역정책", "리스크관리"],
    importance: "HIGH",
    date: "2025-01-12T09:00:00Z",
    publishedAt: "2025-01-12T09:00:00Z",
    type: "규제",
    url: "https://www.example.com/news/1",
    relatedCountries: ["미국", "중국", "한국"],
    affectedIndustries: ["제조업", "전자", "자동차"],
    effectiveDate: "2025-02-01T00:00:00Z",
  },
  {
    uuid: "trade-news-2",
    title: "EU, 탄소국경조정제도(CBAM) 본격 시행 임박",
    summary:
      "유럽연합의 CBAM 시행이 코앞으로 다가오면서 국내 철강, 알루미늄 수출 기업들의 발등에 불이 떨어졌습니다. 탄소 배출량 감축 및 증빙 시스템 마련이 시급합니다.",
    content: "EU, 탄소국경조정제도(CBAM) 본격 시행 임박 상세 내용...",
    source: "환경경제신문",
    category: "규제",
    tags: ["CBAM", "탄소국경조정", "환경규제"],
    importance: "HIGH",
    date: "2025-01-11T09:00:00Z",
    publishedAt: "2025-01-11T09:00:00Z",
    type: "규제",
    url: "https://www.example.com/news/2",
    relatedCountries: ["유럽연합"],
    affectedIndustries: ["철강", "알루미늄", "시멘트"],
    effectiveDate: "2025-01-01T00:00:00Z",
  },
  {
    uuid: "trade-news-3",
    title: "인도 태평양 경제 프레임워크(IPEF) 협상 동향",
    summary:
      "디지털 무역, 청정 에너지 등 주요 의제에 대한 IPEF 회원국 간 협상이 활발히 진행 중입니다. 특히 공급망 안정화와 관련하여 구체적인 합의가 도출될지 주목됩니다.",
    content: "인도 태평양 경제 프레임워크(IPEF) 협상 동향 상세 내용...",
    source: "국제무역연구원",
    category: "정책",
    tags: ["IPEF", "디지털무역", "공급망"],
    importance: "HIGH",
    date: "2025-01-10T09:00:00Z",
    publishedAt: "2025-01-10T09:00:00Z",
    type: "협정",
    url: "https://www.example.com/news/3",
    relatedCountries: ["미국", "일본", "인도", "호주"],
    affectedIndustries: ["디지털", "에너지", "제조업"],
  },
  {
    uuid: "trade-news-4",
    title: "중남미 시장, 새로운 수출 기회로 부상",
    summary:
      "최근 중남미 국가들의 경제 성장과 함께 한국산 소비재 및 중간재에 대한 수요가 증가하고 있습니다. K-컬처의 인기도 한몫하고 있어, 적극적인 시장 개척이 요구됩니다.",
    content: "중남미 시장, 새로운 수출 기회로 부상 상세 내용...",
    source: "수출입은행 보고서",
    category: "무역",
    tags: ["중남미", "신시장", "K-컬처"],
    importance: "MEDIUM",
    date: "2025-01-09T09:00:00Z",
    publishedAt: "2025-01-09T09:00:00Z",
    type: "뉴스",
    url: "https://www.example.com/news/4",
    relatedCountries: ["브라질", "멕시코", "칠레"],
    affectedIndustries: ["소비재", "중간재", "엔터테인먼트"],
  },
  {
    uuid: "trade-news-5",
    title: "반도체 수출 규제 완화, 새로운 기회 창출",
    summary:
      "주요국의 반도체 수출 규제가 일부 완화되면서 우리 기업들에게 새로운 기회가 열리고 있습니다. 첨단 반도체 분야에서의 경쟁력 강화가 중요한 과제로 대두되고 있습니다.",
    content: "반도체 수출 규제 완화, 새로운 기회 창출 상세 내용...",
    source: "전자신문",
    category: "규제",
    tags: ["반도체", "수출규제", "기술경쟁력"],
    importance: "HIGH",
    date: "2025-01-08T09:00:00Z",
    publishedAt: "2025-01-08T09:00:00Z",
    type: "규제",
    url: "https://www.example.com/news/5",
    relatedCountries: ["미국", "중국", "네덜란드"],
    affectedIndustries: ["반도체", "전자", "IT"],
  },
];

/**
 * HS Code 관련 뉴스 Mock 데이터 배열
 *
 * 특정 HS Code와 관련된 규제 변경, 관세율 조정, 인증 요건 변경 등의
 * 최신 정보를 제공합니다. 각 뉴스는 해당 HS Code와 연결되어 있습니다.
 *
 * @example
 * ```typescript
 * const phoneNews = mockHSCodeNews.filter(news => news.hscode === "8517.12");
 * console.log(phoneNews[0].title); // "스마트폰 HS Code 8517.12 전자파 안전 인증 요건 강화"
 * ```
 */
export const mockHSCodeNews: HSCodeNews[] = [
  {
    uuid: "hscode-news-1",
    hscode: "8517.12",
    title: "스마트폰 HS Code 8517.12 전자파 안전 인증 요건 강화",
    summary:
      "EU에서 스마트폰 수입 시 필요한 전자파 안전 인증 요건이 2월 1일부터 강화됩니다. 관련 서류 준비에 만전을 기하시기 바랍니다.",
    content: "스마트폰 HS Code 8517.12 전자파 안전 인증 요건 강화 상세 내용...",
    source: "관세청 공고",
    category: "규제",
    tags: ["8517.12", "전자파인증", "EU규제", "안전인증"],
    importance: "HIGH",
    date: "2025-01-12T09:00:00Z",
    publishedAt: "2025-01-12T09:00:00Z",
    bookmarked: true,
    url: "https://www.example.com/news/hs-1",
    impact: "HIGH",
    relatedKeywords: ["전자파", "안전인증", "스마트폰", "EU규제"],
  },
  {
    uuid: "hscode-news-2",
    hscode: "3304.99",
    title: "화장품 HS Code 3304.99 관세율 인하 소식",
    summary:
      "미국과의 FTA 추가 협상 타결로 일부 기능성 화장품의 수입 관세율이 다음 달부터 2%p 인하될 예정입니다.",
    content: "화장품 HS Code 3304.99 관세율 인하 소식 상세 내용...",
    source: "FTA 포털",
    category: "관세",
    tags: ["3304.99", "관세인하", "FTA", "화장품"],
    importance: "MEDIUM",
    date: "2025-01-11T09:00:00Z",
    publishedAt: "2025-01-11T09:00:00Z",
    bookmarked: false,
    url: "https://www.example.com/news/hs-2",
    impact: "MEDIUM",
    relatedKeywords: ["관세", "FTA", "화장품", "미국"],
  },
  {
    uuid: "hscode-news-3",
    hscode: "6203.42",
    title: "면바지 HS Code 6203.42 원산지 규정 유의사항",
    summary:
      "베트남으로 수출되는 면바지의 경우, 원단 생산지에 따른 원산지 결정 기준이 변경되어 수출 시 각별한 주의가 필요합니다.",
    content: "면바지 HS Code 6203.42 원산지 규정 유의사항 상세 내용...",
    source: "KOTRA",
    category: "규제",
    tags: ["6203.42", "원산지규정", "베트남", "면바지"],
    importance: "MEDIUM",
    date: "2025-01-10T09:00:00Z",
    publishedAt: "2025-01-10T09:00:00Z",
    bookmarked: true,
    url: "https://www.example.com/news/hs-3",
    impact: "MEDIUM",
    relatedKeywords: ["원산지", "베트남", "섬유", "수출"],
  },
  {
    uuid: "hscode-news-4",
    hscode: "9018.90",
    title: "의료기기 HS Code 9018.90 유럽 CE 인증 변경",
    summary:
      "특정 의료기기에 대한 유럽 MDR(Medical Device Regulation) 요구사항이 업데이트 되었습니다. 기존 CE 인증 유지 및 갱신 시 확인이 필요합니다.",
    content: "의료기기 HS Code 9018.90 유럽 CE 인증 변경 상세 내용...",
    source: "의료기기정보원",
    category: "인증",
    tags: ["9018.90", "CE인증", "MDR", "의료기기"],
    importance: "HIGH",
    date: "2025-01-09T09:00:00Z",
    publishedAt: "2025-01-09T09:00:00Z",
    bookmarked: false,
    url: "https://www.example.com/news/hs-4",
    impact: "HIGH",
    relatedKeywords: ["CE인증", "MDR", "의료기기", "유럽"],
  },
];

/**
 * UUID로 뉴스 조회하는 유틸리티 함수
 *
 * 전체 뉴스 목록(무역 뉴스 + HS Code 뉴스)에서 지정된 UUID에 해당하는
 * 뉴스를 검색하여 반환합니다.
 *
 * @param uuid - 검색할 뉴스의 고유 식별자
 * @returns 해당 UUID의 뉴스 객체, 없으면 undefined
 *
 * @example
 * ```typescript
 * const news = getNewsById("trade-news-1");
 * if (news) {
 *   console.log(news.title);
 * }
 * ```
 */
export const getNewsById = (
  uuid: string,
): TradeNews | HSCodeNews | undefined => {
  const allNews = [...mockTradeNews, ...mockHSCodeNews];
  return allNews.find((news) => news.uuid === uuid);
};

/**
 * 특정 HS Code와 관련된 뉴스 목록 조회
 *
 * 주어진 HS Code와 연관된 모든 뉴스를 필터링하여 반환합니다.
 * 규제 변경, 관세율 조정 등 해당 품목과 관련된 최신 정보를 확인할 수 있습니다.
 *
 * @param hsCode - 조회할 HS Code (예: "8517.12")
 * @returns 해당 HS Code와 관련된 뉴스 배열
 *
 * @example
 * ```typescript
 * const smartphoneNews = getNewsByHSCode("8517.12");
 * smartphoneNews.forEach(news => {
 *   console.log(`${news.title} - ${news.importance}`);
 * });
 * ```
 */
export const getNewsByHSCode = (hsCode: string): HSCodeNews[] => {
  return mockHSCodeNews.filter((news) => news.hscode === hsCode);
};

/**
 * 북마크된 뉴스 목록 조회
 *
 * 사용자가 북마크한 HS Code 관련 뉴스만 필터링하여 반환합니다.
 * 중요한 규제 변경사항이나 지속적인 모니터링이 필요한 뉴스를 관리할 때 사용됩니다.
 *
 * @returns 북마크된 뉴스 배열
 *
 * @example
 * ```typescript
 * const bookmarked = getBookmarkedNews();
 * console.log(`북마크된 뉴스: ${bookmarked.length}개`);
 * ```
 */
export const getBookmarkedNews = (): HSCodeNews[] => {
  return mockHSCodeNews.filter((news) => news.bookmarked);
};

/**
 * 최신 뉴스 목록 조회
 *
 * 무역 뉴스와 HS Code 뉴스를 날짜순으로 정렬하여 지정된 개수만큼 반환합니다.
 * 대시보드나 메인 페이지에서 최신 동향을 보여줄 때 사용됩니다.
 *
 * @param limit - 반환할 뉴스 개수 (기본값: 5)
 * @returns 최신순으로 정렬된 뉴스 배열
 *
 * @example
 * ```typescript
 * const recentNews = getRecentNews(3);
 * recentNews.forEach(news => {
 *   console.log(`${news.date}: ${news.title}`);
 * });
 * ```
 */
export const getRecentNews = (
  limit: number = 5,
): (TradeNews | HSCodeNews)[] => {
  return [...mockTradeNews, ...mockHSCodeNews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};
