import { Filter, Globe, BarChart3, TrendingUp, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import type { QuickLinkItem } from "@/types";

const QuickLinksBar = () => {
  const quickLinkItems: QuickLinkItem[] = [
    {
      name: "최신 규제",
      icon: <Filter size={18} className="mr-1.5" />,
      path: "/trade/regulations",
    },
    {
      name: "무역 통계",
      icon: <TrendingUp size={18} className="mr-1.5" />,
      path: "/trade/statistics",
    },
    {
      name: "국가별 정보",
      icon: <Globe size={18} className="mr-1.5" />,
      path: "/trade",
    },
    {
      name: "품목별 통계",
      icon: <BarChart3 size={18} className="mr-1.5" />,
      path: "/trade/statistics",
    },
    {
      name: "도움말",
      icon: <HelpCircle size={18} className="mr-1.5" />,
      path: "/",
    },
  ];

  return (
    <div className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2.5">
        {quickLinkItems.map((item) => (
          <Button
            key={item.name}
            variant="link"
            asChild
            className="hover:text-white!important flex h-auto items-center rounded-md px-2 py-1 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-500"
          >
            <Link to={item.path}>
              {item.icon}
              {item.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickLinksBar;
