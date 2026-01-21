import { Suspense } from "react";
import { AuthLayout, LoginForm } from "@/components/pages/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <AuthLayout
        title="Welcome Back"
        subtitle="Sign in to your LexMind AI account"
      >
        <LoginForm />
      </AuthLayout>
    </Suspense>
  );
}
