// app/admin/voting-sessions/page.tsx
import { redirect } from "next/navigation"
// import { PageHeader } from "@/components/page-header"
import { VotingSessionsTable } from "./_components/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Content } from "@/components/with-sidebar/content"

export const metadata = {
  title: "Voting Sessions",
  description: "Manage and monitor voting sessions",
}

export default async function VotingSessionsPage() {
  const session = await auth()

  if (!session) {
    redirect('/signin')
  }

  const sessions = await db.votingSession.findMany({
    where: {
      adminId: session.user.id,
    },
    include: {
      campuses: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
        <Content>
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        {/* <PageHeader
          title="Voting Sessions"
          description="Manage and monitor voting sessions"
        /> */}
        <Button asChild>
          <Link href="/voting-sessions/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Session
          </Link>
        </Button>
      </div>
      <VotingSessionsTable initialSessions={sessions} />
    </div>
</Content>   
  )
}

