// app/(public)/vote/[sessionCode]/page.tsx
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import VotingForm from './_components/voting-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function VotingPage({ 
  params: { sessionCode } 
}: { 
  params: { sessionCode: string } 
}) {
  const session = await db.votingSession.findUnique({
    where: { 
      sessionCode,
      isActive: true
    },
    include: {
      campuses: true,
      criteria: {
        where: {
          isVotable: true
        }
      },
      
    }
  })

  // if (!session) {
  //   notFound()
  // }

  // If session exists but is not active
  if (!session?.isActive) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Session Not Active</CardTitle>
            <CardDescription>
              This voting session is currently not active. Please contact the administrator.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // If user has already voted
  // if (session.votes.length > 0) {
  //   redirect(`/vote/${sessionCode}/results`)
  // }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{session.title}</CardTitle>
          {session.description && (
            <CardDescription>{session.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <VotingForm session={session} />
        </CardContent>
      </Card>
    </div>
  )
}