"use client"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  className?: string
  href?: string
}

export function Logo({ size = "md", showIcon = true, className, href = "/" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  }

  const iconSizes = {
    sm: 20,
    md: 26,
    lg: 36,
  }

  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      {showIcon && (
        <div className="relative flex items-center justify-center">
          {/* Premium icon with glow effect */}
          <svg
            width={iconSizes[size]}
            height={iconSizes[size]}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            {/* Outer ring */}
            <circle cx="16" cy="16" r="14" stroke="url(#logoGradient)" strokeWidth="2" />
            {/* Scales of justice */}
            <path
              d="M16 6V26M10 10L22 10M7 16L13 16M19 16L25 16M10 10L7 16M22 10L25 16M10 10L13 16M22 10L19 16"
              stroke="url(#logoGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Balance pans */}
            <ellipse cx="10" cy="17" rx="3.5" ry="1.5" stroke="url(#logoGradient)" strokeWidth="1.5" />
            <ellipse cx="22" cy="17" rx="3.5" ry="1.5" stroke="url(#logoGradient)" strokeWidth="1.5" />
            <defs>
              <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#d4af37" />
                <stop offset="0.5" stopColor="#f4e4a6" />
                <stop offset="1" stopColor="#c9a227" />
              </linearGradient>
            </defs>
          </svg>
          {/* Glow effect */}
          <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-primary/30 blur-lg" />
        </div>
      )}
      <div className="flex items-baseline gap-0.5">
        <span
          className={cn("font-bold tracking-tight font-serif", sizeClasses[size])}
          style={{
            background: "linear-gradient(135deg, #d4af37 0%, #f4e4a6 40%, #c9a227 70%, #b8860b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 30px rgba(201, 162, 39, 0.3)",
          }}
        >
          LexMind
        </span>
        <span
          className={cn("font-medium", sizeClasses[size])}
          style={{
            background: "linear-gradient(135deg, #a0a0a0 0%, #d0d0d0 50%, #a0a0a0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          AI
        </span>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
