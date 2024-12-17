import { Sidebar } from "@/components/with-sidebar/sidebar"
import { auth } from "@/lib/auth"
import { redirect } from "@/lib/i18n";

export default async function WithSidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const d = await auth();

  if( d?.user?.role !== "ADMIN" ){
    redirect("/404?error=AccessDeniedAdmin")
  }

  return (
    <div className="flex w-full">
      <Sidebar />
      {children}
    </div>
  )
}
