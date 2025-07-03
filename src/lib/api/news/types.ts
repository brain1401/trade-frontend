export type News = {
  content: NewsContent[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
};

export type NewsContent = {
  id: number;
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  priority: number;
  publishedAt: Date;
  category: string;
};

export type Pageable = {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

export type Sort = {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
};
