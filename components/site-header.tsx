"use client";

import { useHeroIntro } from "@/components/hero-intro-context";
import { Button } from "@/components/ui/button";
import { ViewfinderLink } from "@/components/ui/viewfinder-link";
import { scrollToSection } from "@/components/scroll-page-button";
import { SITE_HEADER_HEIGHT, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const SECTION_LINKS = [
  { label: "Services", id: "services" },
  { label: "Process", id: "process" },
] as const;

type SectionLinkProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

function SectionLink({ id, children, className }: SectionLinkProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <button
        type="button"
        className={className}
        onClick={() =>
          scrollToSection(id, {
            smooth: !prefersReducedMotion,
          })
        }
      >
        {children}
      </button>
    );
  }

  return (
    <Link href={`/#${id}`} className={className}>
      {children}
    </Link>
  );
}

type ContactButtonProps = {
  className?: string;
};

function ContactButton({ className }: ContactButtonProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <Button
        type="button"
        size="sm"
        className={className}
        onClick={() =>
          scrollToSection("contact", {
            smooth: !prefersReducedMotion,
          })
        }
      >
        Contact now
      </Button>
    );
  }

  return (
    <ViewfinderLink href="/#contact" size="sm" className={className}>
      Contact now
    </ViewfinderLink>
  );
}

function useTransparentHeroHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isTransparent, setIsTransparent] = useState(isHome);

  useEffect(() => {
    if (!isHome) {
      setIsTransparent(false);
      return;
    }

    const update = () => {
      const hero = document.getElementById("hero");
      const heroEnd = hero?.offsetHeight ?? window.innerHeight;
      setIsTransparent(window.scrollY < heroEnd - SITE_HEADER_HEIGHT);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isHome]);

  return isHome && isTransparent;
}

export function SiteHeader() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const { introComplete } = useHeroIntro();
  const isHome = pathname === "/";
  const isTransparent = useTransparentHeroHeader();
  const isVisible = !isHome || introComplete;

  const linkClassName = cn(
    "text-sm font-medium transition-colors",
    isTransparent
      ? "text-white/80 hover:text-primary"
      : "text-foreground/75 hover:text-primary"
  );

  const siteNameClassName = cn(
    "font-heading text-lg font-semibold tracking-tight transition-colors md:text-xl",
    isTransparent
      ? "text-white hover:text-primary"
      : "text-foreground hover:text-primary"
  );

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 transition-[background-color,backdrop-filter] duration-300",
        isTransparent
          ? "z-30 bg-transparent"
          : "z-50 border-b border-border bg-background/85 backdrop-blur-md",
        !isVisible && "pointer-events-none"
      )}
      initial={false}
      animate={{
        y: isVisible ? 0 : "-100%",
        opacity: isVisible ? 1 : 0,
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.65, ease, delay: isHome && isVisible ? 0.12 : 0 }
      }
    >
      <div
        className={cn(
          "mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-6 md:px-12 lg:px-16",
          isTransparent && "dark"
        )}
      >
        <Link href="/" className={siteNameClassName}>
          {SITE_NAME}
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {SECTION_LINKS.map((link) => (
            <SectionLink key={link.id} id={link.id} className={linkClassName}>
              {link.label}
            </SectionLink>
          ))}
          <Link href="/portfolio" className={linkClassName}>
            Portfolio
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/portfolio" className={cn(linkClassName, "md:hidden")}>
            Portfolio
          </Link>
          <ContactButton />
        </div>
      </div>
    </motion.header>
  );
}
