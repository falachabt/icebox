// app/(public)/results/[sessionCode]/page.tsx
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ResultsPage from './_components/results-page';
import SessionStatusResult from '@/app/[locale]/(protected)/vote/[sessionCode]/_components/inactive-session-result';


export default async function Page({ params }: { params: { sessionCode: string } }) {
  const session = await db.votingSession.findUnique({
    where: { sessionCode: params.sessionCode },
    include: {
      campuses: true,
      criteria: true,
      
    }
  });

  console.log(session)

  if (!session) {
    return <SessionStatusResult canVote={true} /> 
  }

  return <ResultsPage initialSession={{...session, ManualScore : [], votes : [] }} />;
}