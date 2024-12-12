// app/(public)/vote/[sessionCode]/_actions.ts
'use server'

import { db } from '@/lib/db'
import { getSession } from 'next-auth/react'


type VoteSubmission = {
  sessionId: string
  campusId: string
  votes: Array<{
    criterionId: string
    score: number
  }>
}

export async function submitVote({
  sessionId,
  campusId,
  votes,
}: VoteSubmission) {
  try {
    const session = await getSession()
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
            userId: session.user.id,
            sessionId,
            campusId,
            criterionId: vote.criterionId,
          },
        })
      )
    )

    return { success: true }
  } catch (error) {
    console.error('Error submitting vote:', error)
    return { success: false, error: error.message }
  }
}