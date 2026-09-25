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

// DB timestamps are absolute instants (timestamptz), so compare against Date.now() directly.
// Converting "now" into an IST wall-clock Date first would shift it by the viewer's own
// UTC offset and break the countdown for anyone whose device isn't set to IST.
export function isEventLive(startsAt: string, endsAt: string): boolean {
  const now = Date.now()
  return now >= new Date(startsAt).getTime() && now <= new Date(endsAt).getTime()
}

export function getTimeUntilStart(startsAt: string): number {
  return Math.max(0, new Date(startsAt).getTime() - Date.now())
}

export function getTimeUntilEnd(endsAt: string): number {
  return Math.max(0, new Date(endsAt).getTime() - Date.now())
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
