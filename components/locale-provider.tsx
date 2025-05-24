"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// English translations
const en = {
  "app.name": "Life Reboot",
  "app.tagline": "Islamic & Psychological Habit Building",
  "landing.hero.title": "Build Better Habits, Transform Your Life",
  "landing.hero.subtitle":
    "A 3-month journey to develop productive and spiritual habits using Islamic and psychological principles",
  "landing.hero.cta": "Get Started",
  "landing.hero.preview": "Preview App",
  "landing.features.title": "Features",
  "landing.features.habitTracking.title": "Habit Tracking",
  "landing.features.habitTracking.description": "Track your daily habits with our Kanban-style board",
  "landing.features.islamic.title": "Islamic Framework",
  "landing.features.islamic.description": "Built on Islamic principles for spiritual growth",
  "landing.features.psychology.title": "Psychological Approach",
  "landing.features.psychology.description": "Incorporates modern psychology for effective habit building",
  "landing.features.offline.title": "Works Offline",
  "landing.features.offline.description": "Full functionality even without internet connection",
  "nav.home": "Home",
  "nav.login": "Login",
  "nav.dashboard": "Dashboard",
  "nav.settings": "Settings",
  "footer.rights": "All rights reserved",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Service",
}

// Bengali translations
const bn = {
  "app.name": "লাইফ রিবুট",
  "app.tagline": "ইসলামিক ও মনোবিজ্ঞান ভিত্তিক অভ্যাস গঠন",
  "landing.hero.title": "ভালো অভ্যাস গড়ুন, জীবন বদলে ফেলুন",
  "landing.hero.subtitle": "ইসলামিক ও মনোবিজ্ঞান নীতি ব্যবহার করে উৎপাদনশীল এবং আধ্যাত্মিক অভ্যাস গড়ে তোলার ৩ মাসের যাত্রা",
  "landing.hero.cta": "শুরু করুন",
  "landing.hero.preview": "অ্যাপ দেখুন",
  "landing.features.title": "বৈশিষ্ট্য",
  "landing.features.habitTracking.title": "অভ্যাস ট্র্যাকিং",
  "landing.features.habitTracking.description": "কানবান-স্টাইল বোর্ড দিয়ে আপনার দৈনিক অভ্যাস ট্র্যাক করুন",
  "landing.features.islamic.title": "ইসলামিক ফ্রেমওয়ার্ক",
  "landing.features.islamic.description": "আধ্যাত্মিক বৃদ্ধির জন্য ইসলামিক নীতির উপর ভিত্তি করে তৈরি",
  "landing.features.psychology.title": "মনোবিজ্ঞান পদ্ধতি",
  "landing.features.psychology.description": "কার্যকর অভ্যাস গঠনের জন্য আধুনিক মনোবিজ্ঞান অন্তর্ভুক্ত",
  "landing.features.offline.title": "অফলাইনে কাজ করে",
  "landing.features.offline.description": "ইন্টারনেট সংযোগ ছাড়াও পূর্ণ কার্যকারিতা",
  "nav.home": "হোম",
  "nav.login": "লগইন",
  "nav.dashboard": "ড্যাশবোর্ড",
  "nav.settings": "সেটিংস",
  "footer.rights": "সর্বস্বত্ব সংরক্ষিত",
  "footer.privacy": "গোপনীয়তা নীতি",
  "footer.terms": "সেবার শর্তাবলী",
}

type Locale = "en" | "bn"
type Translations = typeof en

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: keyof typeof en) => string
}

const LocaleContext = createContext<LocaleContextType | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")
  const [translations, setTranslations] = useState<Translations>(en)

  useEffect(() => {
    // Load saved locale from localStorage if available
    const savedLocale = localStorage.getItem("locale") as Locale | null
    if (savedLocale && (savedLocale === "en" || savedLocale === "bn")) {
      setLocale(savedLocale)
    }
  }, [])

  useEffect(() => {
    // Update translations when locale changes
    setTranslations(locale === "en" ? en : bn)
    // Save locale to localStorage
    localStorage.setItem("locale", locale)
  }, [locale])

  const t = (key: keyof typeof en) => {
    return translations[key] || key
  }

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
