// 모니터링 및 알림 시스템 관련 타입들

// 모니터링 대상 타입들
export type MonitoringTarget =
  | "hscode_regulation"
  | "exchange_rate"
  | "trade_statistics"
  | "news_update"
  | "cargo_status"
  | "bookmark_change";

export type MonitoringRule = {
  id: string;
  userId: string;
  target: MonitoringTarget;
  name: string;
  description: string;
  parameters: MonitoringParameters;
  conditions: MonitoringCondition[];
  actions: AlertAction[];
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  triggerCount: number;
};

export type MonitoringParameters = {
  // HS Code 규제 모니터링
  hsCodes?: string[];
  countries?: string[];

  // 환율 모니터링
  currencies?: string[];
  thresholdType?: "above" | "below" | "change_percent";
  thresholdValue?: number;

  // 뉴스 모니터링
  keywords?: string[];
  categories?: string[];
  sources?: string[];

  // 화물 모니터링
  trackingNumbers?: string[];
  statusTypes?: string[];

  // 일반 설정
  checkInterval: number; // minutes
  timeRange?: {
    start: string; // HH:mm
    end: string; // HH:mm
    timezone: string;
  };
};

export type MonitoringCondition = {
  field: string;
  operator: ConditionOperator;
  value: string | number | boolean;
  logicalOperator?: "AND" | "OR";
};

export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "less_than"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "in_range"
  | "changed";

// 알림 관련 타입들
export type AlertAction = {
  type: AlertType;
  enabled: boolean;
  configuration: AlertConfiguration;
};

export type AlertType =
  | "browser_notification"
  | "email"
  | "sms"
  | "webhook"
  | "in_app_notification";

export type AlertConfiguration = {
  // 이메일 설정
  emailTemplate?: string;
  emailSubject?: string;
  recipients?: string[];

  // 브라우저 알림 설정
  notificationTitle?: string;
  notificationBody?: string;
  notificationIcon?: string;

  // SMS 설정
  phoneNumbers?: string[];
  smsMessage?: string;

  // 웹훅 설정
  webhookUrl?: string;
  webhookMethod?: "POST" | "PUT";
  webhookHeaders?: Record<string, string>;
  webhookPayload?: Record<string, any>;

  // 일반 설정
  priority: AlertPriority;
  retryAttempts?: number;
  retryInterval?: number; // minutes
};

export type AlertPriority = "low" | "medium" | "high" | "critical";

// 알림 이력
export type AlertHistory = {
  id: string;
  ruleId: string;
  userId: string;
  target: MonitoringTarget;
  title: string;
  message: string;
  priority: AlertPriority;
  status: AlertStatus;
  triggeredAt: string;
  deliveredAt?: string;
  readAt?: string;
  actions: AlertDeliveryAttempt[];
  metadata: Record<string, any>;
};

export type AlertStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "cancelled";

export type AlertDeliveryAttempt = {
  type: AlertType;
  attempt: number;
  status: "pending" | "success" | "failed";
  timestamp: string;
  error?: string;
  deliveryId?: string;
};

// 변경 감지
export type ChangeDetection = {
  id: string;
  target: MonitoringTarget;
  targetId: string;
  changeType: ChangeType;
  previousValue: any;
  currentValue: any;
  diff: ChangeDiff;
  detectedAt: string;
  severity: ChangeSeverity;
  description: string;
  affectedUsers: string[];
};

export type ChangeType =
  | "created"
  | "updated"
  | "deleted"
  | "status_changed"
  | "value_changed"
  | "threshold_exceeded";

export type ChangeDiff = {
  field: string;
  oldValue: any;
  newValue: any;
  changePercent?: number;
}[];

export type ChangeSeverity = "minor" | "moderate" | "major" | "critical";

// 모니터링 통계
export type MonitoringStats = {
  userId: string;
  period: "daily" | "weekly" | "monthly";
  totalRules: number;
  activeRules: number;
  totalAlerts: number;
  alertsByPriority: Record<AlertPriority, number>;
  alertsByType: Record<AlertType, number>;
  mostTriggeredRules: {
    ruleId: string;
    name: string;
    triggerCount: number;
  }[];
  responseTime: {
    averageMs: number;
    p95Ms: number;
    p99Ms: number;
  };
};

// 사용자 알림 설정
export type UserNotificationSettings = {
  userId: string;
  globalSettings: {
    enableNotifications: boolean;
    quietHours: {
      enabled: boolean;
      start: string; // HH:mm
      end: string; // HH:mm
      timezone: string;
    };
    maxAlertsPerHour: number;
    consolidationDelay: number; // minutes
  };
  channelSettings: Record<AlertType, ChannelSetting>;
  categorySettings: Record<MonitoringTarget, CategorySetting>;
};

export type ChannelSetting = {
  enabled: boolean;
  minimumPriority: AlertPriority;
  customConfiguration?: Record<string, any>;
};

export type CategorySetting = {
  enabled: boolean;
  minimumPriority: AlertPriority;
  channels: AlertType[];
  customFilters?: MonitoringCondition[];
};

// 실시간 모니터링 상태
export type MonitoringSystemStatus = {
  isHealthy: boolean;
  lastCheck: string;
  services: ServiceStatus[];
  metrics: SystemMetrics;
  issues: SystemIssue[];
};

export type ServiceStatus = {
  name: string;
  status: "healthy" | "degraded" | "down";
  lastCheck: string;
  responseTime?: number;
  error?: string;
};

export type SystemMetrics = {
  rulesProcessed: number;
  alertsSent: number;
  averageProcessingTime: number;
  errorRate: number;
  queueSize: number;
};

export type SystemIssue = {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  affectedServices: string[];
  detectedAt: string;
  resolvedAt?: string;
  workaround?: string;
};
