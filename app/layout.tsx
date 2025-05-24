import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LocaleProvider } from "@/components/locale-provider"
import { ReduxProvider } from "@/lib/redux/provider"
import PWARegister from "@/components/pwa-register"
import { Toaster } from '@/components/ui/toaster'
import { CookieConsent } from '@/components/cookie-consent'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Life Reboot - Islamic & Psychological Habit Building",
  description: "Build productive and spiritual habits with Islamic and psychological principles",
  manifest: "/manifest.json",
  themeColor: "#10b981",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Life Reboot",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <LocaleProvider>
              <div className="min-h-screen bg-background">{children}</div>
              <PWARegister />
            </LocaleProvider>
          </ThemeProvider>
        </ReduxProvider>
        <Toaster />
        <CookieConsent />
      </body>
    </html>
  )
}
