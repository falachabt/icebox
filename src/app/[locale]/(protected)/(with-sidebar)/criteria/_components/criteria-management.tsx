// app/admin/criteria/_components/criteria-management.tsx
'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CriteriaList } from './criteria-list'
import { CriteriaDialog } from './criteria-dialog'
import type { Criterion } from '@/types/criterion'

export function CriteriaManagement() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCriterion, setEditingCriterion] = useState<Criterion | null>(null)

  const handleEdit = (criterion: Criterion) => {
    setEditingCriterion(criterion)
    setDialogOpen(true)
  }

  useEffect( () => {
    if(!dialogOpen){
      setEditingCriterion(null);
    }
  }, [dialogOpen] )

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingCriterion(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Criterion
        </Button>
      </div>

      <CriteriaList onEdit={handleEdit} />

      <CriteriaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        criterion={editingCriterion}
      />
    </div>
  )
}



