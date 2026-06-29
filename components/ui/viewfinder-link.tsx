import {
  buttonVariants,
  ViewfinderContent,
  ViewfinderDecor,
} from "@/components/ui/button";
import { getViewfinderMode } from "@/components/ui/button-viewfinder";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";

type ViewfinderLinkProps = LinkProps &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    children: ReactNode;
  };

export function ViewfinderLink({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ViewfinderLinkProps) {
  const viewfinderMode = getViewfinderMode(variant, size);

  return (
    <Link
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {viewfinderMode !== "none" && (
        <ViewfinderDecor mode={viewfinderMode} />
      )}
      <ViewfinderContent>{children}</ViewfinderContent>
    </Link>
  );
}
