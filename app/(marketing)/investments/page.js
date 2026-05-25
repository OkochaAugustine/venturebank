import { OceanStylePage } from "@/components/pages/OceanStylePage";
import { investmentsContent } from "@/lib/mock/pageContent";

export const metadata = {
  title: "Investments",
  description: "Wealth management and investment solutions",
};

export default function InvestmentsPage() {
  return <OceanStylePage {...investmentsContent} />;
}
