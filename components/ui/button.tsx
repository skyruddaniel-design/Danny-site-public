import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  getViewfinderMode,
  ViewfinderContent,
  ViewfinderDecor,
} from "@/components/ui/button-viewfinder"

const buttonVariants = cva(
  "group/button relative isolate inline-flex shrink-0 items-center justify-center overflow-visible rounded-none border-0 bg-clip-padding text-xs font-semibold tracking-widest whitespace-nowrap uppercase transition-[color,background-color,box-shadow,transform] outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground [--btn-corner:var(--primary)] shadow-[0_4px_24px_-4px_color-mix(in_oklch,var(--glow),transparent_55%)] hover:bg-primary/92 hover:shadow-[0_6px_32px_-4px_color-mix(in_oklch,var(--glow),transparent_45%)] focus-visible:ring-primary/40",
        outline:
          "bg-transparent text-foreground [--btn-corner:var(--primary)] hover:bg-primary/8 hover:text-primary aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground [--btn-corner:var(--foreground)] hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "bg-transparent text-foreground [--btn-corner:var(--foreground)] hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive [--btn-corner:var(--destructive)] hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "bg-transparent text-primary underline underline-offset-4 hover:underline [--btn-corner:transparent]",
      },
      size: {
        default:
          "h-10 gap-1.5 px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        lg: "h-11 gap-1.5 px-8 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        xl: "h-14 gap-2 px-12 has-data-[icon=inline-end]:pr-7 has-data-[icon=inline-start]:pl-7 text-sm",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
        "icon-xl": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const viewfinderMode = getViewfinderMode(variant, size);

  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {viewfinderMode !== "none" && (
        <ViewfinderDecor mode={viewfinderMode} />
      )}
      <ViewfinderContent>{children}</ViewfinderContent>
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants, ViewfinderContent, ViewfinderDecor }
