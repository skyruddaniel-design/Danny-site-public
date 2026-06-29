"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;
const expandEase = [0.32, 0.72, 0, 1] as const;

type Service = {
  title: string;
  summary: string;
  items: string[];
  image: string;
  imageAlt: string;
};

const SERVICES: Service[] = [
  {
    title: "Video",
    summary:
      "Story-led films built for attention — from first brief to final export.",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Cinematographer filming on location",
    items: [
      "Commercials",
      "Interviews",
      "Reels",
      "Event films",
      "Campaign content",
    ],
  },
  {
    title: "Photography",
    summary:
      "Consistent imagery that strengthens how your brand looks everywhere.",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Photographer adjusting a camera in studio",
    items: [
      "Product photography",
      "Portraits",
      "Lifestyle imagery",
      "Brand image libraries",
    ],
  },
  {
    title: "Strategy",
    summary:
      "Clear direction before the cameras roll — so every asset has a job to do.",
    image:
      "https://images.unsplash.com/photo-1531403009284-5f974d992ef8?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Creative team reviewing content on a laptop",
    items: [
      "Creative concepts",
      "Scripting",
      "Content planning",
      "Platform optimisation",
    ],
  },
  {
    title: "Post Production",
    summary:
      "Polished finishing that makes the work feel intentional, not assembled.",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Video editor working at a colour grading workstation",
    items: [
      "Editing",
      "Colour grading",
      "Sound design",
      "Subtitles",
      "Delivery in every format",
    ],
  },
];

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

function getGridColumns(activeIndex: number | null) {
  return SERVICES.map((_, index) => {
    if (activeIndex === null) {
      return "minmax(0, 1fr)";
    }

    return index === activeIndex
      ? "minmax(0, 3.25fr)"
      : "minmax(0, 0.85fr)";
  }).join(" ");
}

function ServiceCard({
  service,
  index,
  active,
  onHover,
  onToggle,
  prefersReducedMotion,
}: {
  service: Service;
  index: number;
  active: boolean;
  onHover: () => void;
  onToggle: () => void;
  prefersReducedMotion: boolean | null;
}) {
  const contentTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        opacity: {
          duration: 0.35,
          ease,
          delay: active ? 0.32 : 0,
        },
        y: {
          duration: 0.45,
          ease: expandEase,
          delay: active ? 0.28 : 0,
        },
      };

  const imageTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.8, ease: expandEase };

  return (
    <article
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onToggle}
      tabIndex={0}
      aria-expanded={active}
      className={cn(
        "group relative min-h-[20rem] min-w-0 cursor-pointer overflow-hidden outline-none md:min-h-0 md:h-full",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: active ? 1.07 : 1 }}
        transition={imageTransition}
      >
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 35vw"
          className="object-cover"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/15"
        animate={{ opacity: active ? 1 : 0.82 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease }}
      />

      <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-7">
        <span className="font-mono text-[11px] tracking-[0.22em] text-white/55 uppercase">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0">
          <h3
            className={cn(
              "font-heading font-semibold tracking-tight text-white transition-[font-size] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              active ? "text-3xl md:text-4xl" : "text-2xl md:text-[1.65rem]"
            )}
          >
            {service.title}
          </h3>

          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-500 delay-100 ease-[cubic-bezier(0.32,0.72,0,1)]",
              active ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              prefersReducedMotion && active && "grid-rows-[1fr]",
              prefersReducedMotion && !active && "grid-rows-[0fr]"
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <motion.div
                initial={false}
                animate={{
                  opacity: active ? 1 : 0,
                  y: active ? 0 : 10,
                }}
                transition={contentTransition}
                className="pt-4"
              >
                <p className="max-w-md text-sm leading-relaxed text-white/78 md:text-[0.95rem]">
                  {service.summary}
                </p>
                <ul className="mt-4 grid grid-cols-2 gap-2 md:mt-5">
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className="border border-white/20 bg-white/10 px-2.5 py-1.5 text-[10px] leading-tight tracking-wide text-white/90 uppercase backdrop-blur-sm md:px-3 md:text-[11px]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          <motion.p
            className="mt-3 font-mono text-[10px] tracking-[0.2em] text-primary uppercase md:text-[11px]"
            animate={{ opacity: active ? 0 : 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25, ease }}
          >
            Explore
          </motion.p>
        </div>
      </div>
    </article>
  );
}

export function Services() {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

  const gridTemplateColumns = isDesktop ? getGridColumns(activeIndex) : "1fr";

  return (
    <section id="services" className="bg-background text-foreground">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28 lg:px-16">
        <motion.div
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <div className="max-w-xl">
            <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
              Services
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight md:text-5xl">
              What we make
            </h2>
          </div>
          
        </motion.div>

        <motion.div
          className="mt-10 md:mt-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeUp}
        >
          <div
            className={cn(
              "grid gap-2 md:h-[34rem] md:gap-1",
              !prefersReducedMotion &&
                "md:transition-[grid-template-columns] md:duration-700 md:ease-[cubic-bezier(0.32,0.72,0,1)]"
            )}
            style={{ gridTemplateColumns }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {SERVICES.map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={index}
                active={activeIndex === index}
                onHover={() => setActiveIndex(index)}
                onToggle={() =>
                  setActiveIndex((current) =>
                    current === index ? null : index
                  )
                }
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
