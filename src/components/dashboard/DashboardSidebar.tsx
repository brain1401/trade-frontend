import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ContentCard from "@/components/common/ContentCard";
import { TrendingUp, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Bookmark } from "@/data/mock/dashboard";
import type {
  NotificationSettingsSidebarProps,
  WeeklySummarySidebarProps,
  BookmarkStatsSidebarProps,
  QuickActionsSidebarProps,
  MonitoringSettingsSidebarProps,
} from "./types";

// 스타일 상수 정의 (THEME_GUIDE 기준)
const CARD_SPACING_CLASSES = "mt-8";

// 알림 설정 사이드바 컴포넌트
export function NotificationSettingsSidebar({
  className,
}: NotificationSettingsSidebarProps) {
  return (
    <ContentCard title="알림 설정" className={className}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">브라우저 푸시 알림</span>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">이메일 알림</span>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">중요 알림만</span>
          <Switch />
        </div>
      </div>
      <div className="mt-4">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/notifications">알림 히스토리 보기</Link>
        </Button>
      </div>
    </ContentCard>
  );
}

// 이번 주 요약 사이드바 컴포넌트
export function WeeklySummarySidebar({ className }: WeeklySummarySidebarProps) {
  return (
    <ContentCard title="이번 주 요약" className={className}>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-primary-50 p-3 text-center">
          <TrendingUp size={20} className="mx-auto mb-1 text-primary-600" />
          <p className="text-xs text-primary-600">업데이트</p>
          <p className="text-lg font-bold text-primary-800">12</p>
        </div>
        <div className="rounded-lg bg-success-50 p-3 text-center">
          <Bell size={20} className="mx-auto mb-1 text-success-600" />
          <p className="text-xs text-success-600">새 알림</p>
          <p className="text-lg font-bold text-success-800">8</p>
        </div>
      </div>
    </ContentCard>
  );
}

// 북마크 통계 사이드바 컴포넌트
export function BookmarkStatsSidebar({
  bookmarks,
  className,
}: BookmarkStatsSidebarProps) {
  return (
    <ContentCard title="북마크 통계" className={className}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">전체 북마크</span>
          <span className="font-medium">{bookmarks.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">모니터링 중</span>
          <span className="font-medium text-success-600">
            {bookmarks.filter((b) => b.monitoringEnabled).length}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">HS Code</span>
          <span className="font-medium">
            {bookmarks.filter((b) => b.type === "hscode").length}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">화물 추적</span>
          <span className="font-medium">
            {bookmarks.filter((b) => b.type === "tracking").length}
          </span>
        </div>
      </div>
    </ContentCard>
  );
}

// 빠른 액션 사이드바 컴포넌트
export function QuickActionsSidebar({ className }: QuickActionsSidebarProps) {
  return (
    <ContentCard title="빠른 액션" className={className}>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => (window.location.href = "/hscode/analyze/new-session")}
        >
          새 HS Code 분석
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/tracking/search">화물 추적하기</Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/search/results">정보 검색하기</Link>
        </Button>
      </div>
    </ContentCard>
  );
}

// 모니터링 설정 사이드바 컴포넌트
export function MonitoringSettingsSidebar({
  className,
}: MonitoringSettingsSidebarProps) {
  return (
    <ContentCard title="모니터링 설정" className={className}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">자동 체크 주기</span>
          <select
            className="rounded border border-neutral-200 px-2 py-1 text-xs"
            aria-label="자동 체크 주기 선택"
          >
            <option>1시간</option>
            <option>6시간</option>
            <option>12시간</option>
            <option>24시간</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">중요 변경사항만</span>
          <Switch />
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            <Settings size={16} className="mr-1" />
            고급 설정
          </Button>
        </div>
      </div>
    </ContentCard>
  );
}

// 업데이트 피드용 사이드바 - 알림 설정과 이번 주 요약
export function UpdatesFeedSidebar() {
  return (
    <aside className="mt-8 lg:mt-0 lg:w-1/3">
      <NotificationSettingsSidebar />
      <WeeklySummarySidebar className={CARD_SPACING_CLASSES} />
    </aside>
  );
}

// 북마크 관리용 사이드바 - 북마크 통계, 빠른 액션, 모니터링 설정
export function BookmarkManagementSidebar({
  bookmarks,
}: {
  bookmarks: Bookmark[];
}) {
  return (
    <aside className="mt-8 lg:mt-0 lg:w-1/3">
      <BookmarkStatsSidebar bookmarks={bookmarks} />
      <QuickActionsSidebar className={CARD_SPACING_CLASSES} />
      <MonitoringSettingsSidebar className={CARD_SPACING_CLASSES} />
    </aside>
  );
}
