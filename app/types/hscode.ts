export type HSCODEResult = {
  hscode: string;
  name: string;
  description: string;
  statistics: Statistics;
  request_info: RequestInfo;
  note: string;
};

export type RequestInfo = {
  requested_at: string;
  method: string;
  full_url: string;
};

export type Statistics = {
  year: string;
  country: string;
  export: Export;
  import: Import;
  trade_balance: string;
  total_trade: string;
  korea_trade_share: string;
  flow_type: string;
};

export type Export = {
  value: string;
  growth: string;
  world_rank: string;
  top_destinations: Top[];
};

export type Top = {
  country: string;
  share: string;
  value: string;
};

export type Import = {
  value: string;
  growth: string;
  top_origins: Top[];
};
