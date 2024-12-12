import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from 'next/image'
import { X } from 'lucide-react'
import { toast } from "sonner"
import { UploadButton } from "@/utils/uploadthing"
import type { Campus } from "@prisma/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CampusFormData } from './actions'
import * as z from "zod"

// Define the status type to match the Campus model
type CampusStatus = "active" | "inactive"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  imageKey: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"] as const).default("active"),
})

interface CampusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campus: Campus | null
  onSubmit: (data: CampusFormData) => Promise<void>
}

export function CampusDialog({
  open,
  onOpenChange,
  campus,
  onSubmit
}: CampusDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      imageUrl: "",
      imageKey: "",
      status: "active",
    },
  })

  // Use useEffect to update form values when campus changes
  useEffect(() => {
    if (campus) {
      // Reset form with campus data, ensuring proper type handling
      form.reset({
        name: campus.name,
        description: campus.description ?? null,
        location: campus.location ?? null,
        imageUrl: campus.imageUrl ?? null,
        imageKey: campus.imageKey ?? null,
        status: (campus.status as CampusStatus) ?? "active",
      })
    } else {
      // Reset form to default values when no campus is selected
      form.reset({
        name: "",
        description: "",
        location: "",
        imageUrl: "",
        imageKey: "",
        status: "active",
      })
    }
  }, [campus])

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      await onSubmit(values)
      toast.success(campus ? "Campus updated" : "Campus created")
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (res: { url: string; key: string }[]) => {
    const [file] = res
    if (file) {
      form.setValue('imageUrl', file.url)
      form.setValue('imageKey', file.key)
    }
  }

  const removeImage = () => {
    form.setValue('imageUrl', '')
    form.setValue('imageKey', '')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {campus ? 'Edit Campus' : 'Add New Campus'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter campus name" {...field} />
                  </FormControl>
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
                    <Textarea 
                      placeholder="Enter campus description"
                      className="h-32"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter campus location" 
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={field.value === 'active' ? 'default' : 'outline'}
                        onClick={() => field.onChange('active')}
                      >
                        Active
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === 'inactive' ? 'default' : 'outline'}
                        onClick={() => field.onChange('inactive')}
                      >
                        Inactive
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value ? (
                        <div className="relative w-full h-48">
                          <Image
                            src={field.value}
                            alt="Campus"
                            fill
                            className="object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={handleImageUpload}
                          onUploadError={(error: Error) => {
                            toast.error("Failed to upload image")
                          }}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  "Loading..."
                ) : campus ? (
                  "Update Campus"
                ) : (
                  "Create Campus"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}