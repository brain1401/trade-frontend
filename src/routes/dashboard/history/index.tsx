import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { chatHistoryQueries } from "@/lib/api/chat/queries";
import { format } from "date-fns";
import { MessageSquare, Calendar } from "lucide-react";

export const Route = createFileRoute("/dashboard/history/")({
  component: ChatHistoryPage,
});

function ChatHistoryPage() {
  const {
    data: history,
    isLoading,
    isError,
  } = useQuery(chatHistoryQueries.list());

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-4 py-8">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !history) {
    return (
      <div className="container mx-auto py-8">
        채팅 내역을 불러오는 데 실패했습니다.
      </div>
    );
  }

  const histories = history.content;

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          최근 채팅 내역
        </h1>
        <p className="mt-2 text-neutral-600">
          이전 대화 내용을 다시 확인해 보세요.
        </p>
      </div>

      {histories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p>아직 채팅 내역이 없습니다.</p>
            <Link to="/search">
              <Button className="mt-4">채팅 시작하기</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {histories.map((history) => (
            <Link
              key={history.sessionId}
              to="/chat/$session_uuid"
              params={{ session_uuid: history.sessionId }}
              className="block"
            >
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {history.sessionTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm text-neutral-500">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{history.messageCount}개의 메시지</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      마지막 활동:{" "}
                      {format(new Date(history.updatedAt), "yyyy-MM-dd HH:mm")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
