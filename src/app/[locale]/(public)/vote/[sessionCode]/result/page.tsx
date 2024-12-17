"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import SessionStatusResult from "@/app/[locale]/(protected)/vote/[sessionCode]/_components/inactive-session-result"
import ResultsPage from "./_components/results-page"

interface Session {
  sessionCode: string
  isActive: boolean
  campuses: any[]
  criteria: any[]
  ManualScore: any[]
  votes: any[]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch data")
  return res.json()
}

export default function Page({ params }: { params: { sessionCode: string } }) {
  const { data: session, error } = useSWR<Session>(
    `/api/sessions/${params.sessionCode}`,
    fetcher,
    {
      // Disable automatic polling and revalidation
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-600">
        <p className="text-lg font-medium">Error loading session data</p>
        <p className="text-sm">Please try refreshing the page</p>
      </div>
    )
  }

  // Initial loading state
  if (!session) {
    return <SessionStatusResult canVote={true} />
  }

  // Render based on session state
  return  (
    <ResultsPage 
      initialSession={{ 
        ...session,
        ManualScore: [], 
        votes: [] 
      }} 
    />
  ) 
}