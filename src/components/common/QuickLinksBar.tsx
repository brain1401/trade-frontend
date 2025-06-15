import {
  Filter,
  BarChart3,
  TrendingUp,
  HelpCircle,
  DollarSign,
  Truck,
  Search,
  FileText,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

// 로컬 타입 정의
type QuickLinkItem = {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
  isExternal?: boolean;
};

const QuickLinksBar = () => {
  const quickLinkItems: QuickLinkItem[] = [
    {
      id: "cargo_tracking",
      label: "화물 추적",
      icon: <Truck size={18} className="mr-1.5" />,
      href: "/tracking",
      description: "실시간 화물 통관 현황",
    },
    {
      id: "exchange_rate",
      label: "관세 환율",
      icon: <DollarSign size={18} className="mr-1.5" />,
      href: "/",
      description: "최신 관세 환율 정보",
    },
    {
      id: "trade_statistics",
      label: "무역 통계",
      icon: <TrendingUp size={18} className="mr-1.5" />,
      href: "/search/results?category=statistics",
      description: "국가별 품목별 무역 데이터",
    },
    {
      id: "news_search",
      label: "무역 뉴스",
      icon: <FileText size={18} className="mr-1.5" />,
      href: "/news",
      description: "최신 무역 관련 뉴스",
    },
    {
      id: "help",
      label: "도움말",
      icon: <HelpCircle size={18} className="mr-1.5" />,
      href: "/search?q=도움말",
      description: "사용 가이드 및 FAQ",
    },
  ];

  return (
    <div className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2.5">
        {quickLinkItems.map((item) => (
          <Button
            key={item.id}
            variant="link"
            asChild
            className="hover:text-white!important flex h-auto items-center rounded-md px-2 py-1 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-500"
          >
            <Link to={item.href}>
              {item.icon}
              {item.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickLinksBar;
