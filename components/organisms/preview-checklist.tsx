"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useLocale } from "@/components/locale-provider"
import { getDefaultHabits } from "@/lib/default-habits"
import { getCurrentDate } from "@/lib/date-utils"
import { motion } from "framer-motion"

export function PreviewChecklist() {
  const { t } = useLocale()
  const defaultHabits = getDefaultHabits("preview", getCurrentDate())

  // Group habits by time of day
  const morningHabits = defaultHabits.filter((h) => h.time_of_day === "morning")
  const afternoonHabits = defaultHabits.filter((h) => h.time_of_day === "afternoon")
  const eveningHabits = defaultHabits.filter((h) => h.time_of_day === "evening")

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
    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-3">
      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("habits.morning")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {morningHabits.map((habit) => (
                <div key={habit.title} className="flex items-center space-x-2">
                  <Checkbox id={`preview-${habit.title}`} />
                  <Label htmlFor={`preview-${habit.title}`} className="text-sm font-normal cursor-pointer">
                    {habit.title}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("habits.afternoon")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {afternoonHabits.map((habit) => (
                <div key={habit.title} className="flex items-center space-x-2">
                  <Checkbox id={`preview-${habit.title}`} />
                  <Label htmlFor={`preview-${habit.title}`} className="text-sm font-normal cursor-pointer">
                    {habit.title}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("habits.evening")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eveningHabits.map((habit) => (
                <div key={habit.title} className="flex items-center space-x-2">
                  <Checkbox id={`preview-${habit.title}`} />
                  <Label htmlFor={`preview-${habit.title}`} className="text-sm font-normal cursor-pointer">
                    {habit.title}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
