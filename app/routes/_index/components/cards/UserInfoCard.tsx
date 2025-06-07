import { type ReactNode } from "react";
import {
  MessageSquare,
  Bookmark,
  Briefcase,
  Settings,
  LogOut,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "@/components/ui/Link";

type Buttons = { name: string; icon: ReactNode; count?: number; path?: string };

const LINK_BUTTON_BASE_CLASSES = "h-auto p-0 text-sm hover:underline";
const AVATAR_BORDER_CLASSES = "border-2 border-white";

const UserInfoCard = () => {
  const buttons: Buttons[] = [
    {
      name: "메시지",
      icon: <MessageSquare size={20} />,
      count: 3,
      path: "/messages",
    },
    {
      name: "북마크",
      icon: <Bookmark size={20} />,
      count: 12,
      path: "/bookmarks",
    },
    {
      name: "분석이력",
      icon: <Briefcase size={20} />,
      path: "/analysis-history",
    },
    { name: "계정설정", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <Card className="mb-4 overflow-hidden shadow-lg">
      <div className="bg-blue-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="mr-3 h-12 w-12">
              <AvatarImage
                src="https://placehold.co/48x48/FFFFFF/004E98?text=A"
                alt="사용자 프로필"
                className={AVATAR_BORDER_CLASSES}
              />
              <AvatarFallback
                className={cn(AVATAR_BORDER_CLASSES, "bg-white text-brand-700")}
              >
                A
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold text-white">Aiden 님</p>
              <p className="text-xs text-blue-100">brain1401@tradegenie.com</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="flex h-auto items-center rounded-md bg-white px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-gray-100"
          >
            <LogOut size={14} className="mr-1" /> 로그아웃
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-around border-b border-gray-200 pb-3">
          <Button
            variant="link"
            asChild
            className={cn(LINK_BUTTON_BASE_CLASSES, "text-blue-600")}
          >
            <Link to="/support" className="flex items-center">
              <LifeBuoy size={16} className="mr-1.5 text-blue-500" /> 문의하기
            </Link>
          </Button>
          <Button
            variant="link"
            asChild
            className={cn(
              LINK_BUTTON_BASE_CLASSES,
              "ml-4 text-gray-700 hover:text-blue-600",
            )}
          >
            <Link to="/profile">프로필 수정</Link>
          </Button>
        </div>
        <ul className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
          {buttons.map(({ name, icon, count, path }) => (
            <li className="flex w-full items-center justify-center" key={name}>
              <Button
                variant="ghost"
                asChild
                className="relative flex h-auto w-[5rem] flex-col items-center justify-center overflow-visible rounded-md p-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                <Link to={path || "#"}>
                  <div className="mb-1">{icon}</div>
                  <span>{name}</span>
                  {count && (
                    <Badge
                      variant="destructive"
                      className="pointer-events-none absolute top-0 right-0 z-10 translate-x-1/3 -translate-y-1/3 transform px-1.5 py-0.5 text-xs"
                    >
                      {count}
                    </Badge>
                  )}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
