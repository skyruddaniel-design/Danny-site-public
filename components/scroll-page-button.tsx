"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { SITE_HEADER_HEIGHT } from "@/lib/site";
import { useReducedMotion } from "motion/react";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

type ScrollPageButtonProps = ComponentProps<typeof Button> &
  VariantProps<typeof buttonVariants> & {
    targetId: string;
    offset?: number;
  };

export function scrollToSection(
  targetId: string,
  options?: { offset?: number; smooth?: boolean }
) {
  const element = document.getElementById(targetId);
  if (!element) return;

  const offset = options?.offset ?? SITE_HEADER_HEIGHT;
  const smooth = options?.smooth ?? true;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top,
    behavior: smooth ? "smooth" : "auto",
  });
}

export function ScrollPageButton({
  targetId,
  offset = SITE_HEADER_HEIGHT,
  onClick,
  ...props
}: ScrollPageButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;

        scrollToSection(targetId, {
          offset,
          smooth: !prefersReducedMotion,
        });
      }}
    />
  );
}
