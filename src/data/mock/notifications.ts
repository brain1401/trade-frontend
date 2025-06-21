import type { ImportanceLevel } from "@/types";

/**
 * 알림 유형을 정의하는 열거형
 *
 * 시스템에서 발생할 수 있는 다양한 종류의 알림을 분류합니다.
 * 각 타입별로 다른 처리 로직과 UI가 적용됩니다.
 */
export type NotificationType =
  | "hscode_regulation" // HS Code 규제 변경
  | "cargo_status" // 화물 상태 업데이트
  | "trade_news" // 무역 관련 뉴스
  | "exchange_rate" // 환율 변동
  | "system"; // 시스템 공지

/**
 * 알림에 포함되는 액션 버튼의 데이터 구조
 *
 * 사용자가 알림에서 바로 수행할 수 있는 액션들을 정의합니다.
 * URL 이동 또는 특정 기능 실행이 가능합니다.
 */
export type NotificationAction = {
  /** 액션 버튼에 표시될 텍스트 */
  label: string;
  /** 이동할 URL (선택적) */
  url?: string;
  /** 실행할 액션 (선택적) */
  action?: string;
};

/**
 * 개별 알림의 데이터 구조
 *
 * 사용자에게 전달되는 알림의 모든 정보를 포함합니다.
 * 제목, 내용, 중요도, 관련 액션 등이 포함됩니다.
 */
export type Notification = {
  /** 알림의 고유 식별자 */
  id: string;
  /** 알림 유형 */
  type: NotificationType;
  /** 알림 제목 */
  title: string;
  /** 알림 본문 내용 */
  message: string;
  /** 알림 발생 시간 (ISO 문자열) */
  timestamp: string;
  /** 읽음 여부 */
  read: boolean;
  /** 중요도 레벨 */
  importance: ImportanceLevel;
  /** 정보 출처 */
  source: string;
  /** 관련 페이지 URL */
  relatedUrl: string;
  /** 수행 가능한 액션들 */
  actions: NotificationAction[];
};

/**
 * 알림 설정 정보의 데이터 구조
 *
 * 사용자의 알림 수신 선호도를 관리합니다.
 * 전체 설정과 카테고리별 세부 설정을 포함합니다.
 */
export type NotificationSettings = {
  /** 푸시 알림 전체 활성화 여부 */
  pushEnabled: boolean;
  /** 이메일 알림 전체 활성화 여부 */
  emailEnabled: boolean;
  /** 카테고리별 세부 설정 */
  categories: Record<
    NotificationType,
    {
      /** 카테고리 표시명 */
      name: string;
      /** 해당 카테고리 푸시 알림 활성화 여부 */
      pushEnabled: boolean;
      /** 해당 카테고리 이메일 알림 활성화 여부 */
      emailEnabled: boolean;
    }
  >;
};

/**
 * 알림 Mock 데이터
 *
 * 다양한 유형의 알림 샘플 데이터를 제공합니다.
 * HS Code 규제 변경, 화물 추적, 무역 뉴스, 환율, 시스템 공지 등이 포함됩니다.
 *
 * @example
 * ```typescript
 * const unreadNotifications = mockNotifications.filter(notif => !notif.read);
 * console.log(`읽지 않은 알림: ${unreadNotifications.length}개`);
 * ```
 */
export const mockNotifications: Notification[] = [
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
      { label: "상세보기", url: "/hscode/result/result-8517.12" },
      { label: "북마크 설정", action: "bookmark" },
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
    actions: [{ label: "추적보기", url: "/tracking/result/MSKU1234567" }],
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
    actions: [{ label: "뉴스보기", url: "/search/results?q=리튬배터리+규제" }],
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
    actions: [{ label: "환율현황", url: "/" }],
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

/**
 * 알림 설정 Mock 데이터
 *
 * 사용자의 기본 알림 설정 정보를 제공합니다.
 * 각 카테고리별로 푸시/이메일 알림 활성화 여부가 설정되어 있습니다.
 *
 * @example
 * ```typescript
 * const settings = mockNotificationSettings;
 * if (settings.categories.hscode_regulation.pushEnabled) {
 *   console.log("HS Code 규제 변경 푸시 알림 활성화됨");
 * }
 * ```
 */
export const mockNotificationSettings: NotificationSettings = {
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

/**
 * 읽지 않은 알림 목록 조회
 *
 * 사용자가 아직 읽지 않은 알림들만 필터링하여 반환합니다.
 * 알림 뱃지 수나 미읽음 목록 표시에 사용됩니다.
 *
 * @returns 읽지 않은 알림 배열
 *
 * @example
 * ```typescript
 * const unreadCount = getUnreadNotifications().length;
 * document.title = `TradeGenie (${unreadCount})`;
 * ```
 */
export const getUnreadNotifications = (): Notification[] => {
  return mockNotifications.filter((notification) => !notification.read);
};

/**
 * 타입별 알림 목록 조회
 *
 * 특정 알림 타입에 해당하는 알림들만 필터링하여 반환합니다.
 * 카테고리별 알림 관리나 통계에 사용됩니다.
 *
 * @param type - 조회할 알림 타입
 * @returns 해당 타입의 알림 배열
 *
 * @example
 * ```typescript
 * const cargoAlerts = getNotificationsByType("cargo_status");
 * console.log(`화물 관련 알림: ${cargoAlerts.length}개`);
 * ```
 */
export const getNotificationsByType = (
  type: NotificationType,
): Notification[] => {
  return mockNotifications.filter((notification) => notification.type === type);
};

/**
 * ID로 특정 알림 조회
 *
 * 알림 ID를 기준으로 해당 알림의 상세 정보를 반환합니다.
 * 알림 상세 보기나 읽음 처리 시 사용됩니다.
 *
 * @param id - 조회할 알림의 고유 식별자
 * @returns 해당 알림 객체, 없으면 undefined
 *
 * @example
 * ```typescript
 * const notification = getNotificationById("notif-1");
 * if (notification) {
 *   console.log(`제목: ${notification.title}`);
 *   console.log(`중요도: ${notification.importance}`);
 * }
 * ```
 */
export const getNotificationById = (id: string): Notification | undefined => {
  return mockNotifications.find((notification) => notification.id === id);
};
