import { OceanStylePage } from "@/components/pages/OceanStylePage";
import { personalContent } from "@/lib/mock/pageContent";

export const metadata = {
  title: "Personal Banking",
  description: "Checking, savings, loans, and credit cards at VentureBank",
};

export default function PersonalPage() {
  return <OceanStylePage {...personalContent} />;
}
