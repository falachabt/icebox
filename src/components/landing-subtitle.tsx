import { cn } from "@/lib/utils"

export function LandingSubtitle({
  children,
  className,
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-base font-bold text-orange-500 lg:text-xl", className)}
    >
      {children}
    </p>
  )
}
