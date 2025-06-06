import { Outlet } from "react-router";
import { User, Bookmark, Settings, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";

export default function UserLayout() {
  return (
    <div className="space-y-3">
      {/* 사용자 섹션 헤더 */}
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">마이페이지</h1>
        <p className="text-lg text-gray-600">
          개인 설정 및 저장된 정보를 관리하세요
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* 사이드 네비게이션 */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-1">
              <Link
                to="/user/profile"
                className="flex items-center gap-2 rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100"
              >
                <User className="h-5 w-5" />
                프로필 관리
              </Link>
              <Link
                to="/user/bookmarks"
                className="flex items-center gap-2 rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100"
              >
                <Bookmark className="h-5 w-5" />
                북마크
              </Link>
              <Link
                to="/user/settings"
                className="flex items-center gap-2 rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
                설정
              </Link>
              <Link
                to="/user/notifications"
                className="flex items-center gap-2 rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100"
              >
                <Bell className="h-5 w-5" />
                알림 설정
              </Link>
            </nav>
          </Card>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="lg:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
