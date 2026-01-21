"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { SendIcon, SparklesIcon } from "@/lib/icons"

interface AiChatInputProps {
  onSend?: (message: string) => void
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  className?: string
}

export function AiChatInput({
  onSend,
  placeholder = "Ask about your documents...",
  disabled = false,
  isLoading = false,
  className,
}: AiChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled && !isLoading) {
      onSend?.(message.trim())
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative flex items-center">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <SparklesIcon
            size={18}
            className={cn("transition-colors", isLoading ? "animate-pulse text-primary" : "text-muted-foreground")}
          />
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className={cn(
            "w-full rounded-xl border border-border bg-background py-4 pl-12 pr-14 text-sm text-foreground",
            "placeholder:text-muted-foreground",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all",
          )}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled || isLoading}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-all",
            message.trim() && !disabled && !isLoading
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground",
          )}
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <SendIcon size={16} />
          )}
        </button>
      </div>
    </form>
  )
}
