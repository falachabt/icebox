// app/api/results/[sessionCode]/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { sessionCode: string } }
) {
  try {
    const session = await db.votingSession.findUnique({
      where: { 
        sessionCode: params.sessionCode 
      },
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

    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Session not found' },
    //     { status: 404 }
    //   );
    // }

    return NextResponse.json(session);

  } catch (error) {
    console.error('Error fetching session results:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}