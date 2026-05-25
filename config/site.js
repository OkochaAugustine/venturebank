export const siteConfig = {
  name: "VentureBank",
  tagline: "Luxury banking for the modern era",
  description:
    "Premium digital banking with enterprise-grade security, elegant design, and seamless wealth management.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  links: {
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    admin: "/admin",
  },
  nav: {
    main: [
      { label: "Features", href: "#features" },
      { label: "Cards", href: "#cards" },
      { label: "Security", href: "#security" },
      { label: "Pricing", href: "#pricing" },
    ],
    footer: [
      { label: "Personal", href: "/personal" },
      { label: "Business", href: "/business" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
};
