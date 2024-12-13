// components/ui/logo.tsx
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { appConfig } from "@/../app.config"

export function Logo({
  href = "/",
  inverted,
}: {
  href?: string
  inverted?: boolean
}) {
  return (
    <Link
      className={cn(
        "flex items-center space-x-1 text-xl font-bold",
        !inverted
          ? "text-black hover:text-zinc-500 dark:text-white"
          : "text-white hover:text-zinc-500 dark:text-black",
      )}
      href={href}
      aria-label={`Go to ${appConfig.name} homepage`}
    >
      <span
        className="overflow-hidden rounded-lg text-orange-500"
        aria-hidden="true"
      >
        <Image
          src="/favicon-32x32.png"
          alt={`${appConfig.name} logo`}
          width={24}
          height={24}
          className="h-6 w-6"
          priority
        />
      </span>
      <span className="text-xl font-extrabold">{appConfig.name}</span>
    </Link>
  )
}