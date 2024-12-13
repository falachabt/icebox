import { auth, getIsAdmin } from "@/lib/auth"
import { Placeholder } from "@/components/placeholder"
import { Title } from "@/components/title"
import { Content } from "@/components/with-sidebar/content"
import { SessionCodeHandler } from "./_components/sessionCodeHandler"

export default async function Dashboard() {
  const session = await auth()
  
  let isAdmin 
  
  try {
    isAdmin = await getIsAdmin()
  } catch (error) {
    console.error("Error fetching isAdmin:", error)
    isAdmin = false
  }

  if (!session?.user) {
    return null
  }

  if (isAdmin) {
    return (
      <Content>
         <SessionCodeHandler/> 
        <Title>Dashboard</Title>
        <div className="flex flex-col gap-4 md:flex-row">
          <Placeholder />
          <Placeholder />
          <Placeholder />
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <Placeholder />
          <Placeholder />
        </div>
      </Content>
    )
  }

  return (
    <Content>
      <Title>Dashboard</Title>
      <Placeholder />
    </Content>
  )
}
