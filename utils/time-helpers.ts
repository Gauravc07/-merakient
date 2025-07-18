// Utility functions for handling IST time
export function formatISTTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export function getISTTime(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
}

export function isEventLive(startsAt: string, endsAt: string): boolean {
  const now = getISTTime()
  const start = new Date(startsAt)
  const end = new Date(endsAt)

  return now >= start && now <= end
}

export function getTimeUntilStart(startsAt: string): number {
  const now = getISTTime()
  const start = new Date(startsAt)

  return Math.max(0, start.getTime() - now.getTime())
}

export function getTimeUntilEnd(endsAt: string): number {
  const now = getISTTime()
  const end = new Date(endsAt)

  return Math.max(0, end.getTime() - now.getTime())
}

export function formatTimeRemaining(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}
