import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import AllowedEmailsForm from "./components/allowed-emails-form"

export const metadata: Metadata = {
  title: "Allowed Emails",
  description: "Manage allowed emails for voting system access",
}

export default async function AllowedEmailsPage() {
  return (
    <div className="container mx-auto py-6">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm text-muted-foreground hover:font-semibold mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Manage Allowed Emails</h1>
        <AllowedEmailsForm />
      </div>
    </div>
  )
}