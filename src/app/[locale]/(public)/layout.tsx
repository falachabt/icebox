import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ScrollToTop } from "@/components/scroll-to-top"

export default async function PublicLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="grow">
        {children}
        {/* Wrap modal in a div to ensure proper cleanup */}
        <div id="modal-root">
          {modal}
        </div>
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  )
}
