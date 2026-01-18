"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SparklesIcon, UserIcon, CopyIcon, CheckIcon } from "@/lib/icons";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { toast } from "sonner";

interface ChatMessageProps {
  message: ChatMessageType;
  className?: string;
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 group",
        isAssistant ? "flex-row" : "flex-row-reverse",
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isAssistant
            ? "bg-primary/10 text-primary"
            : "bg-accent text-foreground"
        )}
      >
        {isAssistant ? <SparklesIcon size={16} /> : <UserIcon size={16} />}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 relative",
          isAssistant
            ? "bg-accent text-foreground rounded-tl-none"
            : "bg-primary text-primary-foreground rounded-tr-none"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-opacity"
          title="Copy message"
        >
          {isCopied ? (
            <CheckIcon size={14} className="text-green-500" />
          ) : (
            <CopyIcon size={14} />
          )}
        </button>
      </div>
    </div>
  );
}
