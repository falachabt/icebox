// app/(public)/vote/[sessionCode]/page.tsx
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import VotingForm from './_components/voting-form'
import InactiveSessionResult from './_components/inactive-session-result'
import { hasAlreadyTakenVote } from './_components/_actions'

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
      }
    }
  })

  const canVote = await hasAlreadyTakenVote({ sessionCode : sessionCode });

  if(!canVote.success){
    return <InactiveSessionResult canVote = { canVote.success }  />
  }

  // If session exists but is not active
  if (!session?.isActive) {
    return <InactiveSessionResult canVote = { true }  />
  }

  return (
    <div className="bg-background">
      <main className="max-w-screen-2xl mx-auto">
        <VotingForm session={session} />
      </main>
    </div>
  )
}