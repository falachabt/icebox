"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useTranslations } from "next-intl"
import { FaGithub } from "react-icons/fa6"
import TypewriterComponent from "typewriter-effect"
import { useCurrentUser } from "@/lib/auth/hooks/use-current-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const SESSION_CODE_KEY = "session_code"

export function LandingHero() {
  const user = useCurrentUser()
  const t = useTranslations("Components.LandingHero")
  const router = useRouter()
  const pathname = usePathname()
  const [sessionCode, setSessionCode] = useState("")

  // Load session code from cookies on component mount
  useEffect(() => {
    const savedCode = Cookies.get(SESSION_CODE_KEY)
    if (savedCode) {
      setSessionCode(savedCode)
    }
  }, [])

  // Update cookie when session code changes
  const handleSessionCodeChange = (value: string) => {
    setSessionCode(value)
    if (value.trim()) {
      // Set cookie with 1 hour expiry
      Cookies.set(SESSION_CODE_KEY, value.trim(), { expires: 1 / 24 })
    } else {
      Cookies.remove(SESSION_CODE_KEY)
    }
  }

  const handleVoteAccess = (e: React.FormEvent) => {
    e.preventDefault()
    if (sessionCode.trim()) {
      router.push(`/vote/${sessionCode}`)
    }
  }
  

  return (
    <div className=" p-9 space-y-3 py-36 text-center font-bold sm:space-y-5   ">
      <div className="lg:text-7-xl z-50 space-y-1 text-3xl font-extrabold sm:space-y-5 sm:text-5xl md:text-6xl">
        <h1>
          {t.rich("title", {
            underline: value => (
              <span className="text-orange-500 underline">{value}</span>
            ),
            bolt: value => <span className="font-bold">{value}</span>,
          })}
        </h1>
        <div className="h-16 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent sm:h-16">
          <TypewriterComponent
            options={{
              strings: [t("lille"), t("gps"), t("manille")],
              autoStart: true,
              loop: true,
              delay: 50,
            }}
          />
        </div>
        <div className="text-sm font-medium text-zinc-600 md:text-xl">
          {t("subtitle")}
        </div>
        <div className="!mt-6 flex flex-col items-center justify-center gap-4">
          <form
            onSubmit={handleVoteAccess}
            className="flex w-full max-w-sm flex-col gap-4"
          >
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder={t("enter_session_code")}
                value={sessionCode}
                onChange={e => handleSessionCodeChange(e.target.value)}
                className="text-base font-normal"
              />
            </div>
          </form>

          <div className="flex  items-center gap-4">
            {
              <Button
                asChild
                variant={"gradient"}
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href={`/vote/${sessionCode}`} scroll={false}>
                  {t("link_signin")}
                </Link>
              </Button>
            }
              <Button
                asChild
                variant={"outline"}
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href={`/vote/${sessionCode}/result`} scroll={false}>
                  See Result
                </Link>
              </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
