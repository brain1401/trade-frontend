// HS Code 분석 관련 목업 데이터

export const mockHSCodeAnalysisSession = {
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

export type AnalysisMessage = {
  id: string;
  type: "user" | "assistant" | "smart_question";
  content: string;
  timestamp: string;
  options?: string[];
  analysisResult?: {
    hscode: string;
    confidence: number;
    category: string;
    description: string;
  };
};

export const mockHSCodeResult = {
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
        "제8517.12호에 분류되는 휴대전화는 주로 음성통화 목적으로 설계된 무선통신 단말기로서, 데이터통신 기능이 부가되어도 전화기로서의 본질적 특성이 유지되는 경우 동 호에 분류한다. 5G 통신방식을 지원하는 스마트폰의 경우 세분류 8517.12.10에 해당한다.",
      reliability: "high",
      citationDate: "2024-02-28",
      documentType: "사전심사결정례",
    },
    {
      title: "WCO 품목분류 의견서 - 스마트폰 분류",
      url: "https://wco.org/en/topics/nomenclature/instruments-and-tools/hs-classification-references",
      snippet:
        "Smartphones are classified under heading 8517 as they are primarily designed for voice communication over cellular networks. The data processing capabilities, while significant, are considered secondary to the primary telephone function. The classification follows the General Interpretative Rule 1 and 3(b).",
      reliability: "high",
      citationDate: "2023-11-15",
      documentType: "WCO 분류의견",
    },
    {
      title: "한국표준산업분류 해설서",
      url: "https://kssc.kostat.go.kr/ksscNew_web/ekssc/main/main.do",
      snippet:
        "전화기는 음성신호를 전기신호로 변환하여 원거리로 전송하고, 수신된 전기신호를 음성신호로 복원하는 장치를 말한다. 이동통신용 전화기(휴대전화)는 기지국과 무선으로 통신하여 이동 중에도 통화가 가능한 전화기이다.",
      reliability: "high",
      citationDate: "2024-01-10",
      documentType: "통계청 분류기준",
    },
    {
      title: "관세법 시행령 별표2 (관세율표)",
      url: "https://law.go.kr/lsInfoP.do?lsiSeq=240284",
      snippet:
        "제8517호: 전화기(셀룰러망용이나 그 밖의 무선망용을 포함한다)... 8517.12 셀룰러망용이나 그 밖의 무선망용 전화기 - 8517.12.1000 휴대용 전화기",
      reliability: "high",
      citationDate: "2024-01-01",
      documentType: "법령",
    },
  ],
};

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
