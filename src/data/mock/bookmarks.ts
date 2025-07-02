import type { Bookmark } from "@/lib/api/bookmark/types";

/**
 * 북마크 Mock 데이터
 */
export const mockBookmarks: Bookmark[] = [
  {
    bookmarkId: "bm_001",
    type: "HS_CODE",
    targetValue: "8517.12.00",
    displayName: "스마트폰 HS Code",
    description: "iPhone 및 Galaxy 등 최신 스마트폰 모델 포함",
    monitoringEnabled: true,
    smsNotificationEnabled: true,
    alertCount: 3,
    lastAlert: "2024-07-18T10:00:00Z",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-07-18T10:00:00Z",
  },
  {
    bookmarkId: "bm_002",
    type: "CARGO",
    targetValue: "KRPU1234567890",
    displayName: "1월 수입 화물 (반도체 장비)",
    description: "ASML 장비 수입 건",
    monitoringEnabled: true,
    smsNotificationEnabled: false,
    alertCount: 5,
    lastAlert: "2024-07-19T14:30:00Z",
    createdAt: "2024-01-15T14:20:00Z",
    updatedAt: "2024-07-19T14:30:00Z",
  },
  {
    bookmarkId: "bm_003",
    type: "HS_CODE",
    targetValue: "3304.99.1000",
    displayName: "기초화장품 (선크림)",
    description: "EU 수출용 선크림 제품군",
    monitoringEnabled: false,
    smsNotificationEnabled: false,
    alertCount: 0,
    lastAlert: null,
    createdAt: "2024-02-20T11:00:00Z",
    updatedAt: "2024-06-25T11:00:00Z",
  },
  {
    bookmarkId: "bm_004",
    type: "HS_CODE",
    targetValue: "9021.10.9000",
    displayName: "정형외과용 기기",
    description: "미국 FDA 승인 필요한 의료기기",
    monitoringEnabled: true,
    smsNotificationEnabled: true,
    alertCount: 1,
    lastAlert: "2024-06-30T18:00:00Z",
    createdAt: "2024-03-05T16:00:00Z",
    updatedAt: "2024-06-30T18:00:00Z",
  },
];

/**
 * 활성 모니터링 북마크 조회 함수
 */
export const getActiveBookmarks = (): Bookmark[] => {
  return mockBookmarks.filter((bookmark) => bookmark.monitoringEnabled);
};
