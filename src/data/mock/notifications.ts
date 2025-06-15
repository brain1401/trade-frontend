// 알림 시스템 관련 목업 데이터

export const mockNotifications = [
  {
    id: "notif-1",
    type: "hscode_regulation",
    title: "HS Code 8517.12 KC 인증 요건 변경",
    message:
      "휴대폰 관련 KC 인증 절차가 간소화되었습니다. 인증 기간이 30일에서 15일로 단축됩니다.",
    timestamp: "2024-01-15T14:30:00Z",
    read: false,
    importance: "high",
    source: "방송통신위원회",
    relatedUrl: "/hscode/result/result-8517.12",
    actions: [
      {
        label: "상세보기",
        url: "/hscode/result/result-8517.12",
      },
      {
        label: "북마크 설정",
        action: "bookmark",
      },
    ],
  },
  {
    id: "notif-2",
    type: "cargo_status",
    title: "화물 MSKU1234567 통관 진행",
    message:
      "부산항 도착이 완료되었습니다. 다음 단계인 수입신고가 곧 시작됩니다.",
    timestamp: "2024-01-15T10:15:00Z",
    read: false,
    importance: "medium",
    source: "관세청",
    relatedUrl: "/tracking/result/MSKU1234567",
    actions: [
      {
        label: "추적보기",
        url: "/tracking/result/MSKU1234567",
      },
    ],
  },
  {
    id: "notif-3",
    type: "trade_news",
    title: "중국 리튬배터리 규제 강화",
    message:
      "2024년 3월부터 리튬배터리 관련 안전 기준이 강화됩니다. 관련 업체는 사전 준비가 필요합니다.",
    timestamp: "2024-01-14T16:45:00Z",
    read: true,
    importance: "high",
    source: "무역협회",
    relatedUrl: "/search/results?q=리튬배터리+규제",
    actions: [
      {
        label: "뉴스보기",
        url: "/search/results?q=리튬배터리+규제",
      },
    ],
  },
  {
    id: "notif-4",
    type: "exchange_rate",
    title: "환율 급등 알림",
    message:
      "달러-원 환율이 1,350원을 돌파했습니다. 수출입 계약 시 참고하시기 바랍니다.",
    timestamp: "2024-01-14T09:30:00Z",
    read: true,
    importance: "medium",
    source: "한국은행",
    relatedUrl: "/",
    actions: [
      {
        label: "환율현황",
        url: "/",
      },
    ],
  },
  {
    id: "notif-5",
    type: "system",
    title: "시스템 점검 공지",
    message:
      "1월 20일 새벽 2시-4시 시스템 점검이 예정되어 있습니다. 서비스 이용에 참고하세요.",
    timestamp: "2024-01-13T18:00:00Z",
    read: true,
    importance: "low",
    source: "시스템 관리자",
    relatedUrl: "/notifications",
    actions: [],
  },
];

export const mockNotificationSettings = {
  pushEnabled: true,
  emailEnabled: true,
  categories: {
    hscode_regulation: {
      name: "HS Code 규제 변경",
      pushEnabled: true,
      emailEnabled: true,
    },
    cargo_status: {
      name: "화물 추적 상태",
      pushEnabled: true,
      emailEnabled: false,
    },
    trade_news: {
      name: "무역 뉴스",
      pushEnabled: false,
      emailEnabled: true,
    },
    exchange_rate: {
      name: "환율 변동",
      pushEnabled: true,
      emailEnabled: false,
    },
    system: {
      name: "시스템 공지",
      pushEnabled: true,
      emailEnabled: true,
    },
  },
};

export type NotificationType =
  | "hscode_regulation"
  | "cargo_status"
  | "trade_news"
  | "exchange_rate"
  | "system";

export type NotificationImportance = "high" | "medium" | "low";

export type NotificationAction = {
  label: string;
  url?: string;
  action?: string;
};

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  importance: NotificationImportance;
  source: string;
  relatedUrl: string;
  actions: NotificationAction[];
};
