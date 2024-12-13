import { redirect } from "next/navigation"
import { Session } from "next-auth"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"




export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = (await auth()) as Session
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || ''


  if (!session && !(pathname.includes("vote") && pathname.includes("result"))) {
    redirect("/login")
  }

  return <div className="w-full">{children}</div>
}
