"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const SESSION_CODE_KEY = 'voting_session_code'

export function SessionCodeHandler() {
  const router = useRouter()

  useEffect(() => {
    // Get the session code
    const sessionCode = sessionStorage.getItem(SESSION_CODE_KEY)

    if (sessionCode) {
      // Remove it from storage
      sessionStorage.removeItem(SESSION_CODE_KEY)
      
      // Redirect to the voting page
      window.location.href = "/vote/"+sessionCode
    //   router.push(`/vote/${sessionCode}`)
    }
  }, [router])

  // Return null as this is a utility component
  return null
}