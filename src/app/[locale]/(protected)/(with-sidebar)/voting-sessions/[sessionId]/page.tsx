// app/voting-sessions/[sessionId]/page.tsx
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import VotingSessionPage from './_components/voting-session-page';
import { Content } from '@/components/with-sidebar/content';

export async function generateMetadata({ params }: { params: { sessionId: string } }) {
  const session = await db.votingSession.findUnique({
    where: { id: params.sessionId },
    select: { title: true, description: true }
  });

  return {
    title: session?.title ?? 'Voting Session',
    description: session?.description ?? 'Compare campuses according to their presentations'
  };
}

export default async function Page({ params }: { params: { sessionId: string } }) {
  const session = await db.votingSession.findUnique({
    where: { id: params.sessionId },
    include: {
      campuses: true,
      criteria: true,
      votes: {
        select: {
          id: true,
          score: true,
          campusId: true,
          criterionId: true,
        }
      },
      ManualScore: {
        select: {
          score: true,
          campusId: true,
          criterionId: true,
        }
      }
    }
  });

  if (!session) {
    notFound();
  }

  return (
    <Content>
      <VotingSessionPage session={session} />
    </Content>
  );
}