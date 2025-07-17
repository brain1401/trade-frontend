import type { LucideIcon } from "lucide-react";

/**
 * 대시보드 관련 타입 정의
 * 새로운 대시보드 컴포넌트들을 위한 공통 타입들
 */

// 기본 공통 타입들
export type TrendDirection = "up" | "down" | "neutral";

export type LoadingState = {
  metrics: boolean;
  activities: boolean;
  categories: boolean;
  notifications: boolean;
  stats: boolean;
};

export type ErrorState = {
  type: "network" | "server" | "permission" | "unknown";
  message: string;
  retryable: boolean;
  section?: string;
};

// 활동 피드 관련 타입들
export type ActivityType =
  | "chat"
  | "bookmark"
  | "notification"
  | "feed"
  | "system";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  href?: string;
  user?: {
    name: string;
    avatar?: string;
  };
};

export type RecentActivityFeedProps = {
  activities: ActivityItem[];
  loading?: boolean;
  error?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
};

// 카테고리 요약 관련 타입들
export type CategoryData = {
  id: string;
  name: string;
  count: number;
  recentCount: number;
  href: string;
  color?: string;
  icon?: LucideIcon;
  description?: string;
};

export type CategorySummaryProps = {
  categories: CategoryData[];
  title: string;
  loading?: boolean;
  error?: boolean;
  className?: string;
};

// 빠른 통계 관련 타입들
export type StatItem = {
  id: string;
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: TrendDirection;
  };
  href?: string;
  description?: string;
};

export type QuickStatsProps = {
  stats: StatItem[];
  loading?: boolean;
  error?: boolean;
  onStatClick?: (stat: StatItem) => void;
  className?: string;
};

// 관리 액션 관련 타입들
export type ManagementAction = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
  badge?: {
    text: string;
    variant: "default" | "destructive" | "secondary";
    count?: number;
  };
  disabled?: boolean;
};

export type ManagementActionsProps = {
  actions: ManagementAction[];
  className?: string;
};

// 알림 관련 타입들
export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: Date;
  read: boolean;
  href?: string;
  metadata?: Record<string, any>;
};

export type NotificationGroup = {
  type: "important" | "general";
  count: number;
  unreadCount: number;
  items: NotificationItem[];
};

export type NotificationSummaryProps = {
  groups: NotificationGroup[];
  onMarkAllRead: () => void;
  onViewAll: () => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  className?: string;
};

// 대시보드 헤더 관련 타입들
export type QuickAction = {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "primary" | "secondary" | "outline";
  disabled?: boolean;
  badge?: number;
  description?: string;
};

export type DashboardHeaderProps = {
  user: {
    name: string;
    email?: string;
    avatar?: string;
  } | null;
  quickActions?: QuickAction[];
  notifications?: {
    count: number;
    items: NotificationItem[];
  };
  className?: string;
};

// 메인 대시보드 데이터 타입들
export type DashboardMetrics = {
  totalBookmarks: number;
  activeMonitoring: number;
  unreadFeeds: number;
  totalSessions: number;
  totalMessages: number;
  recentSessions30d: number;
  [key: string]: number; // 확장 가능한 메트릭들
};

export type DashboardData = {
  user: {
    name: string;
    email?: string;
    avatar?: string;
  };
  metrics: DashboardMetrics;
  recentActivities: ActivityItem[];
  categories: CategoryData[];
  quickStats: StatItem[];
  notifications: {
    important: NotificationItem[];
    general: NotificationItem[];
    unreadCount: number;
  };
  managementActions: ManagementAction[];
};

// API 응답 타입들
export type DashboardResponse = {
  data: DashboardData;
  meta: {
    lastUpdated: string;
    cacheExpiry: number;
    version?: string;
  };
};

// 오프라인 상태 관련 타입들
export type OfflineState = {
  isOffline: boolean;
  lastSync: Date;
  cachedData: Partial<DashboardData>;
};

// 대시보드 설정 관련 타입들
export type DashboardSettings = {
  refreshInterval: number; // 초 단위
  autoRefresh: boolean;
  compactMode: boolean;
  showTrends: boolean;
  defaultView: "overview" | "detailed";
  notifications: {
    desktop: boolean;
    email: boolean;
    important: boolean;
  };
};

// 필터 및 정렬 관련 타입들
export type ActivityFilter = {
  types: ActivityType[];
  dateRange: {
    start: Date;
    end: Date;
  };
  users?: string[];
};

export type SortOption = {
  field: string;
  direction: "asc" | "desc";
};

// 차트 및 시각화 관련 타입들
export type ChartDataPoint = {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
};

export type ChartConfig = {
  type: "bar" | "line" | "pie" | "donut";
  data: ChartDataPoint[];
  options?: {
    showLegend?: boolean;
    showTooltip?: boolean;
    height?: number;
    colors?: string[];
  };
};

// 대시보드 레이아웃 관련 타입들
export type DashboardLayout = {
  header: boolean;
  sidebar: boolean;
  footer: boolean;
  columns: 1 | 2 | 3;
  spacing: "compact" | "normal" | "relaxed";
};

// 성능 모니터링 관련 타입들
export type PerformanceMetrics = {
  loadTime: number;
  renderTime: number;
  apiCalls: number;
  cacheHits: number;
  errors: number;
};
