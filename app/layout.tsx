import { Footer } from "@/components/footer";
import { HeroIntroProvider } from "@/components/hero-intro-context";
import { SectionHashScroll } from "@/components/section-hash-scroll";
import { SiteHeader } from "@/components/site-header";
import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";
import { Geist_Mono, Montserrat, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description: "Content production — strategy, video, photography and social media.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased motion-reduce:scroll-auto",
        montserrat.variable,
        outfit.variable,
        geistMono.variable
      )}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-screen flex-col font-sans">
        <HeroIntroProvider>
          <SectionHashScroll />
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <Footer />
        </HeroIntroProvider>
      </body>
    </html>
  );
}
