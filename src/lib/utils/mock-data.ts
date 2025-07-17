import {
  Package,
  Globe,
  FileText,
  Building,
  Truck,
  Shield,
  BarChart3,
  Users,
  MessageSquare,
  Bell,
  TrendingUp,
  Activity,
  Settings,
  User,
  Bookmark,
  Rss,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type {
  CategoryData,
  StatItem,
  ActivityItem,
  ManagementAction,
  NotificationItem,
  NotificationGroup,
} from "@/types/dashboard";

/**
 * 북마크 카테고리별 목 데이터 생성 유틸리티
 * 실제 북마크 타입을 기반으로 한 카테고리 분류
 */

/**
 * 북마크 타입별 카테고리 매핑
 */
export const BOOKMARK_CATEGORY_MAP: Record<
  string,
  {
    name: string;
    description: string;
    icon: LucideIcon;
    color: string;
  }
> = {
  HS_CODE: {
    name: "HS 코드",
    description: "관세 분류 코드 북마크",
    icon: Package,
    color: "#3b82f6", // blue-500
  },
  COUNTRY: {
    name: "국가별 규제",
    description: "국가별 무역 규제 정보",
    icon: Globe,
    color: "#10b981", // emerald-500
  },
  REGULATION: {
    name: "규제 정보",
    description: "무역 관련 규제 및 정책",
    icon: Shield,
    color: "#f59e0b", // amber-500
  },
  COMPANY: {
    name: "기업 정보",
    description: "무역 관련 기업 정보",
    icon: Building,
    color: "#8b5cf6", // violet-500
  },
  LOGISTICS: {
    name: "물류 정보",
    description: "운송 및 물류 관련 정보",
    icon: Truck,
    color: "#06b6d4", // cyan-500
  },
  DOCUMENT: {
    name: "문서 및 양식",
    description: "무역 관련 문서 및 양식",
    icon: FileText,
    color: "#ef4444", // red-500
  },
};

/**
 * 카테고리별 목 데이터 생성
 * @param bookmarkCounts 실제 북마크 수 (선택사항)
 * @returns CategoryData 배열
 */
export function generateMockCategoryData(
  bookmarkCounts?: Record<string, number>,
): CategoryData[] {
  const categories: CategoryData[] = [];

  Object.entries(BOOKMARK_CATEGORY_MAP).forEach(([type, config]) => {
    const totalCount =
      bookmarkCounts?.[type] || Math.floor(Math.random() * 20) + 1;
    const recentCount = Math.floor(Math.random() * Math.min(totalCount, 5));

    categories.push({
      id: type,
      name: config.name,
      description: config.description,
      count: totalCount,
      recentCount,
      href: `/dashboard/bookmarks?type=${type}`,
      color: config.color,
      icon: config.icon,
    });
  });

  // 카테고리를 북마크 수 기준으로 내림차순 정렬
  return categories.sort((a, b) => b.count - a.count);
}

/**
 * 실제 북마크 데이터를 기반으로 카테고리 데이터 생성
 * @param bookmarks 북마크 배열
 * @returns CategoryData 배열
 */
export function generateCategoryDataFromBookmarks(
  bookmarks: Array<{ type: string; createdAt: string }>,
): CategoryData[] {
  // 타입별 북마크 수 계산
  const typeCounts: Record<string, number> = {};
  const recentCounts: Record<string, number> = {};

  // 7일 전 날짜 계산
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  bookmarks.forEach((bookmark) => {
    const type = bookmark.type;
    typeCounts[type] = (typeCounts[type] || 0) + 1;

    // 최근 7일 내 생성된 북마크인지 확인
    const createdDate = new Date(bookmark.createdAt);
    if (createdDate >= sevenDaysAgo) {
      recentCounts[type] = (recentCounts[type] || 0) + 1;
    }
  });

  // 카테고리 데이터 생성
  const categories: CategoryData[] = [];

  Object.entries(typeCounts).forEach(([type, count]) => {
    const config = BOOKMARK_CATEGORY_MAP[type];
    if (config) {
      categories.push({
        id: type,
        name: config.name,
        description: config.description,
        count,
        recentCount: recentCounts[type] || 0,
        href: `/dashboard/bookmarks?type=${type}`,
        color: config.color,
        icon: config.icon,
      });
    }
  });

  // 북마크 수 기준으로 내림차순 정렬
  return categories.sort((a, b) => b.count - a.count);
}

/**
 * 빈 카테고리 데이터 (북마크가 없을 때)
 */
export const EMPTY_CATEGORY_DATA: CategoryData[] = [];

/**
 * 카테고리 데이터 로딩 시뮬레이션
 * @param delay 지연 시간 (ms)
 * @returns Promise<CategoryData[]>
 */
export async function fetchMockCategoryData(
  delay = 1000,
): Promise<CategoryData[]> {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return generateMockCategoryData();
}

/**
 * 에러 시뮬레이션을 위한 함수
 * @param shouldError 에러 발생 여부
 * @param delay 지연 시간 (ms)
 * @returns Promise<CategoryData[]>
 */
export async function fetchCategoryDataWithError(
  shouldError = false,
  delay = 1000,
): Promise<CategoryData[]> {
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (shouldError) {
    throw new Error("카테고리 데이터를 불러오는 중 오류가 발생했습니다.");
  }

  return generateMockCategoryData();
}
/**
 * QuickStats 관련 목 데이터 생성 유틸리티
 */

/**
 * 빠른 통계 목 데이터 생성
 * @param metrics 실제 메트릭 데이터 (선택사항)
 * @returns StatItem 배열
 */
export function generateMockQuickStats(metrics?: {
  totalBookmarks?: number;
  activeMonitoring?: number;
  unreadFeeds?: number;
  totalSessions?: number;
  totalMessages?: number;
  recentSessions30d?: number;
}): StatItem[] {
  const stats: StatItem[] = [
    {
      id: "total-bookmarks",
      label: "전체 북마크",
      value: metrics?.totalBookmarks || Math.floor(Math.random() * 500) + 100,
      icon: Package,
      description: "저장된 북마크 수",
      href: "/dashboard/bookmarks",
      trend: {
        value: `+${Math.floor(Math.random() * 20) + 1}%`,
        direction: "up",
      },
    },
    {
      id: "active-monitoring",
      label: "활성 모니터링",
      value: metrics?.activeMonitoring || Math.floor(Math.random() * 50) + 10,
      icon: Activity,
      description: "모니터링 중인 항목",
      href: "/dashboard/monitoring",
      trend: {
        value: `${Math.random() > 0.5 ? "+" : "-"}${Math.floor(Math.random() * 10) + 1}%`,
        direction: Math.random() > 0.5 ? ("up" as const) : ("down" as const),
      },
    },
    {
      id: "unread-feeds",
      label: "읽지 않은 피드",
      value: metrics?.unreadFeeds || Math.floor(Math.random() * 100) + 5,
      icon: Bell,
      description: "새로운 피드 항목",
      href: "/dashboard/feeds",
      trend: {
        value: `+${Math.floor(Math.random() * 30) + 5}%`,
        direction: "up",
      },
    },
    {
      id: "total-sessions",
      label: "총 채팅 세션",
      value: metrics?.totalSessions || Math.floor(Math.random() * 200) + 50,
      icon: MessageSquare,
      description: "전체 채팅 세션 수",
      href: "/dashboard/chat",
      trend: {
        value: `+${Math.floor(Math.random() * 15) + 2}%`,
        direction: "up",
      },
    },
    {
      id: "monthly-growth",
      label: "월간 성장률",
      value: `${Math.floor(Math.random() * 20) + 5}%`,
      icon: TrendingUp,
      description: "지난 30일 대비 성장률",
      trend: {
        value: `+${Math.floor(Math.random() * 5) + 1}%`,
        direction: "up",
      },
    },
    {
      id: "active-users",
      label: "활성 사용자",
      value:
        metrics?.recentSessions30d || Math.floor(Math.random() * 1000) + 100,
      icon: Users,
      description: "최근 30일 활성 사용자",
      href: "/dashboard/users",
      trend: {
        value: `${Math.random() > 0.7 ? "+" : "-"}${Math.floor(Math.random() * 8) + 1}%`,
        direction: Math.random() > 0.7 ? ("up" as const) : ("down" as const),
      },
    },
  ];

  // 상위 4-5개 통계만 반환 (사이드바 공간 고려)
  return stats.slice(0, Math.floor(Math.random() * 2) + 4);
}

/**
 * 실제 대시보드 메트릭을 기반으로 QuickStats 데이터 생성
 * @param metrics 대시보드 메트릭 데이터
 * @param previousMetrics 이전 메트릭 데이터 (트렌드 계산용)
 * @returns StatItem 배열
 */
export function generateQuickStatsFromMetrics(
  metrics: {
    totalBookmarks: number;
    activeMonitoring: number;
    unreadFeeds: number;
    totalSessions: number;
    totalMessages: number;
    recentSessions30d: number;
  },
  previousMetrics?: {
    totalBookmarks: number;
    activeMonitoring: number;
    unreadFeeds: number;
    totalSessions: number;
    totalMessages: number;
    recentSessions30d: number;
  },
): StatItem[] {
  const calculateTrend = (
    current: number,
    previous?: number,
  ): { value: string; direction: "up" | "down" | "neutral" } => {
    if (!previous || previous === 0) {
      return {
        value: current > 0 ? "+100%" : "0%",
        direction: current > 0 ? ("up" as const) : ("neutral" as const),
      };
    }

    const changePercent = ((current - previous) / previous) * 100;
    return {
      value: `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}%`,
      direction:
        changePercent > 0
          ? ("up" as const)
          : changePercent < 0
            ? ("down" as const)
            : ("neutral" as const),
    };
  };

  return [
    {
      id: "total-bookmarks",
      label: "전체 북마크",
      value: metrics.totalBookmarks,
      icon: Package,
      description: "저장된 북마크 수",
      href: "/dashboard/bookmarks",
      trend: calculateTrend(
        metrics.totalBookmarks,
        previousMetrics?.totalBookmarks,
      ),
    },
    {
      id: "active-monitoring",
      label: "활성 모니터링",
      value: metrics.activeMonitoring,
      icon: Activity,
      description: "모니터링 중인 항목",
      href: "/dashboard/monitoring",
      trend: calculateTrend(
        metrics.activeMonitoring,
        previousMetrics?.activeMonitoring,
      ),
    },
    {
      id: "unread-feeds",
      label: "읽지 않은 피드",
      value: metrics.unreadFeeds,
      icon: Bell,
      description: "새로운 피드 항목",
      href: "/dashboard/feeds",
      trend: calculateTrend(metrics.unreadFeeds, previousMetrics?.unreadFeeds),
    },
    {
      id: "total-sessions",
      label: "총 채팅 세션",
      value: metrics.totalSessions,
      icon: MessageSquare,
      description: "전체 채팅 세션 수",
      href: "/dashboard/chat",
      trend: calculateTrend(
        metrics.totalSessions,
        previousMetrics?.totalSessions,
      ),
    },
    {
      id: "active-users",
      label: "활성 사용자",
      value: metrics.recentSessions30d,
      icon: Users,
      description: "최근 30일 활성 사용자",
      href: "/dashboard/users",
      trend: calculateTrend(
        metrics.recentSessions30d,
        previousMetrics?.recentSessions30d,
      ),
    },
  ];
}

/**
 * QuickStats 데이터 로딩 시뮬레이션
 * @param delay 지연 시간 (ms)
 * @returns Promise<StatItem[]>
 */
export async function fetchMockQuickStats(delay = 800): Promise<StatItem[]> {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return generateMockQuickStats();
}

/**
 * QuickStats 에러 시뮬레이션을 위한 함수
 * @param shouldError 에러 발생 여부
 * @param delay 지연 시간 (ms)
 * @returns Promise<StatItem[]>
 */
export async function fetchQuickStatsWithError(
  shouldError = false,
  delay = 800,
): Promise<StatItem[]> {
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (shouldError) {
    throw new Error("통계 데이터를 불러오는 중 오류가 발생했습니다.");
  }

  return generateMockQuickStats();
}

/**
 * 빈 QuickStats 데이터 (데이터가 없을 때)
 */
export const EMPTY_QUICK_STATS: StatItem[] = [];
/**
 * 활동 피드 관련 목 데이터 생성 유틸리티
 */

/**
 * 활동 피드 목 데이터 생성
 * @param count 생성할 활동 수
 * @returns ActivityItem 배열
 */
export function generateMockActivities(count = 10): ActivityItem[] {
  const activities: ActivityItem[] = [];
  const activityTypes: Array<{ type: ActivityItem["type"]; weight: number }> = [
    { type: "chat", weight: 0.4 },
    { type: "bookmark", weight: 0.3 },
    { type: "notification", weight: 0.2 },
    { type: "feed", weight: 0.1 },
  ];

  const sampleTitles = {
    chat: [
      "새로운 채팅 세션 시작",
      "AI와의 대화 완료",
      "무역 규제 문의",
      "HS 코드 검색 요청",
      "수출입 절차 상담",
    ],
    bookmark: [
      "새로운 북마크 추가",
      "북마크 업데이트",
      "HS 코드 북마크 저장",
      "규제 정보 북마크",
      "기업 정보 북마크",
    ],
    notification: [
      "새로운 알림 수신",
      "중요 규제 변경 알림",
      "시스템 업데이트 알림",
      "피드 업데이트 알림",
      "보안 알림",
    ],
    feed: [
      "새로운 피드 항목",
      "규제 업데이트",
      "무역 뉴스",
      "정책 변경 사항",
      "시장 동향",
    ],
    system: [
      "시스템 유지보수",
      "데이터베이스 업데이트",
      "보안 패치 적용",
      "성능 최적화",
      "백업 완료",
    ],
  };

  const sampleDescriptions = {
    chat: [
      "AI 어시스턴트와 무역 관련 질문을 나누었습니다.",
      "수출입 절차에 대한 상세한 안내를 받았습니다.",
      "HS 코드 분류에 대한 도움을 받았습니다.",
      "규제 정보를 확인했습니다.",
      "무역 업무 관련 상담을 진행했습니다.",
    ],
    bookmark: [
      "중요한 정보를 북마크에 저장했습니다.",
      "자주 사용하는 HS 코드를 북마크했습니다.",
      "규제 정보를 나중에 참고하기 위해 저장했습니다.",
      "기업 정보를 북마크에 추가했습니다.",
      "유용한 문서를 북마크했습니다.",
    ],
    notification: [
      "새로운 알림이 도착했습니다.",
      "중요한 규제 변경사항이 있습니다.",
      "시스템 업데이트가 완료되었습니다.",
      "새로운 피드 항목이 업데이트되었습니다.",
      "보안 관련 알림입니다.",
    ],
    feed: [
      "새로운 피드 항목이 추가되었습니다.",
      "무역 관련 최신 뉴스입니다.",
      "규제 정책 변경사항입니다.",
      "시장 동향 업데이트입니다.",
      "업계 소식을 확인하세요.",
    ],
    system: [
      "시스템 유지보수가 완료되었습니다.",
      "데이터베이스가 성공적으로 업데이트되었습니다.",
      "보안 패치가 적용되었습니다.",
      "시스템 성능이 최적화되었습니다.",
      "데이터 백업이 완료되었습니다.",
    ],
  };

  const sampleUsers = [
    { name: "김무역", avatar: undefined },
    { name: "이수출", avatar: undefined },
    { name: "박수입", avatar: undefined },
    { name: "정관세", avatar: undefined },
    { name: "최물류", avatar: undefined },
  ];

  for (let i = 0; i < count; i++) {
    // 가중치를 고려한 활동 타입 선택
    const random = Math.random();
    let cumulativeWeight = 0;
    let selectedType = activityTypes[0].type;

    for (const { type, weight } of activityTypes) {
      cumulativeWeight += weight;
      if (random <= cumulativeWeight) {
        selectedType = type;
        break;
      }
    }

    const titles = sampleTitles[selectedType];
    const descriptions = sampleDescriptions[selectedType];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const description =
      descriptions[Math.floor(Math.random() * descriptions.length)];

    // 시간 생성 (최근 7일 내)
    const timestamp = new Date();
    timestamp.setTime(
      timestamp.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000,
    );

    const activity: ActivityItem = {
      id: `activity-${i + 1}`,
      type: selectedType,
      title,
      description,
      timestamp,
      user:
        Math.random() > 0.3
          ? sampleUsers[Math.floor(Math.random() * sampleUsers.length)]
          : undefined,
      href:
        selectedType === "chat"
          ? `/dashboard/history/${i + 1}`
          : selectedType === "bookmark"
            ? `/dashboard/bookmarks/${i + 1}`
            : selectedType === "notification"
              ? `/dashboard/notifications/${i + 1}`
              : `/dashboard/feeds/${i + 1}`,
      metadata: {
        priority: Math.random() > 0.7 ? "high" : "normal",
        category: selectedType,
      },
    };

    activities.push(activity);
  }

  // 시간순으로 정렬 (최신순)
  return activities.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );
}

/**
 * 관리 액션 관련 목 데이터 생성 유틸리티
 */

/**
 * 관리 액션 목 데이터 생성
 * @returns ManagementAction 배열
 */
export function generateMockManagementActions(): ManagementAction[] {
  return [
    {
      id: "profile-management",
      label: "프로필 관리",
      description: "계정 정보와 개인 설정을 관리합니다",
      icon: User,
      href: "/dashboard/profile",
    },
    {
      id: "notification-settings",
      label: "알림 설정",
      description: "알림 수신 방식과 빈도를 설정합니다",
      icon: Bell,
      href: "/dashboard/settings",
      badge: {
        text: "설정 필요",
        variant: "destructive",
      },
    },
    {
      id: "bookmark-management",
      label: "북마크 관리",
      description: "저장된 북마크를 정리하고 관리합니다",
      icon: Bookmark,
      href: "/dashboard/bookmarks",
      badge: {
        text: "새 항목",
        variant: "secondary",
        count: 3,
      },
    },
    {
      id: "feed-settings",
      label: "피드 설정",
      description: "관심 있는 피드 소스를 관리합니다",
      icon: Rss,
      href: "/dashboard/feeds/settings",
    },
    {
      id: "system-settings",
      label: "시스템 설정",
      description: "대시보드 레이아웃과 기본 설정을 변경합니다",
      icon: Settings,
      href: "/dashboard/system-settings",
    },
  ];
}

/**
 * 알림 관련 목 데이터 생성 유틸리티
 */

/**
 * 알림 목 데이터 생성
 * @param count 생성할 알림 수
 * @returns NotificationItem 배열
 */
export function generateMockNotifications(count = 10): NotificationItem[] {
  const notifications: NotificationItem[] = [];

  const sampleNotifications = [
    {
      type: "info" as const,
      title: "새로운 피드 업데이트",
      message: "관심 있는 카테고리에 새로운 정보가 업데이트되었습니다.",
    },
    {
      type: "warning" as const,
      title: "규제 변경 알림",
      message: "수출입 규제 정책에 중요한 변경사항이 있습니다.",
    },
    {
      type: "success" as const,
      title: "북마크 동기화 완료",
      message: "모든 북마크가 성공적으로 동기화되었습니다.",
    },
    {
      type: "error" as const,
      title: "시스템 오류",
      message:
        "일시적인 시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    },
    {
      type: "info" as const,
      title: "새로운 기능 안내",
      message: "대시보드에 새로운 기능이 추가되었습니다.",
    },
  ];

  for (let i = 0; i < count; i++) {
    const sample =
      sampleNotifications[
        Math.floor(Math.random() * sampleNotifications.length)
      ];

    // 시간 생성 (최근 3일 내)
    const timestamp = new Date();
    timestamp.setTime(
      timestamp.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000,
    );

    const notification: NotificationItem = {
      id: `notification-${i + 1}`,
      title: sample.title,
      message: sample.message,
      type: sample.type,
      timestamp,
      read: Math.random() > 0.4, // 60% 확률로 읽음 처리
      href: `/dashboard/notifications/${i + 1}`,
      metadata: {
        priority:
          sample.type === "error" || sample.type === "warning"
            ? "high"
            : "normal",
        category: sample.type,
      },
    };

    notifications.push(notification);
  }

  // 시간순으로 정렬 (최신순)
  return notifications.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );
}

/**
 * 알림 그룹 목 데이터 생성
 * @param notifications 알림 배열
 * @returns NotificationGroup 배열
 */
export function generateMockNotificationGroups(
  notifications?: NotificationItem[],
): NotificationGroup[] {
  const allNotifications = notifications || generateMockNotifications(15);

  const importantNotifications = allNotifications.filter(
    (n) =>
      n.type === "error" ||
      n.type === "warning" ||
      n.metadata?.priority === "high",
  );

  const generalNotifications = allNotifications.filter(
    (n) => n.type === "info" || n.type === "success",
  );

  return [
    {
      type: "important",
      count: importantNotifications.length,
      unreadCount: importantNotifications.filter((n) => !n.read).length,
      items: importantNotifications.slice(0, 5), // 최대 5개만 표시
    },
    {
      type: "general",
      count: generalNotifications.length,
      unreadCount: generalNotifications.filter((n) => !n.read).length,
      items: generalNotifications.slice(0, 5), // 최대 5개만 표시
    },
  ];
}

/**
 * 빈 알림 그룹 데이터
 */
export const EMPTY_NOTIFICATION_GROUPS: NotificationGroup[] = [
  {
    type: "important",
    count: 0,
    unreadCount: 0,
    items: [],
  },
  {
    type: "general",
    count: 0,
    unreadCount: 0,
    items: [],
  },
];
