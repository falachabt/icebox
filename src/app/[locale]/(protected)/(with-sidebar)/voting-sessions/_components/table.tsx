'use client'

import { useOptimistic } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Eye, 
  MoreVertical, 
  Edit, 
  Trash,
  CheckCircle,
  XCircle 
} from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { deleteVotingSession } from './_actions'

interface Session {
  id: string
  title: string
  sessionCode: string
  startDate: Date
  endDate: Date
  isActive: boolean
  campuses: {
    name: string
  }[]
  _count: {
    votes: number
  }
}

interface Props {
  initialSessions: Session[]
}

export function VotingSessionsTable({ initialSessions }: Props) {
  const [sessions, optimisticDeleteSession] = useOptimistic(
    initialSessions,
    (state, sessionId: string) =>
      state.filter(session => session.id !== sessionId)  
  )

  const handleDelete = async (id: string) => {
    try {
      // Optimistically remove the session
      optimisticDeleteSession(id)

      const result = await deleteVotingSession(id)

      if (!result.success) {
        throw new Error(result.error)
      }

      toast.success('Session deleted successfully')
    } catch (error) {
      toast.error('Error deleting session')
      console.error('Error:', error)
    }
  }

  return (
    <Card>
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Session Code</TableHead>
              <TableHead>Campuses</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.title}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-2 py-1">
                    {session.sessionCode}
                  </code>
                </TableCell>
                <TableCell>
                  {session.campuses.map((campus) => campus.name).join(', ')}
                </TableCell>
                <TableCell>{format(new Date(session.startDate), 'PPP')}</TableCell>
                <TableCell>{format(new Date(session.endDate), 'PPP')}</TableCell>
                <TableCell>
                  <Badge
                    variant={session.isActive ? 'default' : 'secondary'}
                  >
                    {session.isActive ? (
                      <CheckCircle className="mr-1 h-4 w-4" />
                    ) : (
                      <XCircle className="mr-1 h-4 w-4" />
                    )}
                    {session.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>{session._count.votes}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/voting-sessions/${session.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Results
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(session.id)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}