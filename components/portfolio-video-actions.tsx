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
        "flex flex-wrap gap-4",
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
          onClick={(event) => {
            event.stopPropagation();
            openPreview();
          }}
        >
          <Play className="size-3.5 fill-current" />
          {t("actions.viewPreview")}
        </Button>
      ) : null}
      {hasWatchLink ? <PortfolioWatchLink item={item} /> : null}
    </div>
  );
}
