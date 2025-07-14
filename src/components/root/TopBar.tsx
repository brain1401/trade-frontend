import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LogIn, Menu } from "lucide-react";

import UserAvatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/stores/authStore";

import { MobileNav } from "./MobileNav";
import AppLogo from "../common/AppLogo";

export default function TopBar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsSheetOpen(false);
    navigate({ to: "/auth/login" });
  };

  return (
    <header className="relative flex h-16 w-full items-center justify-between border-b bg-neutral-50 px-4 sm:px-6">
      {/* Left side */}
      <div className="flex items-center">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <MobileNav closeSheet={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Center logo (Absolutely positioned) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <AppLogo />
      </div>

      {/* Right side */}
      <div className="flex items-center">
        {isAuthenticated ? (
          <UserAvatar
            src={user?.profileImage || undefined}
            name={user?.name || "사용자"}
            size="md"
          />
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 border-primary-200 hover:border-primary-300 hover:bg-primary-50"
            onClick={handleLogin}
          >
            <LogIn className="h-5 w-5 text-primary-600" />
            <span className="sr-only">로그인</span>
          </Button>
        )}
      </div>
    </header>
  );
}
