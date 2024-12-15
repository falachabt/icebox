import { Session } from "next-auth"
import { auth } from "@/lib/auth"
import { redirect } from "@/lib/i18n"

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = (await auth()) as Session
 
  const pathname =""

  console.log("pathname", pathname)

  if (!session && !(pathname.includes("vote") && pathname.includes("result"))) {
    redirect("/login")
  }

  return <div className="w-full">{children}</div>
}
