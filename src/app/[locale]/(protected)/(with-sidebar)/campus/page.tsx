// app/campus/page.tsx
import { Suspense } from "react"
import { getCampuses } from "./_components/actions"
import { CampusClient } from "./_components/client"
import { Skeleton } from "@/components/ui/skeleton"
import { Content } from "@/components/with-sidebar/content"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CampusPage() {
  const { campuses, error } = await getCampuses()
  
  return (
    <Content>

    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Campus Management</h2>
      </div>

      <Suspense fallback={<Skeleton className="w-full h-[200px]" />}>
        <CampusClient initialCampuses={campuses || []} />
      </Suspense>
    </div>
    </Content> 
  )
}
