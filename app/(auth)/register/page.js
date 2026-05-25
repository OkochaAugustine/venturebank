import { RegisterWizard } from "@/components/auth/RegisterWizard";

export const metadata = {
  title: "Open Account",
  description: "Secure multi-step registration for VentureBank",
};

export default function RegisterPage() {
  return <RegisterWizard />;
}
