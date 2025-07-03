import { AlertCircle, FileText, Globe, TrendingUp } from "lucide-react";

export const priorityConfig = {
  HIGH: {
    label: "높음",
    icon: <AlertCircle className="mr-1 h-4 w-4" />,
    badgeClass: "bg-danger-100 text-danger-800 hover:bg-danger-200",
  },
  MEDIUM: {
    label: "중간",
    icon: <TrendingUp className="mr-1 h-4 w-4" />,
    badgeClass: "bg-warning-100 text-warning-800 hover:bg-warning-200",
  },
  LOW: {
    label: "낮음",
    icon: <FileText className="mr-1 h-4 w-4" />,
    badgeClass: "bg-info-100 text-info-800 hover:bg-info-200",
  },
};

type CategoryConfig = {
  label: string;
  icon: React.ReactNode;
} | null;

export const categoryConfig: Record<string, CategoryConfig> = {
  TradeAgreement: {
    label: "무역 협정",
    icon: <Globe className="mr-1.5 h-4 w-4" />,
  },
  Tariff: {
    label: "관세",
    icon: <FileText className="mr-1.5 h-4 w-4" />,
  },
};
