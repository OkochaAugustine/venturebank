import { AuthHeader } from "@/components/layout/AuthHeader";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AuthHeader />
      {children}
    </div>
  );
}
