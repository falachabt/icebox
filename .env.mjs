import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"


export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1).optional(),
    NEXTAUTH_URL: z.string().min(1).optional(),
    DATABASE_URL: z.string().min(1).optional(),
    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    GITHUB_CLIENT_ID: z.string().min(1).optional(),
    GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
    PRIVATE_RECAPTCHA_KEY: z.string().min(1).optional(),
    PRIVATE_RESEND_API_KEY: z.string().min(1).optional(),
    PRIVATE_CONTACT_FROM_EMAIL: z.string().min(1).optional(),
    PRIVATE_CONTACT_TO_EMAIL: z.string().min(1).optional(),
    UPLOADTHING_TOKEN: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1).optional(),
    NEXT_PUBLIC_API_URL: z.string().min(1).optional(),
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
    NEXT_PUBLIC_RECAPTCHA_KEY: z.string().optional(),
  },
  runtimeEnv: {
    // server
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    PRIVATE_RECAPTCHA_KEY: process.env.PRIVATE_RECAPTCHA_KEY,
    PRIVATE_RESEND_API_KEY: process.env.PRIVATE_RESEND_API_KEY,
    PRIVATE_CONTACT_FROM_EMAIL: process.env.PRIVATE_CONTACT_FROM_EMAIL,
    PRIVATE_CONTACT_TO_EMAIL: process.env.PRIVATE_CONTACT_TO_EMAIL,
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    // client
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.SENTRY_DSN,
    NEXT_PUBLIC_RECAPTCHA_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_KEY,
  },
})
