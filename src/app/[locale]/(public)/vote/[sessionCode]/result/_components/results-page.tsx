"use client"

import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Trophy } from "lucide-react"
import ReactConfetti from "react-confetti"
import Confetti from "react-confetti"
import useWindowSize from "react-use/lib/useWindowSize"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Types for our data
type Criterion = {
  id: string
  name: string
  weight: number
}

type Campus = {
  id: string
  name: string
}

type Vote = {
  id: string
  score: number
  campusId: string
  criterionId: string
}

type ManualScore = {
  score: number
  campusId: string
  criterionId: string
}

type Session = {
  id: string | undefined
  title: string
  sessionCode: string
  adminId: string
  isActive: Boolean
  campuses: Campus[]
  criteria: Criterion[]
  votes: Vote[]
  ManualScore: ManualScore[]
}

// Animated Number Component
const AnimatedNumber = ({
  value,
  previousValue,
  className = "",
}: {
  value: number
  previousValue?: number
  className?: string
}) => {
  const isIncreasing = previousValue !== undefined && value > previousValue
  const isDecreasing = previousValue !== undefined && value < previousValue

  return (
    <motion.span
      key={value}
      initial={{
        opacity: 0,
        y: isIncreasing ? 20 : isDecreasing ? -20 : 0,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`
        ${className}
        ${isIncreasing ? "text-green-500" : ""}
        ${isDecreasing ? "text-red-500" : ""}
      `}
    >
      {value.toFixed(1)}
    </motion.span>
  )
}

const useSessionResults = (sessionCode: string) => {
  return useSWR<Session>(
    `/api/results/${sessionCode}`,
    async url => {
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error("Failed to fetch session results")
      }
      return res.json()
    },
    {
      refreshInterval: 1000,
      revalidateOnFocus: true,
      refreshWhenHidden: true,
      dedupingInterval: 1000,
    },
  )
}

const calculateScores = (session: Session) => {
  const campusScores = session.campuses
    .map(campus => {
      let totalScore = 0
      const criteriaScores: Record<string, number> = {}

      session.criteria.forEach(criterion => {
        const votes = session.votes.filter(
          v => v.campusId === campus.id && v.criterionId === criterion.id,
        )

        const manualScores = session.ManualScore.filter(
          s => s.campusId === campus.id && s.criterionId === criterion.id,
        )

        const avgVoteScore = votes.length
          ? votes.reduce((sum, v) => sum + v.score, 0) / votes.length
          : 0

        const avgManualScore = manualScores.length
          ? manualScores.reduce((sum, s) => sum + s.score, 0) /
            manualScores.length
          : 0

        const criterionScore = (avgVoteScore + avgManualScore) / 2
        const weightedScore = criterionScore * (criterion.weight / 100)

        criteriaScores[criterion.id] = criterionScore
        totalScore += weightedScore
      })

      return {
        campusId: campus.id,
        campusName: campus.name,
        totalScore,
        criteriaScores,
      }
    })
    .sort((a, b) => b.totalScore - a.totalScore)

  return campusScores
}

const Podium = ({
  scores,
  previousScores,
}: {
  scores: ReturnType<typeof calculateScores>
  previousScores?: ReturnType<typeof calculateScores>
}) => {
  const top3 = scores.slice(0, 3)
  const heights = ["h-40", "h-32", "h-24"]
  const positions = ["order-2", "order-1", "order-3"]
  const colors = [
    "bg-gradient-to-t from-yellow-600 to-yellow-400",
    "bg-gradient-to-t from-gray-400 to-gray-300",
    "bg-gradient-to-t from-orange-700 to-orange-500",
  ]

  return (
    <div className="mb-8 mt-5 flex items-end justify-center gap-8 px-4">
      <AnimatePresence>
        {top3.map((score, index) => {
          const previousScore = previousScores?.find(
            ps => ps.campusId === score.campusId,
          )
          const previousPosition =
            previousScores?.findIndex(ps => ps.campusId === score.campusId) ??
            -1
          const isWinner = index === 0

          return (
            <motion.div
              key={score.campusId}
              layout
              className={`flex flex-col items-center ${positions[index]}`}
              initial={previousPosition === -1 ? { opacity: 0, y: 50 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                layout: { type: "spring", bounce: 0.25 },
                default: { duration: 0.5 },
              }}
            >
              <div
                className={`relative mb-2 text-center transition-transform ${isWinner ? "scale-150" : index === 1 ? "scale-125" : ""}`}
              >
                {isWinner && (
                  <motion.div
                    className="absolute -top-5 left-[15%] -translate-x-1/2"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </motion.div>
                )}

                {!isWinner && (
                  <motion.div
                    className="absolute -top-8 left-[15%] -translate-x-1/2"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Trophy className="h-7 w-7 " />
                  </motion.div>
                )}
                <p
                  className={`font-bold ${isWinner ? "mt-4 text-yellow-500" : ""}`}
                >
                  {score.campusName}
                </p>
                <AnimatedNumber
                  value={score.totalScore}
                  previousValue={previousScore?.totalScore}
                  className={`text-2xl font-bold ${isWinner ? "text-yellow-500" : ""}`}
                />
              </div>
              <motion.div
                className={`w-24 ${heights[index]} ${colors[index]} rounded-t-lg shadow-lg`}
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{ duration: 0.5 }}
              />
              <div
                className={`mt-2 text-xl font-bold ${isWinner ? "mt-4 scale-150 text-yellow-500" : ""}`}
              >
                #{index + 1}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

const DetailedScores = ({
  scores,
  criteria,
  previousScores,
}: {
  scores: ReturnType<typeof calculateScores>
  criteria: Criterion[]
  previousScores?: ReturnType<typeof calculateScores>
}) => {
  return (
    <motion.div
      layout
      className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence>
        {scores.slice(0, 3).map((score, index) => {
          const previousScore = previousScores?.find(
            ps => ps.campusId === score.campusId,
          )
          const isWinner = index === 0

          return (
            <motion.div
              key={score.campusId}
              layout
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                layout: { type: "spring", bounce: 0.25 },
                default: { delay: index * 0.2 },
              }}
              className={isWinner ? "relative" : ""}
            >
              {isWinner && (
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 opacity-75 blur" />
              )}
              <Card
                className={isWinner ? "relative bg-white/90 shadow-xl" : ""}
              >
                <CardHeader
                  className={
                    isWinner
                      ? "rounded-t-lg bg-gradient-to-r from-yellow-50 to-yellow-100"
                      : ""
                  }
                >
                  <CardTitle className="flex items-center gap-2">
                    {isWinner && <Trophy className="h-5 w-5 text-yellow-500" />}
                    <span className={isWinner ? "text-yellow-700" : ""}>
                      #{index + 1}
                    </span>
                    <span className={isWinner ? "text-yellow-700" : ""}>
                      {score.campusName}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {criteria.map(criterion => {
                    const previousCriterionScore =
                      previousScore?.criteriaScores[criterion.id]
                    return (
                      <div
                        key={criterion.id}
                        className="mb-2 flex justify-between"
                      >
                        <span>{criterion.name}</span>
                        <AnimatedNumber
                          value={score.criteriaScores[criterion.id] || 0}
                          previousValue={previousCriterionScore}
                          className={isWinner ? "text-yellow-600" : ""}
                        />
                      </div>
                    )
                  })}
                  <div className="mt-4 border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <AnimatedNumber
                        value={score.totalScore}
                        previousValue={previousScore?.totalScore}
                        className={isWinner ? "text-yellow-600" : ""}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}

const Leaderboard = ({
  scores,
  criteria,
  previousScores,
}: {
  scores: ReturnType<typeof calculateScores>
  criteria: Criterion[]
  previousScores?: ReturnType<typeof calculateScores>
}) => {
  if (scores.length <= 3) return null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Full Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Campus</TableHead>
                {criteria.map(criterion => (
                  <TableHead key={criterion.id}>{criterion.name}</TableHead>
                ))}
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score, index) => {
                const previousScore = previousScores?.find(
                  ps => ps.campusId === score.campusId,
                )
                const isWinner = index === 0

                return (
                  <motion.tr
                    key={score.campusId}
                    layout
                    initial={false}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={isWinner ? "bg-yellow-50" : ""}
                  >
                    <TableCell
                      className={isWinner ? "font-bold text-yellow-700" : ""}
                    >
                      #{index + 1}
                    </TableCell>
                    <TableCell
                      className={isWinner ? "font-bold text-yellow-700" : ""}
                    >
                      {score.campusName}
                    </TableCell>
                    {criteria.map(criterion => (
                      <TableCell key={criterion.id}>
                        <AnimatedNumber
                          value={score.criteriaScores[criterion.id] || 0}
                          previousValue={
                            previousScore?.criteriaScores[criterion.id]
                          }
                          className={isWinner ? "text-yellow-600" : ""}
                        />
                      </TableCell>
                    ))}
                    <TableCell
                      className={`font-bold ${isWinner ? "text-yellow-600" : ""}`}
                    >
                      <AnimatedNumber
                        value={score.totalScore}
                        previousValue={previousScore?.totalScore}
                      />
                    </TableCell>
                  </motion.tr>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}


const ResultConfetti = ({ session, currentSession }: { 
  session: Session | undefined
  currentSession: Session | undefined 
}) => {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Show confetti when session exists and both session and currentSession are not active
    if (session && (!currentSession?.isActive || !session?.isActive)) {
      setShowConfetti(true)
      
      // Optional: Hide confetti after some time
      const timer = setTimeout(() => setShowConfetti(false), 18000)
      return () => clearTimeout(timer)
    } else {
      setShowConfetti(false)
    }
  }, [session, currentSession?.isActive, session?.isActive])

  if (!showConfetti) return null

  return (
    <Confetti 
      width={window.innerWidth} 
      numberOfPieces={850}
      recycle = {true}
      // recycle={false}  // This ensures confetti doesn't loop
    />
  )
}


const ResultsPage = ({ initialSession }: { initialSession: Session }) => {
  const { data: session } = useSessionResults(initialSession.sessionCode)
  const [previousScores, setPreviousScores] =
    useState<ReturnType<typeof calculateScores>>()

  const currentSession = session || initialSession
  const scores = calculateScores(currentSession)

  useEffect(() => {
    if (session) {
      setPreviousScores(calculateScores(currentSession))
    }
  }, [session])

  return (
    <div className="container mx-auto space-y-8 py-8">
      

      <motion.h1
        className="mb-20 text-center text-3xl font-bold"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {currentSession.title}
      </motion.h1>

      <Podium scores={scores} previousScores={previousScores} />
      <DetailedScores
        scores={scores}
        criteria={currentSession.criteria}
        previousScores={previousScores}
      />
      <Leaderboard
        scores={scores}
        criteria={currentSession.criteria}
        previousScores={previousScores}
      />
      <div className="mb-4">
       <ResultConfetti session={session} currentSession={currentSession} /> 
      </div>
    </div>
  )
}

export default ResultsPage
