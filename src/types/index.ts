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
};

export type HSCodeNews = {
  id: number;
  hscode: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  type: string;
  bookmarked: boolean;
};

export type NewsItemProps = {
  title: string;
  summary: string;
  source: string;
  date: string;
  type?: string;
  hscode?: string;
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
