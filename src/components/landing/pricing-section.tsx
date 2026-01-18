"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { SparklesIcon, CheckIcon } from "@/lib/icons";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    id: "free",
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Limited access to all modules",
      "5 document analyses per month",
      "Basic document comparison",
      "Standard AI responses",
      "Community support",
    ],
    popular: false,
    gradient: "from-gray-500/20 via-gray-400/10 to-transparent",
    borderColor: "border-gray-500/30",
    buttonVariant: "outline" as const,
  },
  {
    id: "personal",
    name: "Personal",
    price: "£29",
    period: "per month",
    description: "For individual legal professionals",
    features: [
      "Unlimited access to all modules",
      "Unlimited document analyses",
      "Advanced document comparison",
      "Priority AI responses",
      "Email support",
      "Export reports",
      "Document history",
    ],
    popular: true,
    gradient: "from-primary/20 via-amber-500/10 to-transparent",
    borderColor: "border-primary/50",
    buttonVariant: "default" as const,
  },
  {
    id: "business",
    name: "Business",
    price: "£99",
    period: "per month",
    description: "For teams & companies",
    features: [
      "Everything in Personal",
      "Team collaboration",
      "Shared workspaces",
      "Advanced analytics",
      "Priority support",
      "Custom integrations",
      "Dedicated account manager",
    ],
    popular: false,
    gradient: "from-amber-600/20 via-yellow-500/10 to-transparent",
    borderColor: "border-amber-500/30",
    buttonVariant: "outline" as const,
  },
];
console.log(plans);

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
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

  const handleSelectPlan = (planId: string) => {
    // Redirect to signin page
    router.push(`${ROUTES.LOGIN}?plan=${planId}`);
  };

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-12"
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
            <span>Pricing & Plans</span>
          </div>
          <h2 className="mb-4 font-serif text-2xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Choose the perfect plan for{" "}
            <span className="gradient-text">your needs</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground">
            Flexible pricing options designed to scale with your legal practice.
            All prices are in British Pounds (£).
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1",
                plan.popular
                  ? "border-primary/50 shadow-lg shadow-primary/10 scale-105"
                  : plan.borderColor
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute right-0 top-0 rounded-bl-xl rounded-tr-2xl bg-gradient-to-r from-primary to-amber-500 px-4 py-1.5 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}

              {/* Gradient overlay */}
              <div
                className={cn(
                  "absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  plan.gradient
                )}
              />

              {/* Top glow line */}
              {plan.popular && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              )}

              {/* Content */}
              <div className="relative z-10">
                {/* Plan Name & Description */}
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    {plan.price !== "£0" && (
                      <span className="text-sm text-muted-foreground">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  {plan.price === "£0" && (
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckIcon size={12} />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  variant={plan.popular ? "default" : plan.buttonVariant}
                  className={cn(
                    "w-full h-12 text-base font-semibold transition-all",
                    plan.popular && "glow-primary-hover"
                  )}
                >
                  {plan.price === "£0" ? "Get Started" : "Choose Plan"}
                </Button>
              </div>

              {/* Corner decorative element */}
              <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10 group-hover:scale-150" />
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
