// app/admin/voting-sessions/create/page.tsx
import { redirect } from "next/navigation"
// import { PageHeader } from "@/components/page-header"
import { CreateVotingSessionForm } from "../_components/create-form"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Content } from "@/components/with-sidebar/content"

export const metadata = {
  title: "Create Voting Session",
  description: "Create a new voting session",
}

export default async function CreateVotingSessionPage() {
  const session = await auth()

  if (!session) {
    redirect('/signin')
  }

  // Fetch campuses and criteria for the form
  const [campuses, criteria] = await Promise.all([
    db.campus.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        status: "active",
      },
      orderBy: {
        name: 'asc',
      },
    }),
    db.criterion.findMany({
      select: {
        id: true,
        name: true,
        weight : true,
        isVotable : true,
      },
      orderBy: {
        name: 'asc',
      },
    }),
  ])

  return (
    <Content>

    <div className="flex flex-col gap-6">
      {/* <PageHeader
        title="Create Voting Session"
        description="Set up a new voting session for campus evaluation"
      /> */}
      <CreateVotingSessionForm 
        campuses={campuses}
        criteria={criteria}
        />
    </div>
        </Content> 
  )
}