export function getDefaultHabits(userId: string, date: string) {
  return [
    {
      user_id: userId,
      title: "Fajr Prayer",
      description: "Perform Fajr prayer on time",
      time_of_day: "morning",
      date: date,
      status: "pending",
      is_default: true,
    },
    {
      user_id: userId,
      title: "Read Quran (10 mins)",
      description: "Read and reflect on Quran for at least 10 minutes",
      time_of_day: "morning",
      date: date,
      status: "pending",
      is_default: true,
    },
    {
      user_id: userId,
      title: "Morning Gratitude",
      description: "Write down 3 things you're grateful for",
      time_of_day: "morning",
      date: date,
      status: "pending",
      is_default: true,
    },
    {
      user_id: userId,
      title: "Dhuhr Prayer",
      description: "Perform Dhuhr prayer on time",
      time_of_day: "afternoon",
      date: date,
      status: "pending",
      is_default: true,
    },
    {
      user_id: userId,
      title: "Asr Prayer",
      description: "Perform Asr prayer on time",
      time_of_day: "afternoon",
      date: date,
      status: "pending",
      is_default: true,
    },
    {
      user_id: userId,
      title: "Work Session (Deep Focus)",
      description: "Complete 1 hour of deep focused work",
      time_of_day: "afternoon",
      date: date,
      status: "pending",
      is_default: true,
    },
    {
      user_id: userId,
      title: "Maghrib Prayer",
      description: "Perform Maghrib prayer on time",
      time_of_day: "evening",
      date: date,
      status: "pending",
      is_default: true,
    },
    {
      user_id: userId,
      title: "Isha Prayer",
      description: "Perform Isha prayer on time",
      time_of_day: "evening",
      date: date,
      status: "pending",
      is_default: true,
    },
    {
      user_id: userId,
      title: "Evening Reflection",
      description: "Reflect on your day and plan for tomorrow",
      time_of_day: "evening",
      date: date,
      status: "pending",
      is_default: true,
    },
  ]
}

export function getRandomQuote() {
  const quotes = [
    {
      text: "The best way to predict your future is to create it.",
      source: "Abraham Lincoln",
    },
    {
      text: "Every soul shall taste death. And We test you with evil and with good as trial; and to Us you will be returned.",
      source: "Quran 21:35",
    },
    {
      text: "Atomic habits are the compound interest of self-improvement.",
      source: "James Clear",
    },
    {
      text: "The five daily prayers erase the sins committed in between them.",
      source: "Hadith, Sahih Muslim",
    },
    {
      text: "Indeed, Allah will not change the condition of a people until they change what is in themselves.",
      source: "Quran 13:11",
    },
    {
      text: "Small habits don't add up. They compound.",
      source: "James Clear, Atomic Habits",
    },
    {
      text: "The reward of deeds depends upon the intentions.",
      source: "Hadith, Sahih Bukhari",
    },
    {
      text: "You do not rise to the level of your goals. You fall to the level of your systems.",
      source: "James Clear",
    },
  ]

  return quotes[Math.floor(Math.random() * quotes.length)]
}
