import type { HSCodeInfo } from "@/types/news";
import type { HSCodeAnalysisResult } from "@/types/search";

/**
 * v6.1 API 명세서 기준, SSE 북마크 메타데이터
 */
export type SSEBookmarkData = {
  available: boolean;
  hsCode: string;
  productName: string;
  confidence: number;
};

/**
 * v6.1 API 명세서 기준, 채팅 메시지 타입
 */
export type ChatMessage = {
  messageId: number;
  messageType: "USER" | "AI";
  content: string;
  createdAt: string;
  aiModel?: string;
  thinkingProcess?: string;
  hsCodeAnalysis?: {
    hsCode: string;
    productName: string;
    confidence: number;
    classificationBasis: string;
  };
  sseBookmarkData?: SSEBookmarkData;
};

/**
 * v6.1 API 명세서 기준, 채팅 세션 상세 정보 타입
 */
export type ChatSessionDetail = {
  session: {
    sessionId: string;
    sessionTitle: string;
    messageCount: number;
    createdAt: string;
    updatedAt: string;
    partitionYear: number;
  };
  messages: ChatMessage[];
  relatedData: {
    extractedHsCodes: string[];
    createdBookmarks: {
      bookmarkId: string;
      hsCode: string;
      displayName: string;
      createdAt: string;
    }[];
    sessionStats: {
      totalTokens: number;
      processingTimeMs: number;
      ragSearches: number;
      webSearches: number;
    };
  };
};

/**
 * HS Code 분석 세션 Mock 데이터 (v6.1)
 *
 * `GET /api/chat/history/{sessionId}` 응답에 해당
 */
export const mockChatSessionDetail: ChatSessionDetail = {
  session: {
    sessionId: "chat_session_20240116_123456",
    sessionTitle: "아이폰 15 프로 수입 HS Code 문의",
    messageCount: 4,
    createdAt: "2024-01-16T10:32:00Z",
    updatedAt: "2024-01-16T10:45:00Z",
    partitionYear: 2024,
  },
  messages: [
    {
      messageId: 1,
      messageType: "USER",
      content: "아이폰 15 프로를 수입할 때 HS Code와 관세율이 어떻게 되나요?",
      createdAt: "2024-01-16T10:32:00Z",
    },
    {
      messageId: 2,
      messageType: "AI",
      content:
        "아이폰 15 프로의 정확한 HS Code는 **8517.12.00**입니다.\n\n## 관세율 정보\n- 기본 관세율: 8%\n- FTA 적용 시: 0% (한-미 FTA)\n- 부가가치세: 10%",
      aiModel: "Claude-3.5-Sonnet",
      thinkingProcess:
        "사용자가 아이폰 15 프로의 HS Code를 문의했습니다. 스마트폰은 8517.12.00으로 분류됩니다.",
      hsCodeAnalysis: {
        hsCode: "8517.12.00",
        productName: "스마트폰 및 기타 무선전화기",
        confidence: 0.95,
        classificationBasis: "셀룰러 네트워크용 무선전화기",
      },
      sseBookmarkData: {
        available: true,
        hsCode: "8517.12.00",
        productName: "스마트폰 및 기타 무선전화기",
        confidence: 0.95,
      },
      createdAt: "2024-01-16T10:32:15Z",
    },
    {
      messageId: 3,
      messageType: "USER",
      content: "KC 인증은 어떻게 받나요?",
      createdAt: "2024-01-16T10:35:00Z",
    },
    {
      messageId: 4,
      messageType: "AI",
      content:
        "KC 인증은 전자파적합성 확인을 위한 필수 인증입니다.\n\n## KC 인증 절차\n1. 공인시험소에서 시험 실시\n2. 시험성적서 발급\n3. 국립전파연구원에 신고\n4. KC 마크 부착",
      aiModel: "Claude-3.5-Sonnet",
      createdAt: "2024-01-16T10:35:10Z",
    },
  ],
  relatedData: {
    extractedHsCodes: ["8517.12.00"],
    createdBookmarks: [
      {
        bookmarkId: "bm_001",
        hsCode: "8517.12.00",
        displayName: "스마트폰 HS Code",
        createdAt: "2024-01-16T10:33:00Z",
      },
    ],
    sessionStats: {
      totalTokens: 1250,
      processingTimeMs: 18000,
      ragSearches: 2,
      webSearches: 1,
    },
  },
};

/**
 * HS Code 정보 Mock 데이터
 *
 * 다양한 HS Code에 대한 규제 변경, 관세율 조정 등의 최신 정보를
 * 담고 있는 정보성 데이터입니다.
 *
 * @example
 * ```typescript
 * const sugarInfo = mockHSCodeInfoData.find(info => info.hsCode === "1701.11");
 * console.log(`설탕 관세율: ${sugarInfo?.summary}`);
 * ```
 */
export const mockHSCodeInfoData: HSCodeInfo[] = [
  {
    uuid: "hscode-info-1",
    hsCode: "1701.11",
    title: "설탕 수입 관세율 변경 안내",
    summary:
      "2025년 1월부터 설탕류(HS Code 1701.11) 수입 관세율이 기존 8%에서 6%로 인하됩니다.",
    content: "설탕류 수입 관세율 변경에 따른 상세 내용...",
    source: "관세청",
    category: "관세",
    tags: ["1701.11", "관세율", "설탕"],
    importance: "HIGH",
    date: "2025-01-15",
    type: "tariff",
    publishedAt: "2025-01-15T09:00:00Z",
    effectiveDate: "2025-01-01T00:00:00Z",
    relatedRegulations: ["관세법 시행령 제15조"],
    url: "https://customs.go.kr/notice/1701-11-tariff-change",
  },
  {
    uuid: "hscode-info-2",
    hsCode: "8471.30",
    title: "휴대용 컴퓨터 KC 인증 의무화",
    summary:
      "2025년 3월부터 휴대용 컴퓨터(HS Code 8471.30) 수입 시 KC 인증이 의무화됩니다.",
    content: "휴대용 컴퓨터 KC 인증 의무화 관련 상세 내용...",
    source: "국가기술표준원",
    category: "인증",
    tags: ["8471.30", "KC인증", "컴퓨터"],
    importance: "HIGH",
    date: "2025-01-14",
    type: "certification",
    publishedAt: "2025-01-14T14:30:00Z",
    effectiveDate: "2025-03-01T00:00:00Z",
    relatedRegulations: ["전기용품 및 생활용품 안전관리법"],
    url: "https://kats.go.kr/notice/8471-30-kc-certification",
  },
];

/**
 * HS Code별 관련 정보 조회
 *
 * 특정 HS Code와 관련된 모든 정보(규제 변경, 관세율 조정 등)를
 * 필터링하여 반환합니다.
 *
 * @param hsCode - 조회할 HS Code (예: "1701.11")
 * @returns 해당 HS Code 관련 정보 배열
 *
 * @example
 * ```typescript
 * const sugarInfos = getHSCodeInfoByCode("1701.11");
 * sugarInfos.forEach(info => {
 *   console.log(`${info.date}: ${info.title}`);
 * });
 * ```
 */
export const getHSCodeInfoByCode = (hsCode: string): HSCodeInfo[] => {
  return mockHSCodeInfoData.filter((info) => info.hsCode === hsCode);
};

/**
 * HS Code 분석 결과 Mock 데이터
 *
 * `SmartHSCodeAnalysis` 컴포넌트 등에서 사용되는 상세 분석 정보입니다.
 */
export const mockHSCodeResult: HSCodeAnalysisResult = {
  hsCode: "8517.12.0000",
  description: "스마트폰 및 기타 무선전화기",
  analysis: {
    summary:
      "스마트폰은 제8517호에 분류되며, 셀룰러 통신망 또는 기타 무선 통신망용 전화기에 해당합니다. 주요 수출국에 따라 다양한 인증 및 규제 요건이 적용됩니다.",
    exportRequirements: [
      {
        country: "미국 (USA)",
        requirements: ["FCC 인증", "통관 시 CBP Form 7501 제출"],
        tariffRate: "0%",
        notes: "한미 FTA에 따라 무관세 적용",
      },
      {
        country: "유럽 연합 (EU)",
        requirements: ["CE 마킹 (RED 지침)", "WEEE, RoHS 준수"],
        tariffRate: "0%",
        notes: "역내 단일 시장으로 관세 없음",
      },
      {
        country: "중국 (China)",
        requirements: ["CCC 인증", "SRRC (무선 규제) 인증"],
        tariffRate: "0%",
        notes: "APTA 협정세율 적용 가능",
      },
    ],
    certifications: [
      {
        name: "FCC (연방통신위원회)",
        description:
          "미국 내 전파를 사용하는 모든 기기에 대한 필수 인증입니다.",
        required: true,
        issuer: "미국 연방통신위원회",
      },
      {
        name: "CE (Conformité Européenne)",
        description:
          "유럽 경제 지역(EEA) 내에서 유통되는 제품의 안전, 건강, 환경 보호 요구사항을 충족함을 의미하는 마킹입니다.",
        required: true,
        issuer: "지정된 인증 기관 (Notified Body)",
      },
      {
        name: "KC (Korea Certification)",
        description: "대한민국 내 제품 안전을 보장하기 위한 국가통합인증마크.",
        required: true,
      },
    ],
    relatedNews: [],
    tradeStatistics: {
      yearlyExport: {
        "2022": "580억 달러",
        "2023": "620억 달러",
        "2024": "650억 달러",
      },
      topDestinations: ["미국", "베트남", "홍콩"],
    },
  },
  sources: [
    {
      type: "OFFICIAL",
      title: "관세법령정보포털",
      url: "https://unipass.customs.go.kr/",
    },
    {
      type: "OFFICIAL",
      title: "국가기술표준원",
      url: "https://www.kats.go.kr/",
    },
  ],
};
