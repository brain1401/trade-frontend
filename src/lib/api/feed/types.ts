export type RecentUpdatesFeedData = {
    totalElements:    number;
    totalPages:       number;
    size:             number;
    content:          Content[];
    number:           number;
    sort:             Sort;
    first:            boolean;
    last:             boolean;
    numberOfElements: number;
    pageable:         Pageable;
    empty:            boolean;
}

export type Content = {
    id:          number;
    feedType:    string;
    targetType:  string;
    targetValue: string;
    title:       string;
    content:     string;
    sourceUrl:   string;
    importance:  string;
    isRead:      boolean;
    createdAt:   Date;
}

export type Pageable = {
    offset:     number;
    sort:       Sort;
    pageNumber: number;
    pageSize:   number;
    paged:      boolean;
    unpaged:    boolean;
}

export type Sort = {
    empty:    boolean;
    unsorted: boolean;
    sorted:   boolean;
}
