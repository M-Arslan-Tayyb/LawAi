"use client"

import type React from "react"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ScalesIcon } from "@/lib/icons"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          {/* Scales of Justice */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 animate-pulse bg-primary/20 blur-3xl rounded-full" />
            <div className="relative p-8 rounded-full bg-primary/10 border border-primary/20">
              <ScalesIcon size={80} className="text-primary" />
            </div>
          </div>

          {/* Quote */}
          <blockquote className="max-w-md text-center">
            <p className="text-2xl font-serif text-foreground mb-4 leading-relaxed">
              "Justice is the constant and perpetual will to render to every man his due."
            </p>
            <footer className="text-muted-foreground">— Justinian I</footer>
          </blockquote>

          {/* Features List */}
          <div className="mt-12 grid grid-cols-2 gap-4 max-w-md">
            {["AI Document Analysis", "Smart Contract Drafting", "Legal Summarization", "Secure & Private"].map(
              (feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{feature}</span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col lg:w-1/2">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <Logo size="sm" />
          <ThemeToggle />
        </header>

        {/* Form Container */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            {/* Title */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 font-serif text-3xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>

            {/* Form */}
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LexMind AI. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
