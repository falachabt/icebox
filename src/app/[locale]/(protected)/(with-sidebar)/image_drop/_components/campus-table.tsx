'use client'

import Image from "next/image"
import { Pencil, Trash } from "lucide-react"
import { Campus } from "@prisma/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface CampusTableProps {
  campuses: Campus[]
  onEdit: (campus: Campus) => void
  onDelete: (id: string) => Promise<void>
}

export function CampusTable({ 
  campuses,
  onEdit,
  onDelete
}: CampusTableProps) {
  const activeCampuses = campuses.filter(campus => campus.status === 'active').length
  const totalCampuses = campuses.length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-x-4">
        <div className="border rounded-md px-3 py-2">
          <p className="text-sm font-medium">Total Sites</p>
          <p className="text-2xl font-bold">{totalCampuses}</p>
        </div>
        <div className="border rounded-md px-3 py-2">
          <p className="text-sm font-medium">Active Sites</p>
          <p className="text-2xl font-bold text-green-600">{activeCampuses}</p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campuses.map((campus) => (
              <TableRow key={campus.id}>
                <TableCell>
                  {campus.imageUrl ? (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={campus.imageUrl}
                        alt={campus.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                      No image
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{campus.name}</TableCell>
                <TableCell>{campus.location || 'Not specified'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    campus.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {campus.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(campus)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this campus?')) {
                          onDelete(campus.id)
                        }
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}