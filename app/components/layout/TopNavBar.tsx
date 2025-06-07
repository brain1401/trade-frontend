import React, { useState } from "react";
import { Bell, Bookmark, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Link } from "react-router";

const TopNavBar = () => {
  const [hasNotification, setHasNotification] = useState(true);
  const [hasBookmarkUpdate, setHasBookmarkUpdate] = useState(true);
  const [hasChangeDetection, setHasChangeDetection] = useState(false);

  // 각 아이콘 버튼을 Tooltip으로 감싸기
  const iconButton = (
    title: string,
    icon: React.ReactNode,
    hasDot: boolean,
  ): React.ReactNode => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="link"
          size="icon"
          className="relative h-auto w-auto rounded-full p-1 text-white hover:text-blue-200"
        >
          {icon}
          {hasDot && (
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 animate-pulse-subtle rounded-full bg-red-500 ring-2 ring-brand-700"></span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="relative z-[100] rounded bg-black p-1 px-2 text-xs text-white"
      >
        <p>{title}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <>
      <TooltipProvider>
        <nav className="bg-brand-700 p-3 text-white shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="ml-[3rem] text-4xl font-bold">
              서비스 이름
            </Link>
            <div className="flex items-center space-x-5">
              {iconButton("알림", <Bell size={22} />, hasNotification)}
              {iconButton("북마크", <Bookmark size={22} />, hasBookmarkUpdate)}
              {iconButton(
                "변동사항 감지",
                <Eye size={22} />,
                hasChangeDetection,
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage
                      src="https://placehold.co/32x32/FFFFFF/004E98?text=A"
                      alt="사용자 프로필"
                      className="border-2 border-blue-200 hover:opacity-90"
                    />
                    <AvatarFallback className="border-2 border-blue-200 bg-white text-brand-700">
                      A
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="rounded bg-black p-1 px-2 text-xs text-white"
                >
                  <p>내 정보</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </nav>
      </TooltipProvider>
    </>
  );
};

export default TopNavBar;
