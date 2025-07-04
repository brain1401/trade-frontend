import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { chatHistoryQueries } from "@/lib/api/chat/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatMessage as ChatMessageDisplay } from "@/components/search/ChatMessage"; // 기존 컴포넌트 재사용
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/dashboard/history/$sessionId")({
  component: ChatDetailPage,
});

function ChatDetailPage() {
  const { sessionId } = Route.useParams();
  const {
    data: sessionDetail,
    isLoading,
    isError,
  } = useQuery(chatHistoryQueries.detail(sessionId));

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-4 py-8">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-8 w-1/2" />
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !sessionDetail) {
    return (
      <div className="container mx-auto py-8">
        채팅 내역을 불러오는 데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="container mx-auto flex h-full flex-col py-8">
      <div className="mb-6">
        <Link
          to="/dashboard/history"
          className="flex items-center text-sm text-neutral-600 hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로가기
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">
          {sessionDetail.sessionInfo.sessionTitle}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto rounded-md border bg-white">
        {sessionDetail.messages.map((message) => (
          <ChatMessageDisplay
            key={message.messageId}
            type={message.messageType.toLowerCase() as "user" | "ai"}
            data={{ content: message.content }}
            timestamp={message.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
