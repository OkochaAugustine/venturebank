import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";

export default function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased">
      <MarketingNavbar />
      {children}
      <MarketingFooter />
    </div>
  );
}
