import { OceanStylePage } from "@/components/pages/OceanStylePage";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { aboutContent } from "@/lib/mock/pageContent";

export const metadata = {
  title: "About",
  description: "Learn about VentureBank member-focused banking",
};

export default function AboutPage() {
  return (
    <>
      <OceanStylePage {...aboutContent} />
      <TestimonialsSection />
    </>
  );
}
