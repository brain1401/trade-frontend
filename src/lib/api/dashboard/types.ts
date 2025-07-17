export type DashBoardData = {
  user: User;
  bookmarks: Bookmarks;
  chatHistory: ChatHistory;
  notifications: Notifications;
};

export type Bookmarks = {
  total: number;
  activeMonitoring: number;
  sseGenerated: number;
};

export type ChatHistory = {
  totalSessions: number;
  recentSessions30d: number;
  totalMessages: number;
};

export type Notifications = {
  unreadFeeds: number;
  highImportanceFeeds: number;
  smsEnabled: boolean;
  emailEnabled: boolean;
  notificationTime: string;
};

export type User = {
  name: string;
  email: string;
  phoneVerified: boolean;
  rememberMe: boolean;
};

export type DashboardNotification = {
  smsNotificationEnabled: boolean;
  emailNotificationEnabled: boolean;
  notificationFrequency: string;
  notificationTime: string;
};
