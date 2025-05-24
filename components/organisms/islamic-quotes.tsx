"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Bell } from "lucide-react"
import { motion } from "framer-motion"

const islamicQuotes = [
  {
    text: "Indeed, Allah will not change the condition of a people until they change what is in themselves.",
    source: "Quran 13:11",
    type: "quran",
  },
  {
    text: "The best of people are those who benefit others.",
    source: "Prophet Muhammad (PBUH)",
    type: "hadith",
  },
  {
    text: "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.",
    source: "Quran 65:3",
    type: "quran",
  },
  {
    text: "The strong person is not the one who can wrestle someone else down. The strong person is the one who can control himself when he is angry.",
    source: "Prophet Muhammad (PBUH)",
    type: "hadith",
  },
  {
    text: "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth.",
    source: "Quran 6:73",
    type: "quran",
  },
  {
    text: "Take advantage of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your busyness, and your life before your death.",
    source: "Prophet Muhammad (PBUH)",
    type: "hadith",
  },
]

export function IslamicQuotes() {
  const [currentQuote, setCurrentQuote] = useState(islamicQuotes[0])
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  useEffect(() => {
    // Get a random quote on component mount
    const randomIndex = Math.floor(Math.random() * islamicQuotes.length)
    setCurrentQuote(islamicQuotes[randomIndex])

    // Check if notifications are enabled
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted")
    }
  }, [])

  const getNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * islamicQuotes.length)
    setCurrentQuote(islamicQuotes[randomIndex])
  }

  const enableNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === "granted")

      if (permission === "granted") {
        // Schedule daily notifications (this would typically be done with a service worker)
        new Notification("Daily Islamic Quote", {
          body: currentQuote.text,
          icon: "/icons/icon-192x192.png",
        })
      }
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <blockquote className="text-lg italic text-emerald-800 dark:text-emerald-200 mb-2">
                "{currentQuote.text}"
              </blockquote>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  — {currentQuote.source}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    currentQuote.type === "quran"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                      : "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
                  }`}
                >
                  {currentQuote.type === "quran" ? "Quran" : "Hadith"}
                </span>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Button variant="outline" size="sm" onClick={getNewQuote}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              {!notificationsEnabled && (
                <Button variant="outline" size="sm" onClick={enableNotifications}>
                  <Bell className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
