"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SparklesIcon, UserIcon, CopyIcon, CheckIcon } from "@/lib/icons";
import type { ChatMessage as ChatMessageType } from "@/types";
import { toast } from "sonner";
import { ReactNode } from "react";

interface ChatMessageProps {
  message: ChatMessageType;
  className?: string;
  children?: ReactNode;
}

export function ChatMessage({
  message,
  className,
  children,
}: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        "flex gap-3 group",
        isAssistant ? "flex-row" : "flex-row-reverse",
        className,
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isAssistant
            ? "bg-primary/10 text-primary"
            : "bg-accent text-foreground",
        )}
      >
        {isAssistant ? <SparklesIcon size={16} /> : <UserIcon size={16} />}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          "relative max-w-[80%] rounded-2xl px-4 py-3",
          isAssistant
            ? "bg-accent text-foreground rounded-tl-none"
            : "bg-primary/20 text-primary-foreground rounded-tr-none",
        )}
      >
        {children ? (
          children
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
            {message.content}
          </p>
        )}

        {isAssistant && (
          <button
            onClick={handleCopy}
            className="ml-auto flex items-end rounded-md p-1.5 transition-opacity hover:bg-black/10 dark:hover:bg-white/10"
            title="Copy"
          >
            {isCopied ? (
              <CheckIcon size={14} className="text-green-500" />
            ) : (
              <CopyIcon size={14} className="text-muted-foreground" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
