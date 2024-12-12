'use server'

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import type { Campus } from "@prisma/client"

export type CampusFormData = {
  name: string
  description?: string | null
  location?: string | null
  imageUrl?: string | null
  imageKey?: string | null
  status: "active" | "inactive"
}

export async function getCampuses() {
  try {
    const campuses = await db.campus.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return { campuses }
  } catch (error) {
    return { error: 'Failed to fetch campuses' }
  }
}

export async function getCampusById(id: string) {
  try {
    const campus = await db.campus.findUnique({
      where: { id }
    })
    return { campus }
  } catch (error) {
    return { error: 'Failed to fetch campus' }
  }
}

export async function createCampus(data: CampusFormData) {
  try {
    const campus = await db.campus.create({
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        imageUrl: data.imageUrl,
        imageKey: data.imageKey,
        status: data.status,
      }
    })

    revalidatePath('/admin/campuses')
    return { campus }
  } catch (error) {
    return { error: 'Failed to create campus' }
  }
}

export async function updateCampus(id: string, data: CampusFormData) {
  try {
    const campus = await db.campus.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        imageUrl: data.imageUrl,
        imageKey: data.imageKey,
        status: data.status,
      }
    })

    revalidatePath('/admin/campuses')
    return { campus }
  } catch (error) {
    return { error: 'Failed to update campus' }
  }
}

export async function deleteCampus(id: string) {
  try {
    // First check if campus is being used in any voting sessions
    const existingVotingSession = await db.votingSession.findFirst({
      where: {  campuses : {
        some: { id }
      } }
    })

    if (existingVotingSession) {
      return { error: 'Cannot delete campus that is being used in voting sessions' }
    }

    // If not in use, proceed with deletion
    const campus = await db.campus.delete({
      where: { id }
    })

    revalidatePath('/admin/campuses')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete campus' }
  }
}