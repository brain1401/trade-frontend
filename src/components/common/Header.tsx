import React, { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell,
  User,
  Menu,
  Sparkles,
  BarChart3,
  Package,
  Settings,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useSearchStore } from "@/stores/searchStore";

const Header: React.FC = () => {
  const router = useRouter();
  const {
    user: _user,
    isAuthenticated,
    logout,
    getDisplayName,
  } = useAuthStore();
  const { unreadCount, toggleNotificationPanel } = useNotificationStore();
  const { setQuery: setQuery, detectIntent } = useSearchStore();
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setIsSearching(true);
    try {
      const intentResult = await detectIntent(searchValue);

      // Route based on detected intent
      switch (intentResult.intent) {
        case "hscode": {
          router.navigate({
            to: "/",
            search: { q: searchValue },
          });
          break;
        }
        case "tracking": {
          const cargoNumber = intentResult.extractedData?.cargoNumber;
          if (cargoNumber) {
            router.navigate({
              to: "/",
              search: { trackingNumber: cargoNumber },
            });
          }
          break;
        }
        case "general":
        default:
          router.navigate({ to: "/", search: { q: searchValue } });
          break;
      }
    } catch (error) {
      console.error("Search failed:", error);
      router.navigate({ to: "/", search: { q: searchValue } });
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">AI HS Code Radar</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            AI 분석
          </Link>
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            화물 추적
          </Link>
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            무역 통계
          </Link>
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            대시보드
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="mx-4 max-w-sm flex-1">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="제품명, 화물번호, 키워드 검색..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-8"
              disabled={isSearching}
            />
            {isSearching && (
              <div className="absolute top-2.5 right-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleNotificationPanel}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <User className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline-block">
                    {getDisplayName()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    대시보드
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    북마크
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    설정
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/">회원가입</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
