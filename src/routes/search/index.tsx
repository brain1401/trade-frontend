import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ContentCard from "@/components/common/ContentCard";
import {
  Search,
  Clock,
  ChevronRight,
  FileText,
  Globe,
  AlertTriangle,
  TrendingUp,
  BookOpen,
} from "lucide-react";

export const Route = createFileRoute("/search/")({
  component: SearchIndexPage,
});

// 목업 최근 검색 데이터
const mockSearchHistory = [
  {
    id: "search-001",
    query: "리튬배터리 수입 규제",
    category: "regulation",
    categoryName: "규제",
    timestamp: "2024-01-15T14:30:00Z",
    resultCount: 12,
  },
  {
    id: "search-002",
    query: "화장품 FDA 인증 절차",
    category: "certification",
    categoryName: "인증",
    timestamp: "2024-01-15T10:15:00Z",
    resultCount: 8,
  },
  {
    id: "search-003",
    query: "2024년 관세율 변경사항",
    category: "news",
    categoryName: "뉴스",
    timestamp: "2024-01-14T16:45:00Z",
    resultCount: 15,
  },
];

// 인기 검색어
const popularSearches = [
  "리튬배터리 수입 규제",
  "화장품 FDA 인증",
  "2024 관세율 변경",
  "플라스틱 포장재 규제",
  "전자제품 KC 인증",
  "의약품 수입 허가",
];

// 검색 카테고리
const searchCategories = [
  {
    id: "regulation",
    name: "규제 정보",
    description: "수출입 규제 및 제한사항",
    icon: AlertTriangle,
    color: "text-warning-500",
    bgColor: "bg-warning-50",
  },
  {
    id: "certification",
    name: "인증 정보",
    description: "KC, FDA 등 각종 인증 절차",
    icon: FileText,
    color: "text-info-500",
    bgColor: "bg-info-50",
  },
  {
    id: "news",
    name: "뉴스 및 동향",
    description: "최신 무역 뉴스 및 시장 동향",
    icon: TrendingUp,
    color: "text-success-500",
    bgColor: "bg-success-50",
  },
  {
    id: "guide",
    name: "가이드",
    description: "수출입 절차 및 실무 가이드",
    icon: BookOpen,
    color: "text-primary-500",
    bgColor: "bg-primary-50",
  },
];

function SearchIndexPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search/results?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = searchCategories.find((c) => c.id === categoryId);
    return category ? category.name : "일반";
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">정보 검색</h1>
        <p className="text-neutral-600">
          무역 관련 규제, 뉴스, 인증 정보를 AI 기반으로 검색하세요
        </p>
      </div>

      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3">
          {/* 검색 입력 */}
          <ContentCard title="통합 정보 검색">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="searchQuery"
                  className="text-sm font-medium text-neutral-700"
                >
                  검색어를 입력하세요
                </Label>
                <div className="mt-1 flex space-x-2">
                  <Input
                    id="searchQuery"
                    type="text"
                    placeholder="예: 리튬배터리 수입 규제"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <Search size={16} className="mr-2" />
                    검색
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-neutral-700">
                  인기 검색어
                </Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(search)}
                      className="text-xs"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </ContentCard>

          {/* 검색 카테고리 */}
          <ContentCard title="카테고리별 검색" className="mt-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {searchCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={category.id}
                    className={`cursor-pointer rounded-lg ${category.bgColor} p-4 transition-colors hover:opacity-80`}
                    onClick={() =>
                      (window.location.href = `/search/results?category=${category.id}`)
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full bg-white p-2">
                        <IconComponent size={20} className={category.color} />
                      </div>
                      <div>
                        <h3 className="font-medium text-neutral-800">
                          {category.name}
                        </h3>
                        <p className="text-xs text-neutral-600">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ContentCard>

          {/* 최근 검색 기록 */}
          <ContentCard title="최근 검색 기록" className="mt-8">
            <div className="space-y-4">
              {mockSearchHistory.map((search) => (
                <div
                  key={search.id}
                  className="rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe size={16} className="text-primary-600" />
                      <h3 className="font-medium text-neutral-800">
                        {search.query}
                      </h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {search.categoryName}
                    </Badge>
                  </div>

                  <div className="mb-3 flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-neutral-500">
                        검색 결과: {search.resultCount}건
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} className="text-neutral-400" />
                      <span className="text-xs text-neutral-400">
                        {new Date(search.timestamp).toLocaleString("ko-KR")}
                      </span>
                    </div>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs text-primary-600 hover:underline"
                      onClick={() =>
                        (window.location.href = `/search/results?q=${encodeURIComponent(search.query)}`)
                      }
                    >
                      다시 검색 <ChevronRight size={12} className="ml-0.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        </div>

        <aside className="mt-8 lg:mt-0 lg:w-1/3">
          {/* 검색 가이드 */}
          <ContentCard title="검색 가이드">
            <div className="space-y-3">
              <div className="rounded-lg bg-info-50 p-3">
                <h4 className="mb-1 text-sm font-medium text-info-800">
                  🔍 효과적인 검색 방법
                </h4>
                <ul className="space-y-1 text-xs text-info-700">
                  <li>• 구체적인 키워드 사용</li>
                  <li>• 제품명보다는 일반명 사용</li>
                  <li>• 여러 키워드를 조합하여 검색</li>
                </ul>
              </div>

              <div className="rounded-lg bg-warning-50 p-3">
                <h4 className="mb-1 text-sm font-medium text-warning-800">
                  ⚡ AI 기반 검색
                </h4>
                <p className="text-xs text-warning-700">
                  Claude AI가 웹에서 신뢰할 수 있는 정보를 수집하여 정확한 검색
                  결과를 제공합니다.
                </p>
              </div>
            </div>
          </ContentCard>

          {/* 빠른 링크 */}
          <ContentCard title="빠른 링크" className="mt-8">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  (window.location.href = "/search/results?category=regulation")
                }
              >
                최신 규제 정보
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  (window.location.href = "/search/results?category=news")
                }
              >
                무역 뉴스
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  (window.location.href =
                    "/search/results?category=certification")
                }
              >
                인증 정보
              </Button>
            </div>
          </ContentCard>

          {/* 검색 통계 */}
          <ContentCard title="검색 통계" className="mt-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">2,345</p>
                <p className="text-xs text-neutral-600">총 검색 수</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success-600">1,234</p>
                <p className="text-xs text-neutral-600">유효한 결과</p>
              </div>
            </div>
          </ContentCard>
        </aside>
      </div>
    </div>
  );
}
