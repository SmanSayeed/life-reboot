"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "@/components/locale-provider"
import { motion } from "framer-motion"
import { KanbanSquare, Sparkles, Brain, Wifi } from "lucide-react"

export function FeatureSection() {
  const { t } = useLocale()

  const features = [
    {
      icon: <KanbanSquare className="h-10 w-10 text-primary" />,
      title: t("landing.features.habitTracking.title"),
      description: t("landing.features.habitTracking.description"),
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: t("landing.features.islamic.title"),
      description: t("landing.features.islamic.description"),
    },
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: t("landing.features.psychology.title"),
      description: t("landing.features.psychology.description"),
    },
    {
      icon: <Wifi className="h-10 w-10 text-primary" />,
      title: t("landing.features.offline.title"),
      description: t("landing.features.offline.description"),
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t("landing.features.title")}
            </h2>
          </div>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card>
                <CardHeader>
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
