// types/campus.ts
import { z } from "zod"

export const campusSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
  imageKey: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
})

export type CampusFormValues = z.infer<typeof campusSchema>