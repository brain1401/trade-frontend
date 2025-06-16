import type { HSCodeInfo } from "@/types";

// 목업 데이터 - 실제로는 API에서 가져올 예정
export const mockHSCodeInfoData: HSCodeInfo[] = [
  {
    uuid: "hscode-info-1",
    hsCode: "1701.11",
    title: "설탕 수입 관세율 변경 안내",
    summary:
      "2025년 1월부터 설탕류(HS Code 1701.11) 수입 관세율이 기존 8%에서 6%로 인하됩니다.",
    category: "관세",
    type: "tariff",
    source: "관세청",
    published_at: "2025-01-15T09:00:00Z",
    content: "설탕류 수입 관세율 변경에 따른 상세 내용...",
    tags: ["HS1701.11", "관세율", "설탕"],
    importance: "high" as const,
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
    category: "인증",
    type: "certification",
    source: "국가기술표준원",
    published_at: "2025-01-14T14:30:00Z",
    content: "휴대용 컴퓨터 KC 인증 의무화 관련 상세 내용...",
    tags: ["HS8471.30", "KC인증", "컴퓨터"],
    importance: "high" as const,
    effectiveDate: "2025-03-01",
    relatedRegulations: ["전기용품 및 생활용품 안전관리법"],
    url: "https://kats.go.kr/notice/8471-30-kc-certification",
  },
  {
    uuid: "hscode-info-3",
    hsCode: "2203.00",
    title: "맥주 수입 검역 절차 간소화",
    summary:
      "맥주류(HS Code 2203.00) 수입 시 검역 절차가 간소화되어 통관 시간이 단축됩니다.",
    category: "규제",
    type: "regulation",
    source: "농림축산검역본부",
    published_at: "2025-01-13T11:15:00Z",
    content: "맥주 수입 검역 절차 간소화 관련 상세 내용...",
    tags: ["HS2203.00", "검역", "맥주"],
    importance: "medium" as const,
    effectiveDate: "2025-02-01",
    relatedRegulations: ["식품위생법", "수입식품 안전관리 특별법"],
    url: "https://qia.go.kr/notice/2203-00-inspection-simplification",
  },
];
