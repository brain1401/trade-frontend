import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Send,
  Bot,
  User,
  Sparkles,
  Camera,
  FileText,
} from "lucide-react";
import { useAnalysisStore } from "@/stores/analysisStore";
import { useHsCodeAnalysis } from "@/hooks/api/hscode/useHsCodeAnalysis";
import type { ChatMessage } from "@/types/domain/ai";

type AnalysisChatProps = {
  sessionId: string;
  messages: ChatMessage[];
  loading?: boolean;
  onSendMessage: (content: string, attachments?: File[]) => void;
  onUploadImage: (file: File) => void;
};

export function AnalysisChat({
  sessionId,
  messages,
  loading = false,
  onSendMessage,
  onUploadImage,
}: AnalysisChatProps) {
  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSend = () => {
    if (!input.trim() && selectedFiles.length === 0) return;

    onSendMessage(input, selectedFiles);
    setInput("");
    setSelectedFiles([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  return (
    <div className="flex h-96 flex-col rounded-lg border bg-card shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-neutral-800">
            Claude AI 분석 세션
          </h3>
        </div>
        <div className="text-xs text-neutral-500">
          세션 ID: {sessionId.slice(0, 8)}...
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="py-8 text-center">
            <Bot className="mx-auto mb-3 h-12 w-12 text-neutral-300" />
            <p className="mb-2 text-neutral-500">
              Claude AI와 대화를 시작하세요
            </p>
            <p className="text-xs text-neutral-400">
              제품에 대해 설명하거나 이미지를 업로드해 주세요
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))
        )}

        {loading && (
          <div className="flex items-center gap-2 text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Claude가 분석 중입니다...</span>
          </div>
        )}
      </div>

      {/* 파일 미리보기 */}
      {selectedFiles.length > 0 && (
        <div className="border-t p-3">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded bg-neutral-100 px-2 py-1 text-xs"
              >
                {file.type.startsWith("image/") ? (
                  <Camera size={12} />
                ) : (
                  <FileText size={12} />
                )}
                <span className="max-w-20 truncate">{file.name}</span>
                <button
                  onClick={() =>
                    setSelectedFiles((prev) =>
                      prev.filter((_, i) => i !== index),
                    )
                  }
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="제품에 대해 설명해 주세요..."
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button variant="outline" size="sm" asChild className="h-auto p-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Camera size={16} />
              </label>
            </Button>

            <Button
              onClick={handleSend}
              disabled={
                loading || (!input.trim() && selectedFiles.length === 0)
              }
              size="sm"
              className="h-auto p-2"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessageItem({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-primary-100" : "bg-neutral-100"
        }`}
      >
        {isUser ? (
          <User size={16} className="text-primary-600" />
        ) : (
          <Bot size={16} className="text-neutral-600" />
        )}
      </div>

      <div
        className={`max-w-xs flex-1 lg:max-w-md ${isUser ? "text-right" : ""}`}
      >
        <div
          className={`rounded-lg p-3 ${
            isUser
              ? "ml-auto bg-primary-600 text-white"
              : "bg-neutral-100 text-neutral-800"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="text-xs opacity-75">
                  📎 {attachment.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className={`mt-1 text-xs text-neutral-500 ${isUser ? "text-right" : ""}`}
        >
          {message.timestamp.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
