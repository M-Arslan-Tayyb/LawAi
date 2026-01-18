"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Checkbox } from "antd";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if there's a plan parameter
    const planParam = searchParams.get("plan");
    if (planParam) {
      toast.success("Welcome back! Redirecting to billing...");
      router.push(`${ROUTES.BILLING}?plan=${planParam}`);
    } else {
      toast.success("Welcome back! Redirecting to dashboard...");
      router.push(ROUTES.DASHBOARD);
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = () => {
    toast.info("Redirecting to Google Sign In...");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@lawfirm.com"
          size="large"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className={cn(
            "!bg-background !border-border hover:!border-primary/50 focus:!border-primary",
            "!text-foreground placeholder:!text-muted-foreground"
          )}
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <Link
            href="#"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <Input.Password
          id="password"
          placeholder="Enter your password"
          size="large"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
          className={cn(
            "!bg-background !border-border hover:!border-primary/50 focus:!border-primary",
            "!text-foreground placeholder:!text-muted-foreground"
          )}
        />
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between">
        <Checkbox
          checked={formData.remember}
          onChange={(e) =>
            setFormData({ ...formData, remember: e.target.checked })
          }
          className="!text-foreground"
        >
          <span className="text-sm text-muted-foreground">Remember me</span>
        </Checkbox>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold glow-primary-hover"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Signing in...</span>
          </div>
        ) : (
          "Sign In"
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full h-12 bg-transparent"
        onClick={handleGoogleSignIn}
      >
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href={ROUTES.SIGNUP}
          className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Sign up for free
        </Link>
      </p>
    </form>
  );
}
