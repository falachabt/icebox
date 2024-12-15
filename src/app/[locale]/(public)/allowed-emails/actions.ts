'use server'

import { db } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const allowedEmailsSchema = z.object({
  code: z.string().min(1, "Code is required"),
  emails: z.array(
    z.object({
      email: z.string().email("Invalid email address"),
      role: z.enum(["ADMIN", "JURY"])
    })
  ).min(1, "At least one email is required"),
})

type AllowedEmailsInput = z.infer<typeof allowedEmailsSchema>

export async function addAllowedEmails(data: AllowedEmailsInput) {
  try {
    const validated = allowedEmailsSchema.parse(data)
    
    // First check if the provided code exists
    const existingCode = await db.addAllowEmailCode.findFirst({
      where: {
        code: validated.code
      }
    })

    if (!existingCode) {
      return { 
        success: false, 
        message: "Invalid or unknown add code. Please verify the code and try again." 
      }
    }

    // Check for existing emails
    const existingEmails = await db.allowedEmails.findMany({
      where: {
        AND: [
          { allowedCodeId: existingCode.id },
          { email: { in: validated.emails.map(e => e.email) } }
        ]
      },
      select: {
        email: true
      }
    })

    const existingEmailList = existingEmails.map(e => e.email)
    const newEmails = validated.emails.filter(e => !existingEmailList.includes(e.email))

    if (newEmails.length === 0) {
      return {
        success: false,
        message: "All provided emails are already registered with this code",
        existingEmails: existingEmailList
      }
    }

    // Add only the new emails
    const result = await db.allowedEmails.createMany({
      data: newEmails.map(({ email, role }) => ({
        email,
        role,
        allowedCodeId: existingCode.id
      })),
      skipDuplicates: true,
    })

    revalidatePath('/settings/allowed-emails')
    
    const message = existingEmailList.length > 0
      ? `Added ${result.count} new email(s). Skipped ${existingEmailList.length} existing email(s): ${existingEmailList.join(", ")}`
      : `Successfully added ${result.count} new allowed email(s)`

    return { 
      success: true, 
      addedCount: result.count,
      message,
      existingEmails: existingEmailList
    }
  } catch (error) {
    if ((error as { code?: string })?.code === 'P2002') {
      return { success: false, message: "Some emails are already registered with this code" }
    }

    console.error("Error adding allowed emails:", error)
    return { success: false, message: "Failed to add allowed emails" }
  }
}