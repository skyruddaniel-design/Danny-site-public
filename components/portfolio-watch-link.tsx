"use client";

import {
  buttonVariants,
  ViewfinderContent,
  ViewfinderDecor,
} from "@/components/ui/button";
import { getViewfinderMode } from "@/components/ui/button-viewfinder";
import {
  getPortfolioWatchLabel,
  hasPortfolioWatchLink,
  type PortfolioItem,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";

type PortfolioWatchLinkProps = {
  item: PortfolioItem;
  label?: string;
  className?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
};

export function PortfolioWatchLink({
  item,
  label,
  className,
  size = "sm",
}: PortfolioWatchLinkProps) {
  if (!hasPortfolioWatchLink(item) || !item.watchUrl) {
    return null;
  }

  const viewfinderMode = getViewfinderMode("default", size);
  const linkLabel = label ?? getPortfolioWatchLabel(item);

  return (
    <a
      href={item.watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant: "default", size, className }))}
      aria-label={`${linkLabel}: ${item.title}`}
      data-icon="inline-end"
      onClick={(event) => event.stopPropagation()}
    >
      {viewfinderMode !== "none" && (
        <ViewfinderDecor mode={viewfinderMode} />
      )}
      <ViewfinderContent>
        {linkLabel}
        <ArrowUpRight className="size-3.5" />
      </ViewfinderContent>
    </a>
  );
}
