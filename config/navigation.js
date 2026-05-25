import { siteConfig } from "@/config/site";

/** Primary nav — matches Ocean Financial information architecture */
export const mainNav = [
  { label: "Personal", href: "/personal" },
  { label: "Business", href: "/business" },
  { label: "Investments", href: "/investments" },
  { label: "Retirement", href: "/retirement" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const authLinks = {
  login: { label: "Login", href: siteConfig.links.login },
  register: {
    label: "Open Account Today",
    href: siteConfig.links.register,
  },
};

export function isNavActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
