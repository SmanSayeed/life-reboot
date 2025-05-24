"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatDateForDisplay, getNextDate, getPreviousDate } from "@/lib/date-utils"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DateNavigatorProps {
  currentDate: string
}

export function DateNavigator({ currentDate }: DateNavigatorProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date(currentDate))

  const handlePrevious = () => {
    const prevDate = getPreviousDate(currentDate)
    router.push(`/dashboard/${prevDate}`)
  }

  const handleNext = () => {
    const nextDate = getNextDate(currentDate)
    router.push(`/dashboard/${nextDate}`)
  }

  const handleSelect = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      const formattedDate = date.toISOString().split("T")[0]
      router.push(`/dashboard/${formattedDate}`)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={handlePrevious}>
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous day</span>
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[240px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateForDisplay(currentDate)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={handleSelect} initialFocus />
        </PopoverContent>
      </Popover>
      <Button variant="outline" size="icon" onClick={handleNext}>
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next day</span>
      </Button>
    </div>
  )
}
