import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeProvider";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { GoogleTranslateHead } from "@/components/layout/GoogleTranslateHead";
import { GoogleTranslateInit } from "@/components/layout/GoogleTranslateInit";
import { AppLoader } from "@/components/layout/AppLoader";
import { GlobalChatWidget } from "@/components/layout/GlobalChatWidget";
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
      <head>
        <ThemeScript />
        <GoogleTranslateHead />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased transition-colors duration-200`}
      >
        <ThemeProvider>
          <GoogleTranslateInit />
          <AppLoader>
            {children}
            <GlobalChatWidget />
          </AppLoader>
        </ThemeProvider>
      </body>
    </html>
  );
}
