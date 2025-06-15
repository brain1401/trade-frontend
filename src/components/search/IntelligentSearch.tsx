import React, { useState, useCallback, useEffect } from "react";
import { Search, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useIntelligentSearch,
  type IntentDetectionResult,
} from "@/hooks/api/search/useIntentDetection";
import { useSearchStore } from "@/stores/searchStore";
import { cn } from "@/lib/utils";

type IntelligentSearchProps = {
  onSearch?: (result: IntentDetectionResult) => void;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
};

export const IntelligentSearch: React.FC<IntelligentSearchProps> = ({
  onSearch,
  className,
  placeholder = "제품을 설명하거나 HS Code, 화물번호를 입력하세요...",
  autoFocus = false,
}) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const searchStore = useSearchStore();
  const { performSearch, isDetecting, error } = useIntelligentSearch();

  // 검색 제안 디바운스 - 함수 의존성 완전 제거
  useEffect(() => {
    if (query.length >= 2) {
      const timeoutId = setTimeout(() => {
        try {
          // Mock 제안어 생성 - 함수 호출 없이 직접 처리
          const mockSuggestions = [
            "스마트폰 HS Code 분석",
            "전자제품 수출 요구사항",
            "화학물질 안전성 확인서",
            "의료기기 인증 절차",
            "농산물 검역 증명서",
            "섬유제품 품질 기준",
            "기계부품 안전 규격",
            "화장품 성분 검사",
          ].filter((suggestion) =>
            suggestion.toLowerCase().includes(query.toLowerCase()),
          );

          setSuggestions(mockSuggestions.slice(0, 5)); // 최대 5개만 표시
          setShowSuggestions(mockSuggestions.length > 0);
        } catch (error) {
          console.error("Failed to generate suggestions:", error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]); // query만 의존성으로 설정 - 함수 의존성 완전 제거

  // 검색 실행
  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      try {
        const result = await performSearch(searchQuery);
        onSearch?.(result);
        setShowSuggestions(false);
      } catch (err) {
        console.error("Search failed:", err);
      }
    },
    [performSearch, onSearch],
  );

  // 폼 제출 처리
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSearch(query);
    },
    [handleSearch, query],
  );

  // 제안어 선택 처리
  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      handleSearch(suggestion);
    },
    [handleSearch],
  );

  // 입력 필드 변경 처리 - searchStore 의존성 제거
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      // 직접 호출로 의존성 문제 해결
      useSearchStore.getState().setQuery(value);
    },
    [], // 의존성 배열 비움
  );

  // 포커스 관리
  const handleInputFocus = useCallback(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [suggestions.length]);

  const handleInputBlur = useCallback(() => {
    // 약간의 지연을 주어 제안어 클릭이 가능하도록 함
    setTimeout(() => setShowSuggestions(false), 200);
  }, []);

  return (
    <div className={cn("relative mx-auto w-full max-w-2xl", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />

          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={isDetecting}
            className={cn(
              "h-12 pr-20 pl-10 text-base",
              "focus:border-transparent focus:ring-2 focus:ring-blue-500",
              isDetecting && "opacity-50",
            )}
          />

          <div className="absolute top-1/2 right-2 flex -translate-y-1/2 transform items-center gap-2">
            {isDetecting ? (
              <div className="flex items-center gap-1 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs font-medium">분석 중...</span>
              </div>
            ) : (
              <Button
                type="submit"
                size="sm"
                disabled={!query.trim() || isDetecting}
                className="h-8 px-3"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                분석
              </Button>
            )}
          </div>
        </div>

        {/* AI 의도 감지 상태 표시 */}
        {searchStore.detectedIntent && !isDetecting && (
          <div className="absolute top-full right-0 left-0 z-10 mt-1">
            <Card className="border-blue-200 bg-blue-50 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-700">
                    AI가 감지한 의도:
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {searchStore.detectedIntent === "hscode" && "HS Code 분석"}
                    {searchStore.detectedIntent === "tracking" && "화물 추적"}
                    {searchStore.detectedIntent === "general" && "일반 검색"}
                  </Badge>
                </div>
                <ArrowRight className="h-3 w-3 text-blue-600" />
              </div>
            </Card>
          </div>
        )}

        {/* 검색 제안어 */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full right-0 left-0 z-20 mt-2 shadow-lg">
            <div className="p-2">
              <div className="mb-2 px-2 text-xs text-muted-foreground">
                검색 제안
              </div>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      "w-full rounded px-2 py-1.5 text-left text-sm",
                      "transition-colors hover:bg-muted",
                      "focus:bg-muted focus:outline-none",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-3 w-3 text-muted-foreground" />
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}
      </form>

      {/* 에러 메시지 */}
      {error && (
        <div className="mt-2 text-sm text-destructive">
          {error.message || "검색 중 오류가 발생했습니다."}
        </div>
      )}

      {/* 검색 히스토리 (옵션) */}
      {searchStore.searchHistory.length > 0 && !query && (
        <Card className="mt-2 p-3">
          <div className="mb-2 text-xs text-muted-foreground">최근 검색</div>
          <div className="flex flex-wrap gap-1">
            {searchStore.searchHistory.slice(0, 5).map((historyItem, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer text-xs"
                onClick={() => {
                  const cleanQuery = historyItem.split(" (")[0]; // 의도 표시 제거
                  setQuery(cleanQuery);
                  handleSearch(cleanQuery);
                }}
              >
                {historyItem.split(" (")[0]}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
