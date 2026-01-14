import { AuthLayout, SignupForm } from "@/components/auth"

export default function SignupPage() {
  return (
    <AuthLayout title="Create Account" subtitle="Start your legal AI journey today">
      <SignupForm />
    </AuthLayout>
  )
}
