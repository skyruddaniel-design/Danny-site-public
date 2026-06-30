import { cn } from "@/lib/utils";

const SHUTTER_BLADES = 8;

type ViewfinderDecorProps = {
  mode?: "minimal" | "full";
  staticCorners?: boolean;
};

export function ViewfinderDecor({
  mode = "full",
  staticCorners = false,
}: ViewfinderDecorProps) {
  const cornerSize =
    mode === "minimal" ? "h-2 w-2" : "h-3 w-3 sm:h-3.5 sm:w-3.5";
  const cornerMotion = staticCorners
    ? ""
    : cn(
        "transition-[top,right,bottom,left,width,height,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
        mode === "minimal"
          ? "group-hover/button:h-2.5 group-hover/button:w-2.5"
          : "group-hover/button:h-4 group-hover/button:w-4 sm:group-hover/button:h-[0.9375rem] sm:group-hover/button:w-[0.9375rem]"
      );
  const cornerBase = cn(
    "pointer-events-none absolute border-[var(--btn-corner,var(--foreground))] opacity-90",
    !staticCorners && "group-hover/button:opacity-100",
    cornerSize,
    cornerMotion
  );
  const cornerOffset = staticCorners
    ? {
        tl: "-top-0.5 -left-0.5",
        tr: "-top-0.5 -right-0.5",
        bl: "-bottom-0.5 -left-0.5",
        br: "-bottom-0.5 -right-0.5",
      }
    : {
        tl: "-top-0.5 -left-0.5 group-hover/button:-top-1 group-hover/button:-left-1 group-focus-visible/button:-top-1 group-focus-visible/button:-left-1",
        tr: "-top-0.5 -right-0.5 group-hover/button:-top-1 group-hover/button:-right-1 group-focus-visible/button:-top-1 group-focus-visible/button:-right-1",
        bl: "-bottom-0.5 -left-0.5 group-hover/button:-bottom-1 group-hover/button:-left-1 group-focus-visible/button:-bottom-1 group-focus-visible/button:-left-1",
        br: "-bottom-0.5 -right-0.5 group-hover/button:-bottom-1 group-hover/button:-right-1 group-focus-visible/button:-bottom-1 group-focus-visible/button:-right-1",
      };

  return (
    <>
      {mode === "full" && (
        <>
          <span
            aria-hidden
            className={cn(
              "btn-viewfinder-hatch pointer-events-none absolute inset-0 opacity-[0.14] motion-reduce:transition-none",
              staticCorners
                ? ""
                : "transition-opacity duration-300 group-hover/button:opacity-[0.22]"
            )}
          />

          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 flex overflow-hidden text-[var(--btn-corner,var(--foreground))] opacity-0 transition-opacity duration-200 group-hover/button:opacity-100 motion-reduce:hidden"
          >
            {Array.from({ length: SHUTTER_BLADES }).map((_, index) => (
              <span
                key={index}
                className="btn-viewfinder-blade h-full flex-1 origin-center bg-current opacity-25"
                style={
                  {
                    "--blade-index": index,
                  } as React.CSSProperties
                }
              />
            ))}
          </span>
        </>
      )}

      <span
        aria-hidden
        className={cn(cornerBase, "border-t border-l", cornerOffset.tl)}
      />
      <span
        aria-hidden
        className={cn(cornerBase, "border-t border-r", cornerOffset.tr)}
      />
      <span
        aria-hidden
        className={cn(cornerBase, "border-b border-l", cornerOffset.bl)}
      />
      <span
        aria-hidden
        className={cn(cornerBase, "border-b border-r", cornerOffset.br)}
      />
    </>
  );
}

export function ViewfinderContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative z-10 inline-flex items-center justify-center gap-[inherit]",
        className
      )}
    >
      {children}
    </span>
  );
}

function getViewfinderMode(
  variant: string | null | undefined,
  size: string | null | undefined
): "none" | "minimal" | "full" {
  if (variant === "link") return "none";
  if (
    size === "xs" ||
    size === "icon" ||
    size === "icon-xs" ||
    size === "icon-sm" ||
    size === "icon-lg" ||
    size === "icon-xl"
  ) {
    return "none";
  }
  if (size === "sm") return "minimal";
  return "full";
}

export { getViewfinderMode };
