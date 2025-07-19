import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import { chatHistoryApi } from "@/lib/api";
import { InitialChatInput } from "@/components/search/InitialChatInput";
import { toast } from "sonner";
import { createNewChat } from "@/lib/utils/chat/createNewChat";
import { useChatState } from "@/stores/chatStore";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { user } = useAuth();
  const { setMessage, setIsNew } = useChatState();

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center space-y-8 px-4 py-8 sm:py-12",
      )}
    >
      {user ? (
        <div className="flex-shrink-0 text-center">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-3xl font-bold text-neutral-800 sm:text-4xl">
              안녕하세요, {user.name}님
            </h1>
            <Badge
              variant="secondary"
              className="border border-green-200 bg-green-100 text-green-800"
            >
              <User className="mr-1 h-3 w-3" />
              로그인됨
            </Badge>
          </div>
        </div>
      ) : (
        <h1 className="text-3xl font-bold text-neutral-800 sm:text-4xl">
          AI 무역 정보 플랫폼
        </h1>
      )}
      <div className={cn("min-h-0 w-full max-w-3xl")}>
        <InitialChatInput
          onSendButtonClick={(message) => {
            createNewChat(() => {
              setMessage(message);
              setIsNew(true);
            });
          }}
        />
      </div>
    </div>
  );
}
