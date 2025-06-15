import { useQuery } from "@tanstack/react-query";

type AnalysisResult = {
  id: string;
  hsCode: string;
  description: string;
  confidence: number;
  reasoning: string;
  requirements: {
    import: string[];
    export: string[];
  };
  relatedRegulations: Array<{
    id: string;
    title: string;
    summary: string;
    url?: string;
  }>;
  tradeStatistics?: {
    volume: number;
    value: number;
    trend: "up" | "down" | "stable";
  };
  createdAt: string;
};

// Mock API 함수
const getAnalysisResultApi = async (
  resultId: string,
): Promise<AnalysisResult> => {
  // 실제로는 백엔드 API 호출
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock 데이터
  return {
    id: resultId,
    hsCode: "8517.12.00",
    description: "스마트폰 및 무선 통신 기기",
    confidence: 92,
    reasoning: `제품의 특성을 분석한 결과:

1. 무선 통신 기능을 가진 전화기
2. 디지털 데이터 처리 능력 보유
3. 터치스크린 인터페이스 포함
4. 앱 설치 및 실행 가능

이러한 특성들을 종합적으로 고려할 때, HS Code 8517.12.00 (휴대용 무선전화기)에 해당됩니다.`,
    requirements: {
      import: [
        "전파인증(KC 마크) 필수",
        "리튬배터리 안전성 인증서 제출",
        "전자파적합성(EMC) 시험성적서",
        "화학물질 함유량 신고서 (RoHS)",
      ],
      export: [
        "수출신고서 제출",
        "원산지 증명서",
        "품질검사성적서",
        "포장 및 라벨링 규정 준수",
      ],
    },
    relatedRegulations: [
      {
        id: "reg1",
        title: "전파법 시행령",
        summary: "무선통신기기의 형식승인 및 적합성평가에 관한 규정",
        url: "https://law.go.kr/lsInfoP.do?lsiSeq=123456",
      },
      {
        id: "reg2",
        title: "전기용품 및 생활용품 안전관리법",
        summary: "전자제품의 안전성 확보를 위한 법령",
        url: "https://law.go.kr/lsInfoP.do?lsiSeq=234567",
      },
      {
        id: "reg3",
        title: "RoHS 지침 준수 규정",
        summary: "유해물질 제한에 관한 국제 규정",
        url: "https://eur-lex.europa.eu/rohs",
      },
    ],
    tradeStatistics: {
      volume: 125000,
      value: 89500000,
      trend: "up" as const,
    },
    createdAt: new Date().toISOString(),
  };
};

export const useAnalysisResult = (resultId: string) => {
  return useQuery({
    queryKey: ["analysis", "result", resultId],
    queryFn: () => getAnalysisResultApi(resultId),
    enabled: !!resultId,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 메모리에 보관
  });
};
