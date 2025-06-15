import React from "react";
import { useToast } from "@/hooks/common/useToast";

export const Toaster = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed right-4 bottom-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border p-4 shadow-lg transition-all duration-300 ${
            toast.variant === "destructive"
              ? "text-destructive-foreground border-destructive bg-destructive"
              : "border-border bg-background text-foreground"
          } `}
        >
          {toast.title && (
            <div className="mb-1 font-semibold">{toast.title}</div>
          )}
          {toast.description && (
            <div className="text-sm">{toast.description}</div>
          )}
          {toast.action && <div className="mt-2">{toast.action}</div>}
        </div>
      ))}
    </div>
  );
};
