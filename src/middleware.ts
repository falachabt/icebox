import createIntlMiddleware from "next-intl/middleware"
import { auth as authMiddleware } from "@/lib/auth"
import { apiPrefix, appConfig } from "@/../app.config"
import { pathnames } from "@/lib/i18n"
import { NextResponse } from 'next/server'

export default authMiddleware(request => {
  const { nextUrl } = request

  const isApiRoute = nextUrl.pathname.startsWith(apiPrefix)
  const isDashboard = nextUrl.pathname === '/dashboard'

  // Check for session code cookie if trying to access dashboard
  if (isDashboard) {
    const sessionCode = request.cookies.get('session_code')
    if (sessionCode?.value) {
      // Clear the cookie and redirect to voting page
      const response = NextResponse.redirect(new URL(`/vote/${sessionCode.value}`, request.url))
      response.cookies.delete('session_code')
      return response
    }
  }

  if (isApiRoute) {
    return void 0
  }

  const { locales, defaultLocale, localePrefix } = appConfig

  const handleI18nRouting = createIntlMiddleware({
    locales,
    defaultLocale,
    localePrefix,
    pathnames,
  })

  return handleI18nRouting(request)
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}