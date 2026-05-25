import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeProvider";
import { AppLoader } from "@/components/layout/AppLoader";
import { GlobalChatWidget } from "@/components/layout/GlobalChatWidget";
import { GoogleTranslateScript } from "@/components/layout/GoogleTranslateScript";
import { siteConfig } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["fintech", "banking", "digital bank", "luxury banking"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[rgb(var(--background))] font-sans text-[rgb(var(--foreground))] antialiased`}
      >
        <ThemeProvider>
          <GoogleTranslateScript />
          <AppLoader>
            {children}
            <GlobalChatWidget />
          </AppLoader>
        </ThemeProvider>
      </body>
    </html>
  );
}
