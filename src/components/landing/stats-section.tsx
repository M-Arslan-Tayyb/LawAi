"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 50000, suffix: "+", label: "Documents Analyzed" },
  { value: 98, suffix: "%", label: "Accuracy Rate" },
  { value: 500, suffix: "+", label: "Law Firms Trust Us" },
  { value: 10, suffix: "x", label: "Faster Processing" },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = counterRef.current
    if (!element) return

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      onEnter: () => {
        gsap.to(
          {},
          {
            duration: 2,
            ease: "power2.out",
            onUpdate: function () {
              setCount(Math.round(this.progress() * value))
            },
          },
        )
      },
      once: true,
    })

    return () => trigger.kill()
  }, [value])

  return (
    <span ref={counterRef} className="gradient-text">
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 px-6 lg:px-12 border-y border-border bg-accent/30">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 text-4xl font-bold lg:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
