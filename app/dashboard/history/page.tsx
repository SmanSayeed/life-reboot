import { HistoryTemplate } from "@/components/templates/history-template"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "History | Life Reboot",
  description: "View your habit history and past activities",
}

export default function HistoryPage() {
  return <HistoryTemplate />
}
