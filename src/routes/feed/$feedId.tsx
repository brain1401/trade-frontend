import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  Info,
  Tag,
  Target,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import type { Content as FeedContent } from "@/lib/api/feed/types";

export const Route = createFileRoute("/feed/$feedId")({
  validateSearch: (search: Record<string, unknown>): { feed: FeedContent } => {
    return {
      feed: search.feed as FeedContent,
    };
  },
  component: FeedDetailPage,
});

// 중요도 스타일 헬퍼 함수
const getImportanceStyles = (importance: string) => {
  switch (importance) {
    case "HIGH":
      return {
        Icon: ShieldAlert,
        badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
        iconClass: "text-destructive",
        label: "높음",
      };
    case "MEDIUM":
      return {
        Icon: ShieldAlert,
        badgeClass: "bg-yellow-400/10 text-yellow-600 border-yellow-400/20",
        iconClass: "text-yellow-600",
        label: "보통",
      };
    default:
      return {
        Icon: Info,
        badgeClass: "bg-blue-400/10 text-blue-600 border-blue-400/20",
        iconClass: "text-blue-600",
        label: "낮음",
      };
  }
};

/**
 * feedType을 한글로 변환하는 함수
 */
const getFeedTypeLabel = (feedType: string): string => {
  switch (feedType) {
    case "HS_CODE_TARIFF_CHANGE":
      return "HS코드 관세율 변경";
    case "HS_CODE_REGULATION_UPDATE":
      return "HS코드 규제 업데이트";
    case "CARGO_STATUS_UPDATE":
      return "화물 상태 업데이트";
    case "TRADE_NEWS":
      return "무역 뉴스";
    case "POLICY_UPDATE":
      return "정책 업데이트";
    default:
      return feedType; // 일치하는 항목이 없으면 원본 값 반환
  }
};

/**
 * targetType을 한글로 변환하는 함수
 */
const getTargetTypeLabel = (targetType: string): string => {
  switch (targetType) {
    case "HS_CODE":
      return "HS코드";
    case "CARGO":
      return "화물";
    default:
      return targetType;
  }
};

// 피드 상세 페이지 컴포넌트
function FeedDetailPage() {
  const { feed } = useSearch({ from: Route.id });
  const importanceStyles = getImportanceStyles(feed?.importance);

  if (!feed) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h2 className="text-xl font-bold">피드 정보를 찾을 수 없습니다.</h2>
          <p className="mt-2 text-muted-foreground">
            요청하신 정보가 존재하지 않거나 잘못된 접근입니다.
          </p>
          <Link to="/dashboard" className="mt-6 inline-block">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              대시보드로 돌아가기
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50">
      <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
        <header className="space-y-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            대시보드로 돌아가기
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            {feed.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(feed.createdAt).toLocaleDateString("ko-KR")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <importanceStyles.Icon
                className={`h-4 w-4 ${importanceStyles.iconClass}`}
              />
              <Badge variant="outline" className={importanceStyles.badgeClass}>
                중요도: {importanceStyles.label}
              </Badge>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>상세 내용</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none text-base text-gray-800">
                <p>{feed.content}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>핵심 정보</CardTitle>
                <CardDescription>
                  이 피드의 주요 메타데이터입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Info className="mt-1 mr-3 h-5 w-5 flex-shrink-0 text-sky-500" />
                  <div>
                    <p className="font-semibold">피드 타입</p>
                    <p className="text-muted-foreground">
                      {getFeedTypeLabel(feed.feedType)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Tag className="mt-1 mr-3 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <div>
                    <p className="font-semibold">대상 종류</p>
                    <p className="text-muted-foreground">
                      {getTargetTypeLabel(feed.targetType)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="mt-1 mr-3 h-5 w-5 flex-shrink-0 text-amber-500" />
                  <div>
                    <p className="font-semibold">대상 값</p>
                    <p className="break-all text-muted-foreground">
                      {feed.targetValue}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {feed.sourceUrl && (
              <a
                href={feed.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full" size="lg">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  원본 출처 바로가기
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
