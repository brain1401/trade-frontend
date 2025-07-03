import type { Pagination } from "@/types/common";

export type BookmarkData = Pagination & {
  content: Bookmark[];
};

export type BookmarkListRequest = {
  page?: number;
  size?: number;
  sort?: string;
  // 여기에 필요한 다른 필터 조건을 추가할 수 있습니다.
  // 예: keyword?: string;
};

export type Bookmark = {
  id: number;
  type: string;
  targetValue: string;
  displayName: string;
  sseGenerated: boolean;
  sseEventData: SSEEventData | null;
  smsNotificationEnabled: boolean;
  emailNotificationEnabled: boolean;
  monitoringActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SSEEventData = {
  sessionId: string;
  confidence: number;
  claudeAnalysis: string;
};
