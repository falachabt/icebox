import { Session } from "next-auth"
import { auth } from "@/lib/auth"
import { redirect } from "@/lib/i18n"

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = (await auth()) as Session
 
  if (!session ) {
    redirect("/signin")
  }

  return <div className="w-full">{children}</div>
}
