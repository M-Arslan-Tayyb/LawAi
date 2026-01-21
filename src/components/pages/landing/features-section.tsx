"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CompareIcon,
  DrafterIcon,
  AnalyzeIcon,
  SummaryIcon,
  SparklesIcon,
  ChevronRightIcon,
} from "@/lib/icons";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: CompareIcon,
    title: "Document Comparison",
    description:
      "Upload and compare legal documents side-by-side. AI identifies differences, similarities, and potential conflicts instantly.",
    href: ROUTES.DOCUMENT_COMPARISON,
    gradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
    iconBg: "bg-amber-500/20",
  },
  {
    icon: DrafterIcon,
    title: "AI Drafter",
    description:
      "Generate professional legal documents from simple prompts. Create contracts, NDAs, and agreements in seconds.",
    href: ROUTES.DRAFTER,
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
    iconBg: "bg-orange-500/20",
  },
  {
    icon: AnalyzeIcon,
    title: "Document Analyzer",
    description:
      "Upload documents and ask questions. Get AI-powered insights and answers based on your specific legal documents.",
    href: ROUTES.DOCUMENT_ANALYZER,
    gradient: "from-yellow-500/20 via-amber-500/10 to-transparent",
    iconBg: "bg-yellow-500/20",
  },
  {
    icon: SummaryIcon,
    title: "Document Summarizer",
    description:
      "Transform lengthy legal documents into concise summaries. Extract key points and critical information effortlessly.",
    href: ROUTES.DOCUMENT_SUMMARIZER,
    gradient: "from-amber-600/20 via-yellow-500/10 to-transparent",
    iconBg: "bg-amber-600/20",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-12 "
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
            <SparklesIcon size={16} />
            <span>Powerful Features</span>
          </div>
          <h2 className="mb-4 font-serif text-2xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Everything you need for{" "}
            <span className="gradient-text">legal excellence</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground">
            Streamline your legal workflow with our comprehensive suite of
            AI-powered tools designed for modern legal professionals.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              href={feature.href}
              style={{ alignItems: "stretch" }}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className=" group relative overflow-hidden rounded-2xl feature-card-gradient p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              {/* Top glow line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Icon */}
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${feature.iconBg} text-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20`}
              >
                <feature.icon size={28} />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold text-black group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Arrow indicator */}
              <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                <span>Explore</span>
                <ChevronRightIcon
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>

              {/* Corner decorative element */}
              <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10 group-hover:scale-150" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
