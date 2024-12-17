import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { sessionCode: string } }) {
  try {
    const session = await db.votingSession.findUnique({
      where: { sessionCode: params.sessionCode },
      
      include: {
        campuses: true,
        criteria: true,
      },
    });

    console.log(session)

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
