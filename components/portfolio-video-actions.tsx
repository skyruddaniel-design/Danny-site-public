"use client";

import { Button } from "@/components/ui/button";
import { PortfolioWatchLink } from "@/components/portfolio-watch-link";
import { cn } from "@/lib/utils";
import {
  getPortfolioPreviewSrc,
  hasPortfolioWatchLink,
  isPortfolioVideo,
  type LocalizedPortfolioItem,
} from "@/lib/portfolio";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";

type PortfolioVideoActionsProps = {
  item: LocalizedPortfolioItem;
  onOpenPreview?: (item: LocalizedPortfolioItem) => void;
  className?: string;
  align?: "start" | "end" | "between";
};

export function PortfolioVideoActions({
  item,
  onOpenPreview,
  className,
  align = "end",
}: PortfolioVideoActionsProps) {
  const t = useTranslations("portfolio");
  const previewSrc = getPortfolioPreviewSrc(item);
  const hasPreview = Boolean(previewSrc);
  const hasWatchLink = hasPortfolioWatchLink(item);

  if (!isPortfolioVideo(item) || (!hasPreview && !hasWatchLink)) {
    return null;
  }

  const openPreview = () => {
    if (!hasPreview || !onOpenPreview) return;
    onOpenPreview(item);
  };

  return (
    <div
      className={cn(
        "flex flex-nowrap items-stretch gap-2 md:flex-wrap md:gap-4",
        align === "end" && "justify-end",
        align === "start" && "justify-start",
        align === "between" && "justify-between",
        className
      )}
    >
      {hasPreview && onOpenPreview ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-icon="inline-start"
          className="min-w-0 max-md:h-auto max-md:min-h-8 max-md:flex-1 max-md:flex-wrap max-md:justify-center max-md:px-2 max-md:py-1.5 max-md:text-[10px] max-md:leading-tight max-md:tracking-[0.12em] max-md:whitespace-normal md:flex-none"
          onClick={(event) => {
            event.stopPropagation();
            openPreview();
          }}
        >
          <Play className="size-3 fill-current md:size-3.5" />
          {t("actions.viewPreview")}
        </Button>
      ) : null}
      {hasWatchLink ? (
        <PortfolioWatchLink
          item={item}
          className="min-w-0 max-md:h-auto max-md:min-h-8 max-md:flex-1 max-md:flex-wrap max-md:justify-center max-md:px-2 max-md:py-1.5 max-md:text-[10px] max-md:leading-tight max-md:tracking-[0.12em] max-md:whitespace-normal md:flex-none"
        />
      ) : null}
    </div>
  );
}
