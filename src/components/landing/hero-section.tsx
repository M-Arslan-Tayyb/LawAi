"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SparklesIcon, ChevronRightIcon } from "@/lib/icons"
import { ROUTES, APP_TAGLINE } from "@/lib/constants"

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, subtitleRef.current, ctaRef.current, badgeRef.current], {
        opacity: 0,
        y: 30,
      })

      const tl = gsap.timeline({ delay: 0.5 })

      tl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3",
        )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-12">
        <Logo size="md" />
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Link
            href={ROUTES.LOGIN}
            className="hidden sm:flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/60 hover:bg-primary/10"
          >
            Sign In
          </Link>
          <Link
            href={ROUTES.SIGNUP}
            className="rounded-xl bg-gradient-to-r from-primary to-amber-500 px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary shadow-lg shadow-primary/20"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-6 text-center pb-32">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="mb-6 flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary backdrop-blur-sm"
        >
          <SparklesIcon size={16} className="animate-pulse" />
          <span>AI-Powered Legal Intelligence</span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="mb-6 max-w-4xl font-serif text-3xl font-bold tracking-tight sm:text-5xl lg:text-7xl"
        >
          <span className="text-foreground">{APP_TAGLINE.split(" ").slice(0, -2).join(" ")} </span>
          <span className="gradient-text">AI Counsel</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mb-10 max-w-2xl text-base sm:text-lg text-muted-foreground lg:text-xl leading-relaxed"
        >
          Transform your legal workflow with intelligent document analysis, AI-powered drafting, and seamless contract
          comparison. Built for modern legal professionals.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col gap-4 sm:flex-row">
          <Link
            href={ROUTES.SIGNUP}
            className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-amber-500 px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:opacity-90 shadow-xl shadow-primary/25"
          >
            Start Free Trial
            <ChevronRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#features"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 backdrop-blur-sm px-8 py-4 text-base font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-accent"
          >
            View Features
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">Trusted by leading law firms</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 opacity-50">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">Baker & Associates</div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">Sterling Legal</div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">Morrison Law</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
          <div className="h-10 w-6 rounded-full border-2 border-muted-foreground/30 p-1.5">
            <div className="h-2 w-full animate-bounce rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </section>
  )
}
