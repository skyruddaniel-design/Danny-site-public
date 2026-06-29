"use client";

import { PortfolioMediaCard } from "@/components/portfolio-media-card";
import { PortfolioPreviewLightbox } from "@/components/portfolio-preview-lightbox";
import { PortfolioReelsStrip } from "@/components/portfolio-reels-strip";
import { ServicesBackground } from "@/components/services-background";
import { ViewfinderLink } from "@/components/ui/viewfinder-link";
import {
  filterPortfolioItems,
  groupPortfolioItems,
  PORTFOLIO_FILTERS,
  PORTFOLIO_ITEMS,
  type PortfolioFilter,
  type PortfolioItem,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useMemo, useRef, useState, type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

function PortfolioSection({
  title,
  description,
  showHeading = true,
  children,
  className,
}: {
  title: string;
  description?: string;
  showHeading?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease },
        },
      };

  return (
    <section className={cn("mt-16 md:mt-20", className)}>
      {showHeading ? (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="mb-8 max-w-2xl md:mb-10"
        >
          <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>
          ) : null}
        </motion.div>
      ) : null}
      {children}
    </section>
  );
}

export function PortfolioPage() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<PortfolioFilter>("all");
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.15"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -20, -40]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], [16, -24]);
  const parallaxEnabled = !prefersReducedMotion;

  const filteredItems = useMemo(
    () => filterPortfolioItems(PORTFOLIO_ITEMS, filter),
    [filter]
  );

  const { shortFilms, tiktok, photography } = useMemo(
    () => groupPortfolioItems(filteredItems),
    [filteredItems]
  );

  const showShortFilms = filter === "all" || filter === "short-film";
  const showTiktok = filter === "all" || filter === "tiktok";
  const showPhotography = filter === "all" || filter === "photography";
  const showSectionHeadings = filter === "all";

  const fadeUp = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease },
        },
      };

  const stagger = prefersReducedMotion ? 0 : 0.1;
  const headerStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  };

  const gridStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.06,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="services-texture relative min-h-screen overflow-hidden text-foreground"
    >
      <ServicesBackground
        scrollYProgress={scrollYProgress}
        enabled={parallaxEnabled}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-24 lg:px-16">
        <motion.div
          style={parallaxEnabled ? { y: headerY } : undefined}
          className="relative"
          initial="hidden"
          animate="visible"
          variants={headerStagger}
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
            <motion.div variants={fadeUp} className="relative z-10 max-w-2xl">
              <ViewfinderLink
                href="/#process"
                variant="outline"
                size="sm"
                className="mb-6 inline-flex"
              >
                <ArrowLeft className="size-4" />
                Back to process
              </ViewfinderLink>
              <h1 className="font-heading text-3xl font-bold tracking-tight md:text-5xl md:leading-[1.1]">
                Selected work
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Short films, TikTok edits, and photography — the kind of work we
                deliver from first brief to final export.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="hidden md:block">
              <motion.p
                aria-hidden
                className="pointer-events-none shrink-0 self-start font-heading text-[clamp(3.5rem,10vw,7.5rem)] leading-[0.85] font-bold tracking-tighter text-foreground/10 uppercase select-none md:pt-1 md:text-right"
                style={parallaxEnabled ? { y: watermarkY } : undefined}
              >
                Portfolio
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-wrap gap-2 md:mt-12"
          role="tablist"
          aria-label="Filter portfolio"
        >
          {PORTFOLIO_FILTERS.map(({ value, label }) => {
            const isActive = filter === value;

            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(value)}
                className={cn(
                  "border px-4 py-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors md:text-[11px]",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                {label}
              </button>
            );
          })}
        </motion.div>

        {showShortFilms && shortFilms.length > 0 ? (
          <PortfolioSection
            title="Short films"
            showHeading={showSectionHeadings}
            description="Cinematic edits and brand films — hover to preview, built for web and presentations."
          >
            <motion.div
              className="grid gap-4 lg:grid-cols-2 lg:gap-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={gridStagger}
            >
              {shortFilms.map((item, index) => (
                <motion.div key={item.id} variants={fadeUp}>
                  <PortfolioMediaCard
                    item={item}
                    priority={index === 0}
                    onOpenPreview={setPreviewItem}
                  />
                </motion.div>
              ))}
            </motion.div>
          </PortfolioSection>
        ) : null}

        {showTiktok && tiktok.length > 0 ? (
          <PortfolioSection
            title="TikTok edits"
            showHeading={showSectionHeadings}
            description="Fast, vertical cuts tuned for retention — scroll through recent social edits."
          >
            <PortfolioReelsStrip
              items={tiktok}
              onOpenPreview={setPreviewItem}
            />
          </PortfolioSection>
        ) : null}

        {showPhotography && photography.length > 0 ? (
          <PortfolioSection
            title="Photography"
            showHeading={showSectionHeadings}
            description="Stills and image libraries for brands that need consistency across every channel."
          >
            <motion.div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={gridStagger}
            >
              {photography.map((item) => (
                <motion.div key={item.id} variants={fadeUp}>
                  <PortfolioMediaCard
                    item={item}
                    onOpenPreview={setPreviewItem}
                  />
                </motion.div>
              ))}
            </motion.div>
          </PortfolioSection>
        ) : null}

        {filteredItems.length === 0 ? (
          <p className="mt-16 text-muted-foreground">No projects in this category yet.</p>
        ) : null}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-16 flex flex-col items-start gap-4 border border-border bg-card/70 p-6 backdrop-blur-sm md:mt-20 md:flex-row md:items-center md:justify-between md:p-8"
        >
          <div>
            <p className="font-heading text-xl font-semibold tracking-tight md:text-2xl">
              Ready to start your project?
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Tell us what you&apos;re building — film, TikTok, or photography —
              and we&apos;ll map out the next steps together.
            </p>
          </div>
          <ViewfinderLink
            href="/#contact"
            size="lg"
            className="inline-flex shrink-0"
            data-icon="inline-end"
          >
            Book a call
            <ArrowUpRight className="size-4" />
          </ViewfinderLink>
        </motion.div>
      </div>

      <PortfolioPreviewLightbox
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </section>
  );
}
