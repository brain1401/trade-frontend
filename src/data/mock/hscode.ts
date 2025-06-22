import type { AnalysisMessage } from "@/types/hscode";
import type { HSCodeAnalysisResult } from "@/types/search";
import type { HSCodeInfo } from "@/types/news";

/**
 * AnalysisMessage 타입을 재수출
 *
 * 호환성을 위해 types 모듈에서 가져온 AnalysisMessage 타입을 재수출합니다.
 */
export type { AnalysisMessage } from "@/types/hscode";

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
 * HS Code 분석 세션 Mock 데이터
 *
 * 스마트폰 HS Code 분석을 위한 샘플 대화 세션입니다.
 * 사용자 질문, AI 응답, 스마트 질문, 최종 분석 결과 등의 전체 흐름을 보여줍니다.
 *
 * @example
 * ```typescript
 * const session = mockHSCodeAnalysisSession;
 * const finalResult = session.messages.find(msg => msg.analysisResult);
 * console.log(`분석 결과: ${finalResult?.analysisResult?.hsCode}`);
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
        hsCode: "8517.12.10",
        description: "5G 지원 스마트폰",
        analysis: {
          summary:
            "제8517호에 해당하는 5G 지원 휴대용 전화기로 분류됩니다. 5G NR 통신 프로토콜을 지원하며, 듀얼 SIM 기능을 포함한 차세대 스마트폰입니다.",
          exportRequirements: [
            {
              country: "미국",
              requirements: ["FCC ID 인증", "KC 인증", "CE 마킹"],
              tariffRate: "기본세율 8%, 한-미 FTA 적용 시 무관세",
              notes: "5G 통신 기능으로 인한 추가 인증 필요",
            },
            {
              country: "유럽연합",
              requirements: ["CE 마킹", "RED 인증", "RoHS 적합성"],
              tariffRate: "기본세율 14%",
              notes: "EU 사이버보안법 준수 필요",
            },
          ],
          certifications: [
            {
              name: "KC 인증",
              description: "국내 전자파적합성 인증",
              required: true,
              issuer: "RRA(방송통신위원회)",
              validityPeriod: "3년",
            },
            {
              name: "안전인증(KC 안전)",
              description: "리튬배터리 안전기준 적합성 확인",
              required: true,
              issuer: "국가기술표준원",
              validityPeriod: "제품 수명",
            },
          ],
          relatedNews: [
            {
              title: "5G 스마트폰 전자파 안전기준 강화",
              url: "https://rra.go.kr/5g-smartphone-sar-standards",
              sourceName: "방송통신위원회",
              publishedAt: "2024-01-10T09:00:00Z",
              summary:
                "5G 스마트폰에 대한 전자파 흡수율(SAR) 기준이 강화되어 인증 절차에 변화가 있습니다.",
            },
            {
              title: "EU 사이버보안법, 스마트폰 제조사에 미치는 영향",
              url: "https://europa.eu/cybersecurity-act-smartphones",
              sourceName: "유럽연합",
              publishedAt: "2024-01-08T14:30:00Z",
              summary:
                "EU 사이버보안법이 스마트폰 제조사에게 새로운 보안 요구사항을 부과합니다.",
            },
          ],
          tradeStatistics: {
            yearlyExport: {
              "2023": "125억 달러",
              "2022": "118억 달러",
              "2021": "102억 달러",
            },
            yearlyImport: {
              "2023": "85억 달러",
              "2022": "78억 달러",
              "2021": "71억 달러",
            },
            topDestinations: ["미국", "중국", "일본", "베트남"],
            topOrigins: ["중국", "베트남", "인도"],
          },
        },
        sources: [
          {
            title: "관세청 품목분류 사전심사 결정례",
            url: "https://customs.go.kr/kcs/cm/cntnts/cntntsView.do?mi=2891&cntntsId=1234",
            type: "OFFICIAL",
            reliability: "HIGH",
            snippet:
              "제8517.12호에 분류되는 휴대전화는 주로 음성통화 목적으로 설계된 무선통신 단말기로서...",
          },
          {
            title: "WCO 품목분류 의견서 - 스마트폰 분류",
            url: "https://wco.org/en/topics/nomenclature/instruments-and-tools/hs-classification-references",
            type: "OFFICIAL",
            reliability: "HIGH",
            snippet:
              "Smartphones are classified under heading 8517 as they are primarily designed for voice communication...",
          },
        ],
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
 */
export const mockHSCodeResult: HSCodeAnalysisResult = {
  hsCode: "8517.12.10",
  description: "5G 지원 스마트폰",
  analysis: {
    summary:
      "제8517호에 해당하는 5G 지원 휴대용 전화기로 분류됩니다. 5G NR 통신 프로토콜을 지원하며, 듀얼 SIM 기능을 포함한 차세대 스마트폰입니다.",
    exportRequirements: [
      {
        country: "미국",
        requirements: ["FCC ID 인증", "KC 인증", "CE 마킹"],
        tariffRate: "기본세율 8%, 한-미 FTA 적용 시 무관세",
        notes: "5G 통신 기능으로 인한 추가 인증 필요",
      },
      {
        country: "유럽연합",
        requirements: ["CE 마킹", "RED 인증", "RoHS 적합성"],
        tariffRate: "기본세율 14%",
        notes: "EU 사이버보안법 준수 필요",
      },
      {
        country: "중국",
        requirements: [
          "CCC 인증",
          "네트워크 접속 허가",
          "무선전송 설비형식 승인",
        ],
        tariffRate: "기본세율 25%",
        notes: "중국 사이버보안법 및 데이터보안법 준수 필요",
      },
    ],
    certifications: [
      {
        name: "KC 인증",
        description: "국내 전자파적합성 인증",
        required: true,
        issuer: "RRA(방송통신위원회)",
        validityPeriod: "3년",
      },
      {
        name: "안전인증(KC 안전)",
        description: "리튬배터리 안전기준 적합성 확인",
        required: true,
        issuer: "국가기술표준원",
        validityPeriod: "제품 수명",
      },
      {
        name: "FCC ID",
        description: "미국 연방통신위원회 기기 승인",
        required: false,
        issuer: "FCC (Federal Communications Commission)",
        validityPeriod: "모델별 영구",
      },
    ],
    relatedNews: [
      {
        title: "5G 스마트폰 전자파 안전기준 강화",
        url: "https://rra.go.kr/5g-smartphone-sar-standards",
        sourceName: "방송통신위원회",
        publishedAt: "2024-01-10T09:00:00Z",
        summary:
          "5G 스마트폰에 대한 전자파 흡수율(SAR) 기준이 강화되어 인증 절차에 변화가 있습니다.",
      },
      {
        title: "EU 사이버보안법, 스마트폰 제조사에 미치는 영향",
        url: "https://europa.eu/cybersecurity-act-smartphones",
        sourceName: "유럽연합",
        publishedAt: "2024-01-08T14:30:00Z",
        summary:
          "EU 사이버보안법이 스마트폰 제조사에게 새로운 보안 요구사항을 부과합니다.",
      },
      {
        title: "중국 스마트폰 수입 규제 현황",
        url: "https://miit.gov.cn/smartphone-regulations-2024",
        sourceName: "중국 공업정보화부",
        publishedAt: "2024-01-05T11:20:00Z",
        summary:
          "중국 내 스마트폰 판매를 위한 새로운 인증 요구사항이 발표되었습니다.",
      },
    ],
    tradeStatistics: {
      yearlyExport: {
        "2023": "125억 달러",
        "2022": "118억 달러",
        "2021": "102억 달러",
      },
      yearlyImport: {
        "2023": "85억 달러",
        "2022": "78억 달러",
        "2021": "71억 달러",
      },
      topDestinations: ["미국", "중국", "일본", "베트남", "독일"],
      topOrigins: ["중국", "베트남", "인도", "한국"],
    },
  },
  sources: [
    {
      title: "관세청 품목분류 사전심사 결정례",
      url: "https://customs.go.kr/kcs/cm/cntnts/cntntsView.do?mi=2891&cntntsId=1234",
      type: "OFFICIAL",
      reliability: "HIGH",
      snippet:
        "제8517.12호에 분류되는 휴대전화는 주로 음성통화 목적으로 설계된 무선통신 단말기로서...",
    },
    {
      title: "WCO 품목분류 의견서 - 스마트폰 분류",
      url: "https://wco.org/en/topics/nomenclature/instruments-and-tools/hs-classification-references",
      type: "OFFICIAL",
      reliability: "HIGH",
      snippet:
        "Smartphones are classified under heading 8517 as they are primarily designed for voice communication...",
    },
    {
      title: "5G 기술 표준 및 무역 분류 가이드",
      url: "https://tta.or.kr/5g-trade-classification-guide",
      type: "REFERENCE",
      reliability: "MEDIUM",
      snippet:
        "5G 통신 기능을 포함한 스마트폰의 HS Code 분류 시 고려사항과 무역 실무 가이드...",
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
 *   console.log(`HS Code: ${result.hsCode}`);
 *   console.log(`분석 요약: ${result.analysis.summary}`);
 * }
 * ```
 */
export const getHSCodeResult = (
  resultId: string,
): HSCodeAnalysisResult | undefined => {
  return mockHSCodeResult.hsCode === resultId ? mockHSCodeResult : undefined;
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
