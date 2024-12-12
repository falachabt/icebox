'use server'

import { db } from "@/lib/db";
// import { } from "@/li"
import { revalidatePath } from "next/cache";

type ManualScoreInput = {
  sessionId: string;
  campusId: string;
  criterionId: string;
  score: number;
};

export async function upsertManualScore({
  sessionId,
  campusId,
  criterionId,
  score
}: ManualScoreInput) {
  try {
    await db.manualScore.upsert({
      where: {
        sessionId_campusId_criterionId: {
          sessionId,
          campusId,
          criterionId
        }
      },
      update: {
        score,
        updatedAt: new Date()
      },
      create: {
        sessionId,
        campusId,
        criterionId,
        score
      }
    });

    revalidatePath(`/voting-sessions/${sessionId}`);
    return { success: true };
  } catch (error) {
    console.error('Error saving manual score:', error);
    return { success: false, error: 'Failed to save score' };
  }
}

export async function updateSessionStatus(sessionId: string, isActive: boolean) {
  try {
    await db.votingSession.update({
      where: { id: sessionId },
      data: { isActive }
    });

    revalidatePath(`/voting-sessions/${sessionId}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating session status:', error);
    return { success: false, error: 'Failed to update session status' };
  }
}