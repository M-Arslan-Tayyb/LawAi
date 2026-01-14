"use client"

import { MaximizeIcon, MinimizeIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

interface FullscreenToggleProps {
  isFullscreen: boolean
  onToggle: () => void
  className?: string
}

export function FullscreenToggle({ isFullscreen, onToggle, className }: FullscreenToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        "text-muted-foreground hover:text-foreground hover:bg-accent",
        className,
      )}
      title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <>
          <MinimizeIcon size={16} />
          <span className="hidden sm:inline">Exit Fullscreen</span>
        </>
      ) : (
        <>
          <MaximizeIcon size={16} />
          <span className="hidden sm:inline">Fullscreen</span>
        </>
      )}
    </button>
  )
}
