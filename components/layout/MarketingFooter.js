import Link from "next/link";
import { mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ocean-800/30 bg-ocean-950 text-ocean-200">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ocean-700">
                <span className="font-bold text-white">V</span>
              </div>
              <span className="font-serif text-xl font-semibold text-white">
                {siteConfig.name}
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ocean-300">
              {siteConfig.description}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ocean-400">
              Navigation
            </p>
            <nav className="mt-4 flex flex-col gap-2">
              {mainNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ocean-400">
              Banking
            </p>
            <nav className="mt-4 flex flex-col gap-2 text-sm">
              <Link href={siteConfig.links.login} className="hover:text-white">
                Login to Banking
              </Link>
              <Link
                href={siteConfig.links.register}
                className="hover:text-white"
              >
                Open an Account
              </Link>
              <Link href="/dashboard" className="hover:text-white">
                Member Dashboard
              </Link>
            </nav>
          </div>
        </div>
        <p className="mt-12 border-t border-ocean-800/50 pt-8 text-center text-xs text-ocean-400">
          © {year} {siteConfig.name}. All rights reserved. Member FDIC. Equal
          Housing Lender.
        </p>
      </div>
    </footer>
  );
}
