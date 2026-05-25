import { OceanStylePage } from "@/components/pages/OceanStylePage";
import { businessContent } from "@/lib/mock/pageContent";

export const metadata = {
  title: "Business Banking",
  description: "Business checking, lending, and merchant services",
};

export default function BusinessPage() {
  return <OceanStylePage {...businessContent} />;
}
