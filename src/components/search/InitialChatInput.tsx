import { ChatInput } from "./ChatInput";

type InitialChatInputProps = {
  onSendButtonClick: (message: string) => void;
  isLoading?: boolean;
};
export function InitialChatInput({
  onSendButtonClick,
  isLoading = false,
}: InitialChatInputProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <div className="w-full">
          <ChatInput onSendMessage={onSendButtonClick} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
