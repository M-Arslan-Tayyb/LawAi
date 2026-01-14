"use client"

import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ChevronRightIcon, SparklesIcon } from "@/lib/icons"

interface ModuleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  className?: string
}

export function ModuleCard({ title, description, icon, href, className }: ModuleCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 transition-all",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
        className,
      )}
    >
      {/* AI Glow Effect */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />

      {/* Icon */}
      <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
        {icon}
        <SparklesIcon
          size={12}
          className="absolute -right-1 -top-1 text-primary opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>

      {/* Content */}
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-4 flex-1 text-sm text-muted-foreground">{description}</p>

      {/* CTA */}
      <div className="flex items-center gap-1 text-sm font-medium text-primary">
        <span>Get Started</span>
        <ChevronRightIcon size={16} className="transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
