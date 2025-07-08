import { chatHistoryApi } from "@/lib/api";
import { toast } from "sonner";
import { router } from "@/main";

type CallBack = () => void;
export const createNewChat = async (callback: CallBack) => {
  try {
    // 서버에 새 세션 생성 요청
    const response = await chatHistoryApi.getNewChatSession();
    const { session_uuid } = response;

    const navigate = router.navigate;

    callback();
    console.log("[createNewChat] session_uuid :", session_uuid);

    // 네비게이션 with search params
    await navigate({
      to: "/chat/$session_uuid",
      params: { session_uuid: session_uuid },
      replace: true, // 홈페이지를 히스토리에서 교체
    });
  } catch (error) {
    console.error("채팅 생성 실패:", error);
    toast.error("채팅 생성에 실패했습니다.");
  }
};
