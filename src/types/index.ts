export type ExchangeRate = {
  currency: string;
  rate: number;
  change: number;
  symbol: string;
};

export type TradeNews = {
  id: number;
  title: string;
  summary: string;
  source: string;
  date: string;
  uuid: string;
  type: "규제" | "관세" | "뉴스";
  hscode: string;
};

export type HSCodeNews = {
  id: number;
  hscode: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  type: "규제" | "관세" | "뉴스";
  bookmarked: boolean;
  uuid: string;
};

export type ContentCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleRightElement?: React.ReactNode;
};

export type QuickLinkItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

export type FilterOption = "latest" | "bookmarked";
