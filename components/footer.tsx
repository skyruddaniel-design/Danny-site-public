import { SITE_NAME } from "@/lib/site";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-12 lg:px-16">
        <p>
          &copy; {year} {SITE_NAME}. All rights reserved.
        </p>
        <nav aria-label="Footer">
          <Link
            href="/privacy"
            className="font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Privacy policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
