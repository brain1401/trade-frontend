import type { AnalysisMessage, HSCodeInfo } from "@/types";

/**
 * AnalysisMessage 타입을 재수출
 *
 * 호환성을 위해 types 모듈에서 가져온 AnalysisMessage 타입을 재수출합니다.
 */
export type { AnalysisMessage } from "@/types";

/**
 * HS Code 분석 세션의 데이터 구조
 *
 * 사용자와 AI 어시스턴트 간의 HS Code 분석 대화 세션을 관리하기 위한 타입입니다.
 * 각 세션은 고유한 ID를 가지며, 대화 메시지들과 현재 상태를 추적합니다.
 */
export type HSCodeAnalysisSession = {
  /** 세션의 고유 식별자 */
  sessionId: string;
  /** 세션 생성 시간 (ISO 문자열) */
  createdAt: string;
  /** 세션 상태 (completed, in_progress, error 등) */
  status: string;
  /** 세션 내 모든 대화 메시지들 */
  messages: AnalysisMessage[];
};

/**
 * HS Code 분석 결과의 상세 데이터 구조
 *
 * AI 분석을 통해 도출된 HS Code 분류 결과와 관련된 모든 정보를 포함합니다.
 * 기본 정보, 분류 근거, 요구사항, 규제사항, 무역통계, 참고자료 등이 포함됩니다.
 */
export type HSCodeResult = {
  /** 결과의 고유 식별자 */
  resultId: string;
  /** 분류된 HS Code */
  hscode: string;
  /** HS Code 상세 설명 */
  description: string;
  /** 분류 신뢰도 (0-100) */
  confidence: number;
  /** 품목 카테고리 */
  category: string;
  /** HS Code 기본 정보 */
  basicInfo: {
    /** 장(章) 번호 */
    chapter: string;
    /** 호(號) 번호 */
    heading: string;
    /** 소호(小號) 번호 */
    subheading: string;
    /** 완전한 관세 코드 */
    tariffCode: string;
    /** 한글 품명 */
    koranName: string;
    /** 영문 품명 */
    englishName: string;
  };
  /** 분류 근거 및 논리 */
  classificationBasis: {
    /** 주요 분류 근거 */
    primaryReason: string;
    /** 분류에 영향을 준 핵심 요소들 */
    keyFactors: Array<{
      /** 요소명 */
      factor: string;
      /** 요소 설명 */
      description: string;
      /** 가중치 (높음/보통/낮음) */
      weight: string;
    }>;
    /** 제외된 카테고리들과 이유 */
    excludedCategories: Array<{
      /** 제외된 카테고리 */
      category: string;
      /** 제외 이유 */
      reason: string;
    }>;
  };
  /** 규제 및 인증 요구사항 */
  requirements: Array<{
    /** 요구사항 타입 (인증, 규제 등) */
    type: string;
    /** 요구사항 제목 */
    title: string;
    /** 상세 설명 */
    description: string;
    /** 필수 여부 */
    mandatory: boolean;
    /** 관련 기관 */
    agency: string;
  }>;
  /** 관련 규제 정보 */
  regulations: Array<{
    /** 규제 제목 */
    title: string;
    /** 규제 요약 */
    summary: string;
    /** 발효 날짜 */
    date: string;
    /** 정보 출처 */
    source: string;
    /** 영향도 (high/medium/low) */
    impact: string;
  }>;
  /** 무역 통계 정보 */
  tradeStatistics: {
    /** 연간 수출량 */
    exportVolume: number;
    /** 연간 수입량 */
    importVolume: number;
    /** 평균 단가 */
    averagePrice: number;
    /** 주요 거래 상대국 */
    majorPartners: string[];
  };
  /** 참고 자료 및 출처 */
  sources: Array<{
    /** 자료 제목 */
    title: string;
    /** 자료 URL */
    url: string;
    /** 관련 내용 발췌 */
    snippet: string;
    /** 신뢰도 (high/medium/low) */
    reliability: string;
    /** 인용 날짜 */
    citationDate: string;
    /** 문서 타입 */
    documentType: string;
  }>;
};

/**
 * HS Code 분석 세션 Mock 데이터
 *
 * 스마트폰 HS Code 분석을 위한 샘플 대화 세션입니다.
 * 사용자 질문, AI 응답, 스마트 질문, 최종 분석 결과 등의 전체 흐름을 보여줍니다.
 *
 * @example
 * ```typescript
 * const session = mockHSCodeAnalysisSession;
 * const finalResult = session.messages.find(msg => msg.analysisResult);
 * console.log(`분석 결과: ${finalResult?.analysisResult?.hscode}`);
 * ```
 */
export const mockHSCodeAnalysisSession: HSCodeAnalysisSession = {
  sessionId: "session-123",
  createdAt: "2024-01-15T10:30:00Z",
  status: "completed",
  messages: [
    {
      id: "msg-1",
      type: "user",
      content: "스마트폰을 수출하려고 하는데 HS Code가 뭔가요?",
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      id: "msg-2",
      type: "assistant",
      content:
        "스마트폰의 HS Code는 8517.12입니다. 좀 더 정확한 분류를 위해 몇 가지 질문을 드릴게요.",
      timestamp: "2024-01-15T10:30:05Z",
    },
    {
      id: "msg-3",
      type: "smart_question",
      content: "스마트폰의 주요 특징을 선택해주세요:",
      options: ["5G 지원", "듀얼 SIM", "방수 기능", "무선 충전"],
      timestamp: "2024-01-15T10:30:10Z",
    },
    {
      id: "msg-4",
      type: "user",
      content: "5G 지원과 듀얼 SIM 기능이 있습니다.",
      timestamp: "2024-01-15T10:30:20Z",
    },
    {
      id: "msg-5",
      type: "assistant",
      content: "분석이 완료되었습니다. HS Code 8517.12.10으로 분류됩니다.",
      timestamp: "2024-01-15T10:30:25Z",
      analysisResult: {
        hscode: "8517.12.10",
        confidence: 95,
        category: "전화기(휴대폰)",
        description: "5G 지원 스마트폰",
      },
    },
  ],
};

/**
 * HS Code 분석 결과 Mock 데이터
 *
 * 5G 지원 스마트폰(HS Code 8517.12.10)에 대한 상세 분석 결과입니다.
 * 분류 근거, 인증 요구사항, 관련 규제, 무역 통계 등 실제 활용 가능한
 * 모든 정보를 포함하고 있습니다.
 *
 * @example
 * ```typescript
 * const result = mockHSCodeResult;
 * console.log(`신뢰도: ${result.confidence}%`);
 * console.log(`필수 인증: ${result.requirements.filter(req => req.mandatory).length}개`);
 * ```
 */
export const mockHSCodeResult: HSCodeResult = {
  resultId: "result-8517.12.10",
  hscode: "8517.12.10",
  description: "5G 지원 스마트폰",
  confidence: 95,
  category: "전화기(휴대폰)",
  basicInfo: {
    chapter: "85",
    heading: "8517",
    subheading: "8517.12",
    tariffCode: "8517.12.10",
    koranName: "5G 지원 휴대폰",
    englishName: "5G Smartphone",
  },
  classificationBasis: {
    primaryReason:
      "제8517호에 해당하는 전화기의 특성을 가지며, 5G 이동통신 방식을 지원하는 휴대용 전화기",
    keyFactors: [
      {
        factor: "기능적 특성",
        description:
          "음성통화 및 데이터통신이 주요 기능으로, 전화기로서의 본질적 특성 보유",
        weight: "높음",
      },
      {
        factor: "기술적 규격",
        description:
          "5G NR(New Radio) 통신 프로토콜 지원으로 차세대 이동통신 서비스 이용 가능",
        weight: "높음",
      },
      {
        factor: "물리적 형태",
        description:
          "휴대 가능한 크기와 무게(일반적으로 200g 이하)를 가진 단말기 형태",
        weight: "보통",
      },
      {
        factor: "관세청 해석례",
        description: "관세청 품목분류 사전심사 사례 및 WCO 분류의견 참조",
        weight: "높음",
      },
    ],
    excludedCategories: [
      {
        category: "8471호 (컴퓨터)",
        reason: "주기능이 전화통신이 아닌 데이터처리인 경우에만 해당",
      },
      {
        category: "8528호 (모니터)",
        reason: "디스플레이 기능이 주된 용도가 아님",
      },
    ],
  },
  requirements: [
    {
      type: "인증",
      title: "KC 인증",
      description: "전자파적합성 인증 필요",
      mandatory: true,
      agency: "RRA(방송통신위원회)",
    },
    {
      type: "규제",
      title: "개인정보보호법",
      description: "개인정보 처리 관련 규제 준수",
      mandatory: true,
      agency: "개인정보보호위원회",
    },
    {
      type: "인증",
      title: "안전인증(KC 안전)",
      description: "리튬배터리 안전기준 적합성 확인",
      mandatory: true,
      agency: "국가기술표준원",
    },
  ],
  regulations: [
    {
      title: "휴대폰 수입 시 KC인증 의무화",
      summary: "2024년부터 모든 휴대폰 수입 시 KC인증 필수",
      date: "2024-01-01",
      source: "방송통신위원회",
      impact: "high",
    },
    {
      title: "5G 주파수 이용 기준 강화",
      summary: "5G 단말기에 대한 전자파 흡수율(SAR) 기준 강화",
      date: "2024-03-15",
      source: "과학기술정보통신부",
      impact: "medium",
    },
  ],
  tradeStatistics: {
    exportVolume: 1250000,
    importVolume: 850000,
    averagePrice: 650,
    majorPartners: ["중국", "베트남", "미국"],
  },
  sources: [
    {
      title: "관세청 품목분류 사전심사 결정례",
      url: "https://customs.go.kr/kcs/cm/cntnts/cntntsView.do?mi=2891&cntntsId=1234",
      snippet:
        "제8517.12호에 분류되는 휴대전화는 주로 음성통화 목적으로 설계된 무선통신 단말기로서...",
      reliability: "high",
      citationDate: "2024-02-28",
      documentType: "사전심사결정례",
    },
    {
      title: "WCO 품목분류 의견서 - 스마트폰 분류",
      url: "https://wco.org/en/topics/nomenclature/instruments-and-tools/hs-classification-references",
      snippet:
        "Smartphones are classified under heading 8517 as they are primarily designed for voice communication...",
      reliability: "high",
      citationDate: "2023-11-15",
      documentType: "WCO 분류의견",
    },
  ],
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
    importance: "high",
    date: "2025-01-15",
    type: "tariff",
    published_at: "2025-01-15T09:00:00Z",
    effectiveDate: "2025-01-01",
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
    importance: "high",
    date: "2025-01-14",
    type: "certification",
    published_at: "2025-01-14T14:30:00Z",
    effectiveDate: "2025-03-01",
    relatedRegulations: ["전기용품 및 생활용품 안전관리법"],
    url: "https://kats.go.kr/notice/8471-30-kc-certification",
  },
];

/**
 * 스마트 질문 Mock 데이터
 *
 * HS Code 분석 과정에서 사용자에게 제시할 수 있는
 * 구조화된 질문들의 목록입니다.
 */
export const mockSmartQuestions = [
  {
    id: "q1",
    question: "제품의 주요 기능을 선택해주세요:",
    options: ["음성통화", "데이터통신", "카메라", "GPS"],
    category: "기능",
  },
  {
    id: "q2",
    question: "제품의 화면 크기는?",
    options: ["5인치 미만", "5-6인치", "6인치 이상"],
    category: "규격",
  },
];

/**
 * 세션 ID로 HS Code 분석 세션 조회
 *
 * 특정 세션 ID에 해당하는 분석 세션 정보를 반환합니다.
 * 세션 복원이나 이어서 분석할 때 사용됩니다.
 *
 * @param sessionId - 조회할 세션의 고유 식별자
 * @returns 해당 세션 정보, 없으면 undefined
 *
 * @example
 * ```typescript
 * const session = getHSCodeAnalysisSession("session-123");
 * if (session) {
 *   console.log(`세션 상태: ${session.status}`);
 *   console.log(`메시지 수: ${session.messages.length}`);
 * }
 * ```
 */
export const getHSCodeAnalysisSession = (
  sessionId: string,
): HSCodeAnalysisSession | undefined => {
  return mockHSCodeAnalysisSession.sessionId === sessionId
    ? mockHSCodeAnalysisSession
    : undefined;
};

/**
 * 결과 ID로 HS Code 분석 결과 조회
 *
 * 특정 결과 ID에 해당하는 분석 결과 정보를 반환합니다.
 * 분석 완료 후 상세 결과를 확인할 때 사용됩니다.
 *
 * @param resultId - 조회할 결과의 고유 식별자
 * @returns 해당 분석 결과, 없으면 undefined
 *
 * @example
 * ```typescript
 * const result = getHSCodeResult("result-8517.12.10");
 * if (result) {
 *   console.log(`HS Code: ${result.hscode}`);
 *   console.log(`신뢰도: ${result.confidence}%`);
 * }
 * ```
 */
export const getHSCodeResult = (resultId: string): HSCodeResult | undefined => {
  return mockHSCodeResult.resultId === resultId ? mockHSCodeResult : undefined;
};

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
