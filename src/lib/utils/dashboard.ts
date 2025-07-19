import type {
  ActivityItem,
  ActivityType,
  TrendDirection,
  ErrorState,
  NotificationItem,
  DashboardMetrics,
} from "@/types/dashboard";

/**
 * 대시보드 관련 유틸리티 함수들
 * 시간 포맷팅, 에러 처리, 데이터 변환 등의 공통 기능 제공
 */

/**
 * 상대적 시간을 한국어로 포맷팅하는 함수
 *
 * @param date - 포맷팅할 날짜
 * @returns 한국어 상대적 시간 문자열
 *
 * @example
 * ```typescript
 * const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
 * formatRelativeTimeKo(yesterday); // "1일 전"
 * ```
 */
export const formatRelativeTimeKo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "방금 전";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}분 전`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}시간 전`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}개월 전`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years}년 전`;
  }
};

/**
 * 활동 타입에 따른 색상 클래스를 반환하는 함수
 *
 * @param type - 활동 타입
 * @returns Tailwind CSS 색상 클래스
 */
export const getActivityTypeColor = (type: ActivityType): string => {
  switch (type) {
    case "chat":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "bookmark":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "notification":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "feed":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "system":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

/**
 * 활동 타입에 따른 한국어 라벨을 반환하는 함수
 *
 * @param type - 활동 타입
 * @returns 한국어 라벨
 */
export const getActivityTypeLabel = (type: ActivityType): string => {
  switch (type) {
    case "chat":
      return "채팅";
    case "bookmark":
      return "북마크";
    case "notification":
      return "알림";
    case "feed":
      return "피드";
    case "system":
      return "시스템";
    default:
      return "기타";
  }
};

/**
 * 트렌드 방향에 따른 색상 클래스를 반환하는 함수
 *
 * @param trend - 트렌드 방향
 * @returns Tailwind CSS 색상 클래스
 */
export const getDashboardTrendColor = (trend: TrendDirection): string => {
  switch (trend) {
    case "up":
      return "text-green-600 dark:text-green-400";
    case "down":
      return "text-red-600 dark:text-red-400";
    case "neutral":
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

/**
 * 트렌드 방향에 따른 아이콘을 반환하는 함수
 *
 * @param trend - 트렌드 방향
 * @returns 트렌드 아이콘 문자열
 */
export const getDashboardTrendIcon = (trend: TrendDirection): string => {
  switch (trend) {
    case "up":
      return "↗";
    case "down":
      return "↘";
    case "neutral":
    default:
      return "→";
  }
};

/**
 * 에러 상태에 따른 사용자 친화적 메시지를 반환하는 함수
 *
 * @param error - 에러 상태 객체
 * @returns 한국어 에러 메시지
 */
export const getErrorMessage = (error: ErrorState): string => {
  switch (error.type) {
    case "network":
      return "네트워크 연결을 확인해주세요.";
    case "server":
      return "서버에 일시적인 문제가 발생했습니다.";
    case "permission":
      return "접근 권한이 없습니다.";
    case "unknown":
    default:
      return error.message || "알 수 없는 오류가 발생했습니다.";
  }
};

/**
 * 활동 목록을 날짜별로 그룹화하는 함수
 *
 * @param activities - 활동 목록
 * @returns 날짜별로 그룹화된 활동 목록
 */
export const groupActivitiesByDate = (
  activities: ActivityItem[],
): Record<string, ActivityItem[]> => {
  const grouped: Record<string, ActivityItem[]> = {};

  activities.forEach((activity) => {
    const dateKey = activity.timestamp.toDateString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(activity);
  });

  return grouped;
};

/**
 * 날짜를 한국어 형식으로 포맷팅하는 함수
 *
 * @param date - 포맷팅할 날짜
 * @returns 한국어 날짜 문자열
 */
export const formatDateKo = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "오늘";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "어제";
  } else {
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  }
};

/**
 * 알림의 우선순위를 계산하는 함수
 *
 * @param notification - 알림 객체
 * @returns 우선순위 점수 (높을수록 중요)
 */
export const getNotificationPriority = (
  notification: NotificationItem,
): number => {
  let priority = 0;

  // 타입별 기본 우선순위
  switch (notification.type) {
    case "error":
      priority += 100;
      break;
    case "warning":
      priority += 50;
      break;
    case "success":
      priority += 20;
      break;
    case "info":
      priority += 10;
      break;
  }

  // 읽지 않은 알림은 우선순위 증가
  if (!notification.read) {
    priority += 25;
  }

  // 최근 알림일수록 우선순위 증가
  const hoursAgo =
    (Date.now() - notification.timestamp.getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 1) {
    priority += 30;
  } else if (hoursAgo < 24) {
    priority += 15;
  }

  return priority;
};

/**
 * 메트릭 값의 변화율을 계산하는 함수
 *
 * @param current - 현재 값
 * @param previous - 이전 값
 * @returns 변화율 객체
 */
export const calculateMetricChange = (
  current: number,
  previous: number,
): { value: string; trend: TrendDirection } => {
  if (previous === 0) {
    return {
      value: current > 0 ? "+100%" : "0%",
      trend: current > 0 ? "up" : "neutral",
    };
  }

  const changePercent = ((current - previous) / previous) * 100;
  const trend: TrendDirection =
    changePercent > 0 ? "up" : changePercent < 0 ? "down" : "neutral";

  return {
    value: `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}%`,
    trend,
  };
};

/**
 * 대시보드 메트릭을 표시용 형태로 변환하는 함수
 *
 * @param metrics - 원본 메트릭 데이터
 * @param previousMetrics - 이전 메트릭 데이터 (변화율 계산용)
 * @returns 표시용 메트릭 배열
 */
export const transformMetricsForDisplay = (
  metrics: DashboardMetrics,
  previousMetrics?: DashboardMetrics,
) => {
  const displayMetrics = [
    {
      key: "totalBookmarks",
      title: "총 북마크",
      value: metrics.totalBookmarks,
      description: "저장된 북마크 수",
    },
    {
      key: "activeMonitoring",
      title: "활성 모니터링",
      value: metrics.activeMonitoring,
      description: "모니터링 중인 항목",
    },
    {
      key: "unreadFeeds",
      title: "읽지 않은 피드",
      value: metrics.unreadFeeds,
      description: "새로운 피드 항목",
    },
    {
      key: "totalSessions",
      title: "총 세션",
      value: metrics.totalSessions,
      description: "전체 채팅 세션",
    },
  ];

  // 이전 데이터가 있으면 변화율 계산
  if (previousMetrics) {
    return displayMetrics.map((metric) => ({
      ...metric,
      change: calculateMetricChange(
        metric.value,
        previousMetrics[metric.key as keyof DashboardMetrics] || 0,
      ),
    }));
  }

  return displayMetrics;
};

/**
 * 숫자를 간단한 형태로 축약하는 함수 (한국어 단위)
 *
 * @param value - 축약할 숫자
 * @returns 축약된 문자열
 */
export const formatCompactNumber = (value: number): string => {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}억`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}만`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}천`;
  }
  return value.toString();
};

/**
 * 시간 범위를 한국어로 포맷팅하는 함수
 *
 * @param start - 시작 날짜
 * @param end - 종료 날짜
 * @returns 한국어 시간 범위 문자열
 */
export const formatTimeRange = (start: Date, end: Date): string => {
  const startStr = start.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
  const endStr = end.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });

  return `${startStr} - ${endStr}`;
};

/**
 * 배지 카운트를 포맷팅하는 함수 (99+ 형태로 제한)
 *
 * @param count - 카운트 숫자
 * @returns 포맷팅된 카운트 문자열
 */
export const formatBadgeCount = (count: number): string => {
  if (count > 99) {
    return "99+";
  }
  return count.toString();
};

/**
 * 로딩 상태의 지연 시간을 계산하는 함수
 *
 * @param startTime - 로딩 시작 시간
 * @returns 지연 시간 (밀리초)
 */
export const calculateLoadingDelay = (startTime: number): number => {
  return Date.now() - startTime;
};

/**
 * 데이터 신선도를 확인하는 함수
 *
 * @param lastUpdated - 마지막 업데이트 시간
 * @param maxAge - 최대 허용 시간 (밀리초)
 * @returns 데이터가 신선한지 여부
 */
export const isDataFresh = (
  lastUpdated: Date,
  maxAge: number = 5 * 60 * 1000,
): boolean => {
  return Date.now() - lastUpdated.getTime() < maxAge;
};
