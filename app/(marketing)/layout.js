import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";

export default function MarketingLayout({ children }) {
  return (
    <div className="surface-page flex min-h-screen flex-col font-sans antialiased">
      <MarketingNavbar />
      <div className="marketing-fill flex-1">{children}</div>
      <MarketingFooter />
    </div>
  );
}
