// Make sure the getCurrentDate function is properly defined
export function getCurrentDate(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Keep the existing formatDateString function
export function formatDateString(date: string): string {
  // Ensure date is in YYYY-MM-DD format
  return date.split("T")[0]
}

// Keep the existing formatDateForDisplay function
export function formatDateForDisplay(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Keep the existing getNextDate function
export function getNextDate(date: string): string {
  const currentDate = new Date(date)
  currentDate.setDate(currentDate.getDate() + 1)
  return currentDate.toISOString().split("T")[0]
}

// Keep the existing getPreviousDate function
export function getPreviousDate(date: string): string {
  const currentDate = new Date(date)
  currentDate.setDate(currentDate.getDate() - 1)
  return currentDate.toISOString().split("T")[0]
}
