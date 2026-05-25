import { OceanStylePage } from "@/components/pages/OceanStylePage";
import { servicesContent } from "@/lib/mock/pageContent";

export const metadata = {
  title: "Services",
  description: "Full-service banking for members — accounts, loans, wealth, and more",
};

export default function ServicesPage() {
  return <OceanStylePage {...servicesContent} />;
}
