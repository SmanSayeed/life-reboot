import { DailyBoardTemplate } from "@/components/templates/daily-board-template"
import { formatDateForDisplay } from "@/lib/date-utils"
import type { Metadata } from "next"

interface DailyPageProps {
  params: {
    date: string
  }
}

export function generateMetadata({ params }: DailyPageProps): Metadata {
  const formattedDate = formatDateForDisplay(params.date)
  return {
    title: `${formattedDate} | Life Reboot`,
    description: `Your habits and tasks for ${formattedDate}`,
  }
}

export default function DailyPage({ params }: DailyPageProps) {
  return <DailyBoardTemplate date={params.date} />
}
