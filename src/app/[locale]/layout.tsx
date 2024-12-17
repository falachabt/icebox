import { Inter } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { AuthProvider } from "@/lib/auth/provider/auth"
import { Toaster } from "@/components/ui/sonner"
import { appConfig } from "@/../app.config"
import "@/styles/globals.css"
import "@uploadthing/react/styles.css";
import { PgBar } from "@/components/providers/PgBar"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: "Meta",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  const messages = await getMessages()
  if (!appConfig.locales.includes(params.locale)) notFound()
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon-32x32.png" sizes="any" />
      </head>
      <body className={inter.className +  "  "}>
          <PgBar/> 
        <AuthProvider>
          <Toaster position="bottom-right" />
          <NextIntlClientProvider locale={params.locale} messages={messages}>
            {children}
          {/* <div id="modal-root" /> */}
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
