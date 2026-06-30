"use client";

import { useHeroIntro } from "@/components/hero-intro-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { scrollToSection } from "@/components/scroll-page-button";
import { Button } from "@/components/ui/button";
import { ViewfinderLink } from "@/components/ui/viewfinder-link";
import { Link, usePathname } from "@/i18n/navigation";
import { SITE_HEADER_HEIGHT, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const SECTION_LINKS = [
  { key: "services", id: "services" },
  { key: "process", id: "process" },
] as const;

type SectionLinkProps = {
  id: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
};

function SectionLink({
  id,
  children,
  className,
  onNavigate,
}: SectionLinkProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => {
          scrollToSection(id, {
            smooth: !prefersReducedMotion,
          });
          onNavigate?.();
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <Link href={`/#${id}`} className={className} onClick={onNavigate}>
      {children}
    </Link>
  );
}

type ContactButtonProps = {
  className?: string;
  onNavigate?: () => void;
};

function ContactButton({ className, onNavigate }: ContactButtonProps) {
  const t = useTranslations("header");
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <Button
        type="button"
        size="sm"
        className={className}
        onClick={() => {
          scrollToSection("contact", {
            smooth: !prefersReducedMotion,
          });
          onNavigate?.();
        }}
      >
        {t("cta.contact")}
      </Button>
    );
  }

  return (
    <ViewfinderLink href="/#contact" size="sm" className={className} onClick={onNavigate}>
      {t("cta.contact")}
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

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  isTransparent: boolean;
};

function MobileMenu({ open, onClose, isTransparent }: MobileMenuProps) {
  const t = useTranslations("header");
  const prefersReducedMotion = useReducedMotion();

  const mobileLinkClassName = cn(
    "block py-3 text-left font-heading text-2xl font-semibold tracking-tight transition-colors",
    isTransparent
      ? "text-foreground hover:text-primary"
      : "text-foreground hover:text-primary"
  );

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label={t("menu.close")}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={onClose}
          />

          <motion.div
            id="mobile-nav"
            className={cn(
              "fixed inset-x-0 top-16 z-40 border-b border-border md:hidden",
              isTransparent
                ? "bg-background/95 backdrop-blur-md"
                : "bg-background/95 backdrop-blur-md"
            )}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.25,
              ease,
            }}
          >
            <nav
              className="mx-auto flex max-w-[1440px] flex-col px-6 py-6"
              aria-label={t("nav.label")}
            >
              {SECTION_LINKS.map((link) => (
                <SectionLink
                  key={link.id}
                  id={link.id}
                  className={mobileLinkClassName}
                  onNavigate={onClose}
                >
                  {t(`nav.${link.key}`)}
                </SectionLink>
              ))}

              <Link
                href="/portfolio"
                className={mobileLinkClassName}
                onClick={onClose}
              >
                {t("nav.portfolio")}
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-6">
                <ContactButton onNavigate={onClose} />
                <LanguageSwitcher />
              </div>
            </nav>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function SiteHeader() {
  const t = useTranslations("header");
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const { introComplete } = useHeroIntro();
  const isHome = pathname === "/";
  const isTransparent = useTransparentHeroHeader();
  const isVisible = !isHome || introComplete;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const useHeroChrome = isTransparent && !menuOpen;

  const linkClassName = cn(
    "text-sm font-medium transition-colors",
    useHeroChrome
      ? "text-white/80 hover:text-primary"
      : "text-foreground/75 hover:text-primary"
  );

  const siteNameClassName = cn(
    "font-heading text-lg font-semibold tracking-tight transition-colors md:text-xl",
    useHeroChrome
      ? "text-white hover:text-primary"
      : "text-foreground hover:text-primary"
  );

  const showSolidChrome = !isTransparent || menuOpen;

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300",
          showSolidChrome
            ? "border-b border-border bg-background/85 backdrop-blur-md"
            : "bg-transparent",
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
            "mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-6 md:px-12 lg:px-16",
            isTransparent && !menuOpen && "dark"
          )}
        >
          <Link href="/" className={siteNameClassName}>
            {SITE_NAME}
          </Link>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label={t("nav.label")}
          >
            {SECTION_LINKS.map((link) => (
              <SectionLink key={link.id} id={link.id} className={linkClassName}>
                {t(`nav.${link.key}`)}
              </SectionLink>
            ))}
            <Link href="/portfolio" className={linkClassName}>
              {t("nav.portfolio")}
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden items-center gap-3 md:flex">
              <LanguageSwitcher inverted={useHeroChrome} />
              <ContactButton />
            </div>

            <button
              type="button"
              className={cn(
                "inline-flex size-10 items-center justify-center border transition-colors md:hidden",
                useHeroChrome
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-border text-foreground hover:bg-muted"
              )}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? t("menu.close") : t("menu.open")}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        open={menuOpen && isVisible}
        onClose={() => setMenuOpen(false)}
        isTransparent={isTransparent}
      />
    </>
  );
}
