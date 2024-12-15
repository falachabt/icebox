'use client'

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addAllowedEmails } from "../actions"

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  description: z.string().min(1, "Description is required"),
  emails: z.array(
    z.object({
      email: z.string().email("Invalid email address"),
      role: z.enum(["ADMIN", "JURY"], {
        required_error: "Role is required",
      }),
    })
  ).min(1, "At least one email is required"),
})

type FormValues = z.infer<typeof formSchema>

export default function AllowedEmailsForm() {
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      description: "",
      emails: [{ email: "", role: "JURY" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "emails",
    control: form.control,
  })

  async function onSubmit(data: FormValues) {
    setLoading(true)
    try {
      const result = await addAllowedEmails(data)
      
      if (result.success) {
        toast.success(result.message)
        form.reset()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter code" {...field} />
              </FormControl>
              <FormDescription>
                Enter a unique code for this group of allowed emails
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormDescription>
                Provide a description for this group of emails
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <FormField
                control={form.control}
                name={`emails.${index}.email`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Email {index + 1}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`emails.${index}.role`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="JURY">Jury</SelectItem>
                        {/* <SelectItem value="ADMIN">Admin</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {index > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="mb-2"
                  onClick={() => remove(index)}
                >
                  -
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ email: "", role: "JURY" })}
          >
            Add Another Email
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Allowed Emails"}
          </Button>
        </div>
      </form>
    </Form>
  )
}