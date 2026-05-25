import { SupportChat } from "@/components/dashboard/SupportChat";

export const metadata = { title: "Support" };

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ocean-950">Customer support</h1>
        <p className="mt-1 text-sm text-slate-500">
          Secure messaging with VentureBank support — available during business hours with live updates.
        </p>
      </div>
      <SupportChat />
    </div>
  );
}
