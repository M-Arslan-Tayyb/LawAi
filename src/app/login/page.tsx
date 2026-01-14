import { AuthLayout, LoginForm } from "@/components/auth"

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your LexMind AI account">
      <LoginForm />
    </AuthLayout>
  )
}
