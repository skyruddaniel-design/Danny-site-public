"use client";

import {
  buttonVariants,
  ViewfinderContent,
  ViewfinderDecor,
} from "@/components/ui/button";
import { getViewfinderMode } from "@/components/ui/button-viewfinder";
import { scrollToSection } from "@/components/scroll-page-button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { Link, usePathname } from "@/i18n/navigation";
import { useReducedMotion } from "motion/react";
import type { ComponentProps, MouseEvent, ReactNode } from "react";

type ViewfinderLinkProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    children: ReactNode;
  };

function parseSectionHashHref(href: string) {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return null;

  const sectionId = href.slice(hashIndex + 1);
  if (!sectionId) return null;

  const path = href.slice(0, hashIndex) || "/";
  return { path, sectionId };
}

export function ViewfinderLink({
  className,
  variant = "default",
  size = "default",
  children,
  href,
  onClick,
  ...props
}: ViewfinderLinkProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const viewfinderMode = getViewfinderMode(variant, size);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (typeof href !== "string") return;

    const target = parseSectionHashHref(href);
    if (!target || target.path !== pathname) return;

    event.preventDefault();
    scrollToSection(target.sectionId, {
      smooth: !prefersReducedMotion,
    });
    window.history.pushState(null, "", `${target.path}#${target.sectionId}`);
  };

  return (
    <Link
      className={cn(buttonVariants({ variant, size, className }))}
      href={href}
      onClick={handleClick}
      {...props}
    >
      {viewfinderMode !== "none" && (
        <ViewfinderDecor mode={viewfinderMode} />
      )}
      <ViewfinderContent>{children}</ViewfinderContent>
    </Link>
  );
}
