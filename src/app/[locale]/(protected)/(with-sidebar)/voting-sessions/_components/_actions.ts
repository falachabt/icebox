'use server'

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createVotingSession(formData: {
  title: string
  description?: string
  sessionCode: string
  startDate: Date
  endDate: Date
  campusIds: string[]
  criteriaIds: string[]
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Not authenticated")
    }
    
    const votingSession = await db.votingSession.create({
      data: {
        title: formData.title,
        description: formData.description,
        sessionCode: formData.sessionCode,
        startDate: formData.startDate,
        endDate: formData.endDate,
        adminId: session.user.id,
        campuses: {
            connect: formData.campusIds.map(id => ({ id })),
        },
        criteria: {
          connect: formData.criteriaIds.map(id => ({ id })),
        },
      },
    })

    revalidatePath('/admin/voting-sessions')
    return { success: true, data: votingSession }
  } catch (error) {
    console.error('[CREATE_VOTING_SESSION]', error)
    return { success: false, error: 'Failed to create voting session' }
  }
}

export async function deleteVotingSession(id: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Not authenticated")
    }

    await db.votingSession.delete({
      where: {
        id,
        adminId: session.user.id,
      },
    })

    revalidatePath('/admin/voting-sessions')
    return { success: true }
  } catch (error) {
    console.error('[DELETE_VOTING_SESSION]', error)
    return { success: false, error: 'Failed to delete voting session' }
  }
}

export async function updateVotingSession(id: string, formData: {
  title: string
  description?: string
  sessionCode: string
  startDate: Date
  endDate: Date
  isActive: boolean
  campusIds: string[]
  criteriaIds: string[]
}) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Not authenticated")
    }

    const votingSession = await db.votingSession.update({
      where: {
        id,
        adminId: session.user.id,
      },
      data: {
        title: formData.title,
        description: formData.description,
        sessionCode: formData.sessionCode,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
        campuses: {
            set: formData.campusIds.map(id => ({ id })),
        },
        criteria: {
          set: formData.criteriaIds.map(id => ({ id })),
        },
      },
    })

    revalidatePath('/admin/voting-sessions')
    return { success: true, data: votingSession }
  } catch (error) {
    console.error('[UPDATE_VOTING_SESSION]', error)
    return { success: false, error: 'Failed to update voting session' }
  }
}