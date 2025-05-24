import { AnalyticsTemplate } from "@/components/templates/analytics-template"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Analytics | Life Reboot",
  description: "Track your habit progress and productivity metrics",
}

export default function AnalyticsPage() {
  return <AnalyticsTemplate />
}
