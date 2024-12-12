'use client'

import { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import type { Criterion } from '@/types/criterion'
import { createCriterion, updateCriterion } from './actions'
import { useRouter } from 'next/navigation'

const criterionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  weight: z.number().min(0).max(100, "Weight must be between 0 and 100"),
  isVotable: z.boolean().default(true),
})

interface CriteriaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  criterion: Criterion | null
}

export function CriteriaDialog({
  open,
  onOpenChange,
  criterion,
}: CriteriaDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<z.infer<typeof criterionSchema>>({
    resolver: zodResolver(criterionSchema),
    defaultValues: {
      name: "",
      description: "",
      weight: 0,
      isVotable: true,
    },
  })

  useEffect(() => {
    if (!open) {
      // When dialog closes, reset to default values
      form.reset({
        name: "",
        description: "",
        weight: 0,
        isVotable: true,
      })
    } else if (criterion) {
      // Only reset with criterion values when opening in edit mode
      form.reset({
        name: criterion.name,
        description: criterion.description || "",
        weight: criterion.weight,
        isVotable: criterion.isVotable,
      })
    }
  }, [open, criterion]) // Remove form from dependencies

  const onSubmit = async (values: z.infer<typeof criterionSchema>) => {
    setIsLoading(true)
    
    // Using Sonner's promise toast
    await toast.promise(
      async () => {
        if (criterion) {
          await updateCriterion(criterion.id, values)
        } else {
          await createCriterion(values)
        }
        onOpenChange(false)
        form.reset()
        router.refresh()
      },
      {
        loading: 'Saving criterion...',
        success: criterion 
          ? 'Criterion updated successfully' 
          : 'Criterion created successfully',
        error: 'Failed to save criterion'
      }
    )

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {criterion ? 'Edit Criterion' : 'Add New Criterion'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter criterion name" {...field} />
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
                      placeholder="Enter criterion description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min={0}
                      max={100}
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isVotable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Votable
                    </FormLabel>
                    <FormDescription>
                      Enable voting for this criterion
                    </FormDescription>
                  </div>
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
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {criterion ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}