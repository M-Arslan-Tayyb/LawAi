"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import { ROUTES } from "@/lib/constants"
import { ChevronRightIcon, SparklesIcon } from "@/lib/icons"

gsap.registerPlugin(ScrollTrigger)

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 px-6 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div
          ref={contentRef}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-primary/5 p-12 text-center lg:p-16"
        >
          {/* Decorative Elements */}
          <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />

          {/* Content */}
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
              <SparklesIcon size={16} className="animate-pulse" />
              <span>Start Your Free Trial Today</span>
            </div>

            <h2 className="mb-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Ready to transform your <span className="gradient-text">legal practice?</span>
            </h2>

            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of legal professionals who have already revolutionized their workflow with LexMind AI.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={ROUTES.SIGNUP}
                className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-primary"
              >
                Get Started Free
                <ChevronRightIcon size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={ROUTES.LOGIN}
                className="rounded-xl border border-border bg-card px-8 py-4 text-base font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-accent"
              >
                Sign In
              </Link>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">No credit card required · 14-day free trial</p>
          </div>
        </div>
      </div>
    </section>
  )
}
