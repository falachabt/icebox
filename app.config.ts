import {
  DollarSign,
  Home,
  KeyRound,
  LucideIcon,
  Mail,
  Settings,
  User,
  Zap,
  ClipboardList,
  Building2,
} from "lucide-react"

// Define all possible route names
export type RouteName = 
  | "pricing" 
  | "contact" 
  | "signin" 
  | "dashboard" 
  | "profile" 
  | "settings"
  | "criteria"
  | "campus"
  | "voting-sessions"
  | "vote"

// Define the LocalizedRoute interface
export interface LocalizedRoute {
  href: string
  translationKey: string
  icon: LucideIcon
  locale?: {
    en: string
    de: string
  }
}

// Define the type for routes with translations
export type LocaleHasTranslationKey<T> = {
  [K in RouteName]?: T
}

// App configuration interface
export interface AppConfig {
  logo: {
    type: 'image' | 'icon'
    source: string | LucideIcon
    alt?: string
  }
  name: string
  locales: string[]
  defaultLocale: string
  localePrefix: "as-needed" | "always" | "never" | undefined
}


export const appConfig: AppConfig = {
  logo: {
    type: 'image',
    source: '/favicon-32x32.png',
    alt: 'IceBox Logo'
  },
  name: "IceBox G1",
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "always",
}

export const apiPrefix: string = "/api"

export const REDIRECT_AUTHENTICATED: string = "/dashboard"

export const REDIRECT_NOT_AUTHENTICATED: string = "/"

export const publicRoutes: LocaleHasTranslationKey<LocalizedRoute> = {
  pricing: {
    href: "/pricing",
    translationKey: "pricing",
    icon: DollarSign,
    locale: {
      en: "/pricing",
      de: "/preise",
    },
  },
  contact: {
    href: "/contact",
    translationKey: "contact",
    icon: Mail,
    locale: {
      en: "/contact",
      de: "/kontakt",
    },
  },
  signin: {
    href: "/signin",
    translationKey: "signin",
    icon: KeyRound,
  },
}

export const protectedRoutes: LocaleHasTranslationKey<LocalizedRoute> = {
  dashboard: {
    href: "/dashboard",
    translationKey: "dashboard",
    icon: Home,
  },
  criteria: {
    href: "/criteria",
    translationKey: "criteria",
    icon: ClipboardList,
    locale: {
      en: "/criteria",
      de: "/kriterien",
    },
  },
  campus: {
    href: "/campus",
    translationKey: "campus",
    icon: Building2,
    locale: {
      en: "/campus",
      de: "/standort",
    },
  },
  profile: {
    href: "/profile",
    translationKey: "profile",
    icon: User,
    locale: {
      en: "/profile",
      de: "/profil",
    },
  },
  settings: {
    href: "/settings",
    translationKey: "settings",
    icon: Settings,
    locale: {
      en: "/settings",
      de: "/einstellungen",
    },
  },
  "voting-sessions": {
    href: "/voting-sessions",
    translationKey: "voting_sessions",
    icon: ClipboardList,
    locale: {
      en: "/voting-sessions",
      de: "/abstimmungen",
    },
  },
}