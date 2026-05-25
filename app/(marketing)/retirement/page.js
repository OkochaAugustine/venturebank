import { OceanStylePage } from "@/components/pages/OceanStylePage";
import { retirementContent } from "@/lib/mock/pageContent";

export const metadata = {
  title: "Retirement",
  description: "IRAs, rollovers, and retirement planning",
};

export default function RetirementPage() {
  return <OceanStylePage {...retirementContent} />;
}
