"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, type RefObject } from "react";

const frameSpring = { stiffness: 900, damping: 52, mass: 0.12 };
const rotateSpring = { stiffness: 650, damping: 42, mass: 0.15 };

const IDLE_SIZE = 36;
const FRAME_INSET = 4;
const DEFAULT_IDLE_ROT = 24;

type MagneticTargetCursorProps = {
  containerRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
};

export function MagneticTargetCursor({
  containerRef,
  enabled = true,
}: MagneticTargetCursorProps) {
  const prefersReducedMotion = useReducedMotion();
  const active = enabled && !prefersReducedMotion;

  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const frameLeft = useSpring(0, frameSpring);
  const frameTop = useSpring(0, frameSpring);
  const frameWidth = useSpring(IDLE_SIZE, frameSpring);
  const frameHeight = useSpring(IDLE_SIZE, frameSpring);
  const frameRotate = useSpring(0, rotateSpring);
  const opacity = useMotionValue(0);
  const onCard = useMotionValue(0);
  const dotPrimaryOpacity = useTransform(onCard, [0, 1], [1, 0]);
  const dotWhiteOpacity = useTransform(onCard, [0, 1], [0, 1]);

  const springsRef = useRef({
    dotX,
    dotY,
    frameLeft,
    frameTop,
    frameWidth,
    frameHeight,
    frameRotate,
    opacity,
    onCard,
  });

  const rotateRef = useRef(0);
  const prevRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    springsRef.current = {
      dotX,
      dotY,
      frameLeft,
      frameTop,
      frameWidth,
      frameHeight,
      frameRotate,
      opacity,
      onCard,
    };
  }, [
    dotX,
    dotY,
    frameHeight,
    frameLeft,
    frameRotate,
    frameTop,
    frameWidth,
    onCard,
    opacity,
  ]);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const setIdleFrame = (x: number, y: number) => {
      const s = springsRef.current;
      const prev = prevRef.current;
      const dx = x - prev.x;
      const dy = y - prev.y;
      const speed = Math.hypot(dx, dy);

      if (speed > 0.4) {
        const movementAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 45;
        rotateRef.current = rotateRef.current * 0.55 + movementAngle * 0.45;
      } else {
        rotateRef.current =
          rotateRef.current * 0.82 + DEFAULT_IDLE_ROT * 0.18;
      }

      prevRef.current = { x, y };

      s.frameLeft.set(x - IDLE_SIZE / 2);
      s.frameTop.set(y - IDLE_SIZE / 2);
      s.frameWidth.set(IDLE_SIZE);
      s.frameHeight.set(IDLE_SIZE);
      s.frameRotate.set(rotateRef.current);
    };

    const setTargetFrame = (target: Element, sectionRect: DOMRect) => {
      const rect = target.getBoundingClientRect();
      const s = springsRef.current;

      s.frameLeft.set(rect.left - sectionRect.left - FRAME_INSET);
      s.frameTop.set(rect.top - sectionRect.top - FRAME_INSET);
      s.frameWidth.set(rect.width + FRAME_INSET * 2);
      s.frameHeight.set(rect.height + FRAME_INSET * 2);
      s.frameRotate.set(0);
    };

    let rafId = 0;
    let lastClientX = 0;
    let lastClientY = 0;
    let onTarget = false;
    let tracking = false;

    const tick = () => {
      if (tracking) {
        const sectionRect = container.getBoundingClientRect();
        const x = lastClientX - sectionRect.left;
        const y = lastClientY - sectionRect.top;
        const s = springsRef.current;

        s.dotX.set(x);
        s.dotY.set(y);

        if (onTarget) {
          const hit = document.elementFromPoint(lastClientX, lastClientY);
          const target = hit?.closest("[data-magnetic-target]");

          if (target && container.contains(target)) {
            setTargetFrame(target, sectionRect);
          } else {
            onTarget = false;
            s.onCard.set(0);
            setIdleFrame(x, y);
          }
        } else {
          setIdleFrame(x, y);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    const handlePointerMove = (event: PointerEvent) => {
      lastClientX = event.clientX;
      lastClientY = event.clientY;

      const hit = document.elementFromPoint(event.clientX, event.clientY);
      const target = hit?.closest("[data-magnetic-target]");
      const isOnCard = Boolean(target && container.contains(target));

      onTarget = isOnCard;
      springsRef.current.onCard.set(isOnCard ? 1 : 0);
    };

    const handlePointerEnter = (event: PointerEvent) => {
      lastClientX = event.clientX;
      lastClientY = event.clientY;
      tracking = true;
      springsRef.current.opacity.set(1);
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    };

    const handlePointerLeave = () => {
      tracking = false;
      cancelAnimationFrame(rafId);
      onTarget = false;
      rotateRef.current = DEFAULT_IDLE_ROT;
      prevRef.current = { x: 0, y: 0 };
      springsRef.current.opacity.set(0);
      springsRef.current.onCard.set(0);
    };

    container.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    container.addEventListener("pointerenter", handlePointerEnter);
    container.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerenter", handlePointerEnter);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [active, containerRef]);

  if (!active) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-50 hidden md:block"
    >
      <motion.div
        className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2"
        style={{ left: dotX, top: dotY, opacity }}
      >
        <motion.div
          className="absolute inset-0 size-1.5 rounded-full bg-primary"
          style={{ opacity: dotPrimaryOpacity }}
        />
        <motion.div
          className="absolute inset-0 size-1.5 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
          style={{ opacity: dotWhiteOpacity }}
        />
      </motion.div>

      <motion.div
        className="absolute"
        style={{
          left: frameLeft,
          top: frameTop,
          width: frameWidth,
          height: frameHeight,
          rotate: frameRotate,
          opacity,
          transformOrigin: "center center",
        }}
      >
        <span className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-primary" />
        <span className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-primary" />
        <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-primary" />
        <span className="absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 border-primary" />
      </motion.div>
    </div>
  );
}
