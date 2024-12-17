// app/(public)/vote/[sessionCode]/_actions.ts
'use server'

import { auth } from '@/lib/auth';
import { db } from '@/lib/db'

interface VoteItem {
  criterionId: string;
  score: number;
  campusId: string;
}

type VoteSubmission = {
  sessionId: string
  votes: VoteItem[]
}

export async function hasAlreadyTakenVote({ sessionCode }: { sessionCode: string }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { 
        success: false, 
        error: 'No loged user found' 
      }
      // throw new Error('Not authenticated')
    }

    // Get the voting session with its criteria and campuses
    const votingSession = await db.votingSession.findUnique({
      where: { sessionCode },
      include: {
        criteria: {
          where: { isVotable: true }
        },
        campuses: true
      }
    })

    if (!votingSession) {
      return { 
        success: false, 
        error: 'Voting session not found' 
      }
    }

    // Check for existing votes for any campus and any criterion
    const existingVotes = await db.vote.findMany({
      where: {
        userId: session.user.id,
        sessionId: votingSession.id,
        AND: [
          {
            campusId: {
              in: votingSession.campuses.map(campus => campus.id)
            }
          },
          {
            criterionId: {
              in: votingSession.criteria.map(criterion => criterion.id)
            }
          }
        ]
      },
      include: {
        campus: true,
        criterion: true
      }
    })

    if (existingVotes.length > 0) {
      // Get unique campuses and criteria using Object.values and reduce
      const votedCampuses = Object.values(
        existingVotes.reduce((acc, vote) => {
          acc[vote.campusId] = vote.campus.name;
          return acc;
        }, {} as { [key: string]: string })
      );

      const votedCriteria = Object.values(
        existingVotes.reduce((acc, vote) => {
          acc[vote.criterionId] = vote.criterion.name;
          return acc;
        }, {} as { [key: string]: string })
      );
      
      return { 
        success: false, 
        error: 'Already voted',
        details: {
          votedCampuses,
          votedCriteria,
          totalVotes: existingVotes.length,
          isComplete: existingVotes.length === (votingSession.campuses.length * votingSession.criteria.length)
        }
      }
    }

    return { 
      success: true,
      details: {
        requiredVotes: votingSession.campuses.length * votingSession.criteria.length
      }
    }

  } catch (error) {
    console.error('Error checking votes:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}



export async function submitVote({
  sessionId,
  votes,
}: VoteSubmission) {
  try {
    const session = await auth()

    
    
    if (!session?.user?.id) {
      throw new Error('Not authenticated')
    }

    // Check if user has already voted
    const existingVotes = await db.vote.findFirst({
      where: {
        sessionId,
        userId: session.user.id,
      },
    })

    if (existingVotes) {
      throw new Error('Already voted')
    }

    // Create all votes in a transaction
    await db.$transaction(
      votes.map(vote => 
        db.vote.create({
          data: {
            score: vote.score,
            userId: session.user.id || "",
            sessionId,
            campusId: vote.campusId,
            criterionId: vote.criterionId,
          },
        })
      )
    )

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error submitting vote:', error)
      return { success: false, error: error.message }
    }
    return { success: false, error: 'An unexpected error occurred' }
  }
}