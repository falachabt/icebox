// app/admin/criteria/page.tsx
import { auth, getIsAdmin } from "@/lib/auth"
import { Content } from "@/components/with-sidebar/content"
import { Title } from "@/components/title"
import { CriteriaManagement } from "./_components/criteria-management"

export default async function CriteriaPage() {
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

  // if (!isAdmin) {
  //   return (
  //     <Content>
  //       <Title>Access Denied</Title>
  //       <p>You do not have permission to access this page.</p>
  //     </Content>
  //   )
  // }

  return (
    <Content>
      <Title>Criteria Management</Title>
      <CriteriaManagement />
    </Content>
  )
}