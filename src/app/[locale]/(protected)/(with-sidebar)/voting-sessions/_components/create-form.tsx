"use client"
import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createVotingSession } from "./_actions"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  sessionCode: z.string().min(1, "Session code is required"),
  startDate: z.date(),
  endDate: z.date(),
  campusIds: z.array(z.string()).min(1, "At least one campus is required"),
  criteriaIds: z.array(z.string()).min(1, "At least one criterion is required"),
})

type Props = {
  campuses: { id: string; name: string }[]
  criteria: { id: string; name: string; weight: number; isVotable: boolean }[]
}

export function CreateVotingSessionForm({ campuses, criteria }: Props) {
  const router = useRouter()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      sessionCode: "",
      startDate: new Date(),
      endDate: new Date(),
      campusIds: [],
      criteriaIds: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    router.prefetch('/voting-sessions')
    try {
      const result = await createVotingSession(values)

      if (!result.success) {
        throw new Error(result.error)
      }

      toast.success('Session created successfully')
      router.push('/voting-sessions')
      router.refresh()
    } catch (error) {
      toast.error('Error creating session')
      console.error('Error:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/voting-sessions')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sessions
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Create New Voting Session</h2>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter session title" {...field} />
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
                        placeholder="Enter session description"
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
                name="sessionCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter session code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < form.getValues('startDate')}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="campusIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campuses</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {campuses.map((campus) => (
                        <div key={campus.id} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value?.includes(campus.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, campus.id])
                                : field.onChange(
                                    field.value?.filter((value) => value !== campus.id)
                                  )
                            }}
                          />
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {campus.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="criteriaIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Criteria</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {criteria.map((criterion) => (
                        <div key={criterion.id} className="flex items-center space-x-2 p-2 rounded-lg border">
                          <Checkbox
                            checked={field.value?.includes(criterion.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, criterion.id])
                                : field.onChange(
                                    field.value?.filter((value) => value !== criterion.id)
                                  )
                            }}
                          />
                          <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium leading-none">
                              {criterion.name}
                            </label>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">Weight: {criterion.weight}%</Badge>
                              {!criterion.isVotable && (
                                <Badge variant="outline">Not Votable</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/voting-sessions')}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create Session
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}