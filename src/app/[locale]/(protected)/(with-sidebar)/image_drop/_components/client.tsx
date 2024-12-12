// app/campus/_components/client.tsx
'use client'

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Campus } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { CampusDialog } from "./campus-dialog"
import { CampusTable } from "./campus-table"
import { createCampus, updateCampus, deleteCampus } from "./actions"
import type { CampusFormData } from "./actions"

interface CampusClientProps {
  initialCampuses: Campus[]
}

export function CampusClient({ initialCampuses }: CampusClientProps) {
  const [campuses, setCampuses] = useState<Campus[]>(initialCampuses)
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null)
  const [open, setOpen] = useState(false)

  useEffect( () => {
    !open && setSelectedCampus(null)
  } , [open] )

  const handleCreate = async (data: CampusFormData) => {
    const { campus, error } = await createCampus(data)
    if (campus) {
      setCampuses([campus, ...campuses])
      setOpen(false)
    }
  }

  const handleUpdate = async (data: CampusFormData) => {
    if (!selectedCampus) return

    const { campus, error } = await updateCampus(selectedCampus.id, data)
    if (campus) {
      setCampuses(campuses.map(c => c.id === campus.id ? campus : c))
      setOpen(false)
      setSelectedCampus(null)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await deleteCampus(id)
    if (!error) {
      setCampuses(campuses.filter(c => c.id !== id))
    }
  }

  const onEdit = (campus: Campus) => {
    setSelectedCampus(campus)
    setOpen(true)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Campus
        </Button>
      </div>

      <CampusTable
        campuses={campuses}
        onEdit={onEdit}
        onDelete={handleDelete}
      />

      <CampusDialog
        open={open}
        onOpenChange={setOpen}
        campus={selectedCampus}
        onSubmit={selectedCampus ? handleUpdate : handleCreate}
      />
    </div>
  )
}