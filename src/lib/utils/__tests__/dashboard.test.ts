/// <reference lib="dom" />
// Vitest 전역 함수 사용 (globals: true 설정)
import {
  formatRelativeTimeKo,
  getActivityTypeColor,
  getActivityTypeLabel,
  getDashboardTrendColor,
  getDashboardTrendIcon,
  calculateMetricChange,
  formatCompactNumber,
  formatBadgeCount,
  isDataFresh,
} from "../dashboard";

describe("Dashboard Utilities", () => {
  describe("formatRelativeTimeKo", () => {
    it("formats recent time correctly", () => {
      const now = new Date();
      const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);

      expect(formatRelativeTimeKo(thirtySecondsAgo)).toBe("방금 전");
    });

    it("formats minutes correctly", () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      expect(formatRelativeTimeKo(fiveMinutesAgo)).toBe("5분 전");
    });

    it("formats hours correctly", () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

      expect(formatRelativeTimeKo(twoHoursAgo)).toBe("2시간 전");
    });

    it("formats days correctly", () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

      expect(formatRelativeTimeKo(threeDaysAgo)).toBe("3일 전");
    });
  });

  describe("getActivityTypeColor", () => {
    it("returns correct colors for each activity type", () => {
      expect(getActivityTypeColor("chat")).toContain("blue");
      expect(getActivityTypeColor("bookmark")).toContain("green");
      expect(getActivityTypeColor("notification")).toContain("yellow");
      expect(getActivityTypeColor("feed")).toContain("purple");
      expect(getActivityTypeColor("system")).toContain("gray");
    });
  });

  describe("getActivityTypeLabel", () => {
    it("returns correct Korean labels", () => {
      expect(getActivityTypeLabel("chat")).toBe("채팅");
      expect(getActivityTypeLabel("bookmark")).toBe("북마크");
      expect(getActivityTypeLabel("notification")).toBe("알림");
      expect(getActivityTypeLabel("feed")).toBe("피드");
      expect(getActivityTypeLabel("system")).toBe("시스템");
    });
  });

  describe("getDashboardTrendColor", () => {
    it("returns correct colors for trends", () => {
      expect(getDashboardTrendColor("up")).toContain("green");
      expect(getDashboardTrendColor("down")).toContain("red");
      expect(getDashboardTrendColor("neutral")).toContain("gray");
    });
  });

  describe("getDashboardTrendIcon", () => {
    it("returns correct icons for trends", () => {
      expect(getDashboardTrendIcon("up")).toBe("↗");
      expect(getDashboardTrendIcon("down")).toBe("↘");
      expect(getDashboardTrendIcon("neutral")).toBe("→");
    });
  });

  describe("calculateMetricChange", () => {
    it("calculates positive change correctly", () => {
      const result = calculateMetricChange(120, 100);
      expect(result.value).toBe("+20.0%");
      expect(result.trend).toBe("up");
    });

    it("calculates negative change correctly", () => {
      const result = calculateMetricChange(80, 100);
      expect(result.value).toBe("-20.0%");
      expect(result.trend).toBe("down");
    });

    it("handles zero previous value", () => {
      const result = calculateMetricChange(100, 0);
      expect(result.value).toBe("+100%");
      expect(result.trend).toBe("up");
    });

    it("handles no change", () => {
      const result = calculateMetricChange(100, 100);
      expect(result.value).toBe("0.0%");
      expect(result.trend).toBe("neutral");
    });
  });

  describe("formatCompactNumber", () => {
    it("formats large numbers correctly", () => {
      expect(formatCompactNumber(150000000)).toBe("1.5억");
      expect(formatCompactNumber(25000)).toBe("2.5만");
      expect(formatCompactNumber(1500)).toBe("1.5천");
      expect(formatCompactNumber(500)).toBe("500");
    });
  });

  describe("formatBadgeCount", () => {
    it("formats badge counts correctly", () => {
      expect(formatBadgeCount(5)).toBe("5");
      expect(formatBadgeCount(99)).toBe("99");
      expect(formatBadgeCount(100)).toBe("99+");
      expect(formatBadgeCount(999)).toBe("99+");
    });
  });

  describe("isDataFresh", () => {
    it("returns true for fresh data", () => {
      const now = new Date();
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

      expect(isDataFresh(twoMinutesAgo)).toBe(true);
    });

    it("returns false for stale data", () => {
      const now = new Date();
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

      expect(isDataFresh(tenMinutesAgo)).toBe(false);
    });

    it("respects custom max age", () => {
      const now = new Date();
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

      expect(isDataFresh(twoMinutesAgo, 1 * 60 * 1000)).toBe(false); // 1 minute max age
    });
  });
});
