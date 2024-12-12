"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Rate } from 'antd'
import { submitVote } from './_actions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

type CriterionVote = {
  criterionId: string
  score: number
}

export default function VotingForm({ session }) {
  const router = useRouter()
  const [selectedCampus, setSelectedCampus] = useState(session.campuses[0]?.id)
  const [votes, setVotes] = useState<CriterionVote[]>(
    session.criteria.map(criterion => ({
      criterionId: criterion.id,
      score: 0
    }))
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleVoteChange = (criterionId: string, value: number) => {
    // Convert 5-star rating to 100-point scale
    const score = value * 20
    setVotes(prev => 
      prev.map(vote => 
        vote.criterionId === criterionId 
          ? { ...vote, score } 
          : vote
      )
    )
  }

  const handleSubmit = async () => {
    if (!selectedCampus) return

    // Validate all criteria have been rated
    const hasUnratedCriteria = votes.some(vote => vote.score === 0)
    if (hasUnratedCriteria) {
      alert('Please rate all criteria before submitting')
      return
    }

    setIsSubmitting(true)
    try {
      await submitVote({
        sessionId: session.id,
        campusId: selectedCampus,
        votes: votes
      })
      
      router.push(`/vote/${session.sessionCode}/results`)
    } catch (error) {
      console.error('Error submitting votes:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Convert score to verbal rating
  const getScoreLabel = (score: number) => {
    if (score === 0) return '---'
    if (score <= 20) return 'Poor'
    if (score <= 40) return 'Fair'
    if (score <= 60) return 'Good'
    if (score <= 80) return 'Very Good'
    return 'Excellent'
  }

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue={selectedCampus}
        onValueChange={setSelectedCampus}
        className="w-full"
      >
        <TabsList className="w-full">
          {session.campuses.map(campus => (
            <TabsTrigger
              key={campus.id}
              value={campus.id}
              className="flex-1"
            >
              {campus.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {session.campuses.map(campus => (
          <TabsContent key={campus.id} value={campus.id}>
            <div className="space-y-4">
              {session.criteria.map(criterion => {
                const currentVote = votes.find(v => v.criterionId === criterion.id)
                const score = currentVote?.score || 0
                
                return (
                  <Card key={criterion.id} className="p-4">
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{criterion.name}</h3>
                        <Badge variant="secondary">
                          Weight: {criterion.weight}%
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Rating: {getScoreLabel(score)}
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <Rate 
                        value={score / 20} // Convert 100-point scale to 5-star rating
                        onChange={value => handleVoteChange(criterion.id, value)}
                        allowHalf={false}
                        className="text-2xl"
                      />
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Votes'}
        </Button>
      </div>
    </div>
  )
}