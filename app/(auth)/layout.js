import { AuthHeader } from "@/components/layout/AuthHeader";

export default function AuthLayout({ children }) {
  return (
    <div className="surface-page flex min-h-screen flex-col">
      <AuthHeader />
      <div className="flex-1">{children}</div>
    </div>
  );
}
