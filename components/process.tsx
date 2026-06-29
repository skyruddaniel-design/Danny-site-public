"use client";

import { PortfolioCarousel } from "@/components/portfolio-carousel";
import { PortfolioPreviewLightbox } from "@/components/portfolio-preview-lightbox";
import { ViewfinderLink } from "@/components/ui/viewfinder-link";
import { PORTFOLIO_PREVIEW, type PortfolioItem } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Camera, Clapperboard, Compass, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type Step = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const STEPS: Step[] = [
  {
    title: "Discovery",
    icon: Compass,
    description:
      "We define your audience, message, channels, and production requirements.",
  },
  {
    title: "Production",
    icon: Camera,
    description:
      "We plan the shoot, locations, crew, and content schedule.",
  },
  {
    title: "Delivery",
    icon: Clapperboard,
    description:
      "You receive ready-to-use files for websites, social media, advertising, and presentations.",
  },
];

function ProcessBackground({
  scrollYProgress,
  enabled,
}: {
  scrollYProgress: MotionValue<number>;
  enabled: boolean;
}) {
  const textureY = useTransform(scrollYProgress, [0, 1], [20, -30]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      <motion.div
        className="services-texture-image absolute -inset-x-0 -inset-y-12 origin-center opacity-[0.14]"
        style={enabled ? { y: textureY } : undefined}
      />
      <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--background)_72%,transparent)]" />
    </div>
  );
}

export function Process() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.15"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -20, -40]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], [16, -24]);
  const segmentOneFill = useTransform(scrollYProgress, [0.2, 0.45], [0, 1]);
  const segmentTwoFill = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);
  const parallaxEnabled = !prefersReducedMotion;

  const segmentFills = [segmentOneFill, segmentTwoFill];

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

  const stagger = prefersReducedMotion ? 0 : 0.12;
  const headerStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  };

  const stepStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: prefersReducedMotion ? 0 : 0.15,
      },
    },
  };

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative overflow-hidden bg-background text-foreground"
    >
      <ProcessBackground
        scrollYProgress={scrollYProgress}
        enabled={parallaxEnabled}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-24 lg:px-16">
        {/* Full-width header — matches Services layout */}
        <motion.div
          style={parallaxEnabled ? { y: headerY } : undefined}
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={headerStagger}
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
            <motion.div variants={fadeUp} className="relative z-10 max-w-xl">
              <h2 className="font-heading text-3xl font-bold tracking-tight md:text-5xl md:leading-[1.1]">
                From concept to delivery
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                A smooth production process with clear milestones — so you
                always know what&apos;s happening and when your assets land.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="hidden md:block">
              <motion.p
                aria-hidden
                className="pointer-events-none shrink-0 self-start font-heading text-[clamp(3.5rem,10vw,7.5rem)] leading-[0.85] font-bold tracking-tighter text-foreground/10 uppercase select-none md:pt-1 md:text-right"
                style={parallaxEnabled ? { y: watermarkY } : undefined}
              >
                Process
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        {/* Two-column body — image left, timeline right */}
        <div className="mt-12 grid items-start gap-10 md:mt-14 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:items-stretch md:gap-10 lg:mt-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-20">
          <motion.div
            className="order-2 flex w-full min-w-0 flex-col gap-8 md:order-1 md:sticky md:top-24 md:h-full md:self-stretch"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={headerStagger}
          >
            <motion.div
              variants={fadeUp}
              className="relative w-full min-h-[320px] flex-1 md:min-h-0"
            >
              <PortfolioCarousel
                items={PORTFOLIO_PREVIEW}
                className="h-full min-h-[320px] md:min-h-[280px]"
                onOpenPreview={setPreviewItem}
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <ViewfinderLink
                href="/portfolio"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                data-icon="inline-end"
              >
                More of our work
                <ArrowUpRight className="size-4" />
              </ViewfinderLink>
            </motion.div>
          </motion.div>

          <motion.ol
            className="order-1 flex list-none flex-col gap-10 md:order-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stepStagger}
          >
            {STEPS.map((step, index) => (
              <motion.li
                key={step.title}
                variants={fadeUp}
                className="grid grid-cols-[auto_1fr] gap-x-5 md:gap-x-6"
              >
                <div className="relative self-stretch">
                  <div className="relative z-10 flex size-9 items-center justify-center border border-primary/50 bg-background md:size-11">
                    <step.icon
                      className="size-4 text-primary md:size-[1.125rem]"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </div>

                  {index < STEPS.length - 1 && (
                    <div
                      aria-hidden
                      className="absolute top-9 left-1/2 -bottom-10 w-px -translate-x-1/2 overflow-hidden bg-border md:top-11"
                    >
                      <motion.div
                        className="h-full w-full origin-top bg-primary"
                        style={{
                          scaleY: parallaxEnabled ? segmentFills[index] : 1,
                        }}
                      />
                    </div>
                  )}
                </div>

                <article
                  className={cn(
                    "min-w-0 border border-border bg-card/90 p-6 backdrop-blur-sm md:p-8",
                    "transition-colors hover:border-primary/40 hover:bg-card"
                  )}
                >
                  <span className="font-mono text-[10px] tracking-[0.22em] text-primary uppercase md:text-xs">
                    Step · {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {step.description}
                  </p>
                </article>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>

      <PortfolioPreviewLightbox
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </section>
  );
}
