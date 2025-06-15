import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bookmark as BookmarkIcon,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  Settings,
} from "lucide-react";
import { useBookmarkStore, type Bookmark } from "@/stores/bookmarkStore";

export const BookmarkManagement = () => {
  // 북마크 스토어 사용
  const {
    bookmarks,
    filters,
    sortBy,
    sortOrder,
    setFilter,
    setSorting,
    removeBookmark,
    toggleBookmarkMonitoring,
    getBookmarkStats,
  } = useBookmarkStore();

  // 필터링 및 정렬된 북마크 목록 계산
  const filteredBookmarks = useMemo(() => {
    const filtered = bookmarks.filter((bookmark) => {
      const matchesType =
        filters.type === "전체" || bookmark.type === filters.type;
      const matchesCategory =
        filters.category === "전체" || bookmark.category === filters.category;
      const matchesMonitoring =
        filters.isMonitored === null ||
        bookmark.isMonitored === filters.isMonitored;
      const matchesSearch =
        !filters.searchQuery ||
        bookmark.title
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        bookmark.summary
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        bookmark.tags.some((tag) =>
          tag.toLowerCase().includes(filters.searchQuery.toLowerCase()),
        );

      return (
        matchesType && matchesCategory && matchesMonitoring && matchesSearch
      );
    });

    // 정렬 적용
    filtered.sort((a, b) => {
      let result = 0;

      switch (sortBy) {
        case "createdAt":
          result =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "updatedAt":
          result =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case "title":
          result = a.title.localeCompare(b.title);
          break;
        case "type":
          result = a.type.localeCompare(b.type);
          break;
        default:
          return 0;
      }

      return sortOrder === "desc" ? -result : result;
    });

    return filtered;
  }, [bookmarks, filters, sortBy, sortOrder]);

  // 통계 정보
  const stats = getBookmarkStats();

  // 핸들러 함수들
  const handleRemoveBookmark = (id: string) => {
    removeBookmark(id);
  };

  const handleToggleMonitoring = (id: string) => {
    toggleBookmarkMonitoring(id);
  };

  const handleViewDetail = (bookmark: any) => {
    // TODO: 상세 페이지로 이동 또는 모달 표시
    console.log("북마크 상세 보기:", bookmark);
  };

  const handleSortToggle = () => {
    const nextSort =
      sortBy === "createdAt"
        ? "title"
        : sortBy === "title"
          ? "type"
          : "createdAt";
    setSorting(nextSort, sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">북마크 관리</h1>
          <p className="text-gray-600">
            저장된 북마크를 관리하고 모니터링을 설정하세요
          </p>
        </div>
        <Button className="bg-brand-700 hover:bg-brand-800">
          <Plus className="mr-2 h-4 w-4" />새 북마크 추가
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-brand-700">
            <Filter className="h-5 w-5" />
            검색 및 필터
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 검색 바 */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="북마크 검색..."
              value={filters.searchQuery}
              onChange={(e) => setFilter("searchQuery", e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* 필터 버튼 */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                "전체",
                "규제",
                "HS Code",
                "통계",
                "뉴스",
                "화물추적",
                "분석결과",
              ] as const
            ).map((type) => (
              <Button
                key={type}
                variant={filters.type === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("type", type)}
                className={
                  filters.type === type ? "bg-brand-700 hover:bg-brand-800" : ""
                }
              >
                {type}
              </Button>
            ))}
          </div>

          {/* 정렬 옵션 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">정렬:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSortToggle}
              className="flex items-center gap-1"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortBy === "createdAt"
                ? "생성일순"
                : sortBy === "updatedAt"
                  ? "수정일순"
                  : sortBy === "title"
                    ? "제목순"
                    : "유형순"}
              {sortOrder === "desc" ? " (최신순)" : " (오래된순)"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 북마크 목록 */}
      <div className="space-y-4">
        {filteredBookmarks.map((bookmark) => (
          <Card
            key={bookmark.id}
            className="shadow-lg transition-all hover:shadow-xl"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="mb-2 text-lg text-gray-800">
                    {bookmark.title}
                  </CardTitle>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge variant="outline">{bookmark.type}</Badge>
                    <Badge variant="outline">{bookmark.category}</Badge>
                    {bookmark.isMonitored && (
                      <Badge className="bg-green-100 text-green-800">
                        모니터링 중
                      </Badge>
                    )}
                    {bookmark.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="mb-2 text-sm text-gray-500">
                    <Calendar className="mr-1 inline h-4 w-4" />
                    {new Date(bookmark.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                  <BookmarkIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">{bookmark.summary}</p>

              {/* 액션 버튼 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetail(bookmark)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    상세 보기
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleMonitoring(bookmark.id)}
                    className="flex items-center gap-1"
                  >
                    <Settings className="h-4 w-4" />
                    {bookmark.isMonitored ? "모니터링 해제" : "모니터링 설정"}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBookmark(bookmark.id)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 빈 상태 메시지 */}
      {filteredBookmarks.length === 0 && (
        <Card className="shadow-lg">
          <CardContent className="py-12 text-center">
            <BookmarkIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">
              {filters.searchQuery || filters.type !== "전체"
                ? "검색 결과가 없습니다"
                : "아직 북마크가 없습니다"}
            </h3>
            <p className="mb-6 text-gray-600">
              {filters.searchQuery || filters.type !== "전체"
                ? "다른 검색어나 필터를 시도해보세요"
                : "관심 있는 콘텐츠를 북마크하여 나중에 쉽게 찾아보세요"}
            </p>
            {!filters.searchQuery && filters.type === "전체" && (
              <Button className="bg-brand-700 hover:bg-brand-800">
                콘텐츠 둘러보기
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* 통계 정보 */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-brand-700">북마크 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-700">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">전체 북마크</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.monitored}
              </div>
              <div className="text-sm text-gray-600">모니터링 중</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.byType["HS Code"]}
              </div>
              <div className="text-sm text-gray-600">HS Code</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.byType["규제"]}
              </div>
              <div className="text-sm text-gray-600">규제 정보</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
