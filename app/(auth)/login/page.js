import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login to Banking",
  description: "Secure sign in to your VentureBank accounts",
};

function LoginFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-slate-600">Loading...</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
