export type BookmarkData = {
    content:          Bookmark[];
    pageable:         Pageable;
    last:             boolean;
    totalElements:    number;
    totalPages:       number;
    size:             number;
    number:           number;
    sort:             Sort;
    first:            boolean;
    numberOfElements: number;
    empty:            boolean;
}

export type Bookmark = {
    id:                       number;
    type:                     string;
    targetValue:              string;
    displayName:              string;
    sseGenerated:             boolean;
    sseEventData:             SSEEventData | null;
    smsNotificationEnabled:   boolean;
    emailNotificationEnabled: boolean;
    monitoringActive:         boolean;
    createdAt:                Date;
    updatedAt:                Date;
}

export type SSEEventData = {
    sessionId:      string;
    confidence:     number;
    claudeAnalysis: string;
}

export type Pageable = {
    pageNumber: number;
    pageSize:   number;
    sort:       Sort;
    offset:     number;
    paged:      boolean;
    unpaged:    boolean;
}

export type Sort = {
    empty:    boolean;
    unsorted: boolean;
    sorted:   boolean;
}
