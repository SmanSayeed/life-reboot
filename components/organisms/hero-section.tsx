"use client"

import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"
import Link from "next/link"
import { motion } from "framer-motion"
import { getCurrentDate } from "@/lib/date-utils"

export function HeroSection() {
  const { t } = useLocale()
  const today = getCurrentDate()

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-4"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                {t("landing.hero.title")}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">{t("landing.hero.subtitle")}</p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/login">{t("landing.hero.cta")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/dashboard/${today}`}>{t("landing.hero.preview")}</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[16/9] overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="space-y-4 p-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xl">🚀</span>
                    </div>
                    <h2 className="text-2xl font-bold">{t("app.name")}</h2>
                    <p className="text-muted-foreground">{t("app.tagline")}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
