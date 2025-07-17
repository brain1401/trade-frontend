import type { MouseEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import AppLogo from "@/components/common/AppLogo";
import { menuItems } from "@/data/common";
import { useAuth } from "@/stores/authStore";

type MobileNavProps = {
  closeSheet: () => void;
};

export function MobileNav({ closeSheet }: MobileNavProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleAuthRequiredClick = (e: MouseEvent, title: string) => {
    e.preventDefault();
    toast.info(`${title}은(는) 로그인이 필요한 기능입니다`, {
      description: "로그인 후 이용해주세요",
      action: {
        label: "로그인",
        onClick: () => {
          closeSheet();
          navigate({ to: "/auth/login" });
        },
      },
    });
  };

  const handleLinkClick = (
    e: MouseEvent,
    url: string,
    requiresAuth: boolean,
    title: string,
  ) => {
    if (requiresAuth && !isAuthenticated) {
      handleAuthRequiredClick(e, title);
      return;
    }
    closeSheet();
  };

  return (
    <div className="flex h-full flex-col pr-6">
      <div className="border-b p-4">
        <AppLogo />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            to={item.url}
            onClick={(e) =>
              handleLinkClick(e, item.url, item.requiresAuth, item.title)
            }
            className="flex items-center space-x-3 rounded-md p-3 text-base font-medium text-neutral-700 hover:bg-neutral-100"
          >
            <item.icon className="h-5 w-5 text-neutral-600" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
