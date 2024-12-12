'use client'

import { Table } from "@/components/ui/table"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Edit, Trash2, Loader2 } from "lucide-react"
import useSWR from 'swr'
import type { Criterion } from '@/types/criterion'
import { fetchCriteria, deleteCriterion } from './actions'
import { useState } from "react"

interface CriteriaListProps {
  onEdit: (criterion: Criterion) => void
}

const fetcher = async () => {
  const data = await fetchCriteria()
  return data
}

export function CriteriaList({ onEdit }: CriteriaListProps) {
  const { data: criteria, error, mutate } = useSWR<Criterion[]>('/api/criteria', fetcher)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteCriterion(id)
      toast.success("Criterion deleted successfully")
      mutate()
    } catch (error) {
      toast.error("Failed to delete criterion")
    } finally {
      setDeletingId(null)
    }
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive p-4">
        <p className="text-destructive">Failed to load criteria</p>
      </div>
    )
  }

  if (!criteria) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Weight (%)</TableHead>
            <TableHead>Votable</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {criteria.map((criterion) => (
            <TableRow key={criterion.id}>
              <TableCell>{criterion.name}</TableCell>
              <TableCell className="max-w-[300px] truncate">
                {criterion.description}
              </TableCell>
              <TableCell>{criterion.weight}%</TableCell>
              <TableCell>{criterion.isVotable ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(criterion)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(criterion.id)}
                    disabled={deletingId === criterion.id}
                  >
                    {deletingId === criterion.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}