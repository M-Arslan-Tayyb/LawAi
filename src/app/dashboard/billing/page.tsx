"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notification } from "antd";
import { CreditCardIcon, CheckIcon, SparklesIcon } from "@/lib/icons";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

// Mock current subscription
const currentSubscription = {
  plan: "free",
  status: "active",
  nextBillingDate: null,
  cancelAtPeriodEnd: false,
};

console.log(currentSubscription);
export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a plan parameter in URL (from landing page)
    const planParam = searchParams.get("plan");
    if (planParam) {
      setSelectedPlan(planParam);
    }
  }, [searchParams]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);

    // Show notification
    notification.success({
      message: "Subscription Successful",
      description: `You have successfully subscribed to the ${
        plans.find((p) => p.id === planId)?.name
      } plan.`,
      placement: "topRight",
      duration: 3,
    });

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push(ROUTES.DASHBOARD);
    }, 1500);
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCardIcon size={20} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Payment & Billings
          </h1>
        </div>
        <p className="text-base text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Subscription Card */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Current Subscription
            </h2>
            <p className="text-sm text-muted-foreground">
              Your active plan and billing details
            </p>
          </div>
          <div className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
            Active
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Plan</p>
            <p className="text-base font-semibold text-foreground capitalize">
              {currentSubscription.plan}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <p className="text-base font-semibold text-foreground capitalize">
              {currentSubscription.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Next Billing Date
            </p>
            <p className="text-base font-semibold text-foreground">
              {currentSubscription.nextBillingDate || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-2">
          <SparklesIcon size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Available Plans
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Choose a plan that best fits your needs. All prices are in British
          Pounds (£).
        </p>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1",
                plan.popular
                  ? "border-primary/50 shadow-lg shadow-primary/10 scale-105"
                  : plan.borderColor,
                currentSubscription.plan === plan.id && "ring-2 ring-primary/50"
              )}
            >
              {/* Current Plan Badge */}
              {currentSubscription.plan === plan.id && (
                <div className="absolute right-0 top-0 rounded-bl-xl rounded-tr-2xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
                  Current Plan
                </div>
              )}

              {/* Popular Badge */}
              {plan.popular && currentSubscription.plan !== plan.id && (
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
                  <h3 className="mb-2 text-xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
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
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-2 text-sm"
                    >
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckIcon size={10} />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  variant={
                    currentSubscription.plan === plan.id
                      ? "outline"
                      : plan.popular
                      ? "default"
                      : plan.buttonVariant
                  }
                  disabled={currentSubscription.plan === plan.id}
                  className={cn(
                    "w-full h-11 text-sm font-semibold transition-all",
                    plan.popular &&
                      currentSubscription.plan !== plan.id &&
                      "glow-primary-hover"
                  )}
                >
                  {currentSubscription.plan === plan.id
                    ? "Current Plan"
                    : plan.price === "£0"
                    ? "Get Started"
                    : "Choose Plan"}
                </Button>
              </div>

              {/* Corner decorative element */}
              <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10 group-hover:scale-150" />
            </div>
          ))}
        </div>
      </div>

      {/* Billing History Section (Placeholder) */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Billing History
        </h2>
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            No billing history available yet
          </p>
        </div>
      </div>
    </main>
  );
}
