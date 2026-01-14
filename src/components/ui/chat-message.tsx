"use client"
import { cn } from "@/lib/utils"
import { SparklesIcon, UserIcon } from "@/lib/icons"
import type { ChatMessage as ChatMessageType } from "@/lib/types"

interface ChatMessageProps {
  message: ChatMessageType
  className?: string
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  const isAssistant = message.role === "assistant"

  return (
    <div className={cn("flex gap-3", isAssistant ? "flex-row" : "flex-row-reverse", className)}>
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isAssistant ? "bg-primary/10 text-primary" : "bg-accent text-foreground",
        )}
      >
        {isAssistant ? <SparklesIcon size={16} /> : <UserIcon size={16} />}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isAssistant
            ? "bg-accent text-foreground rounded-tl-none"
            : "bg-primary text-primary-foreground rounded-tr-none",
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  )
}
