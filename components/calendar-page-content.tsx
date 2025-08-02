"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Sample events data - in production this would come from your backend
const sampleEvents = [
  {
    id: 1,
    date: 3,
    day: "FRI",
    title: "NEON NIGHTS",
    subtitle: "Electronic Fusion",
    time: "21:00",
    venue: "Main Stage",
  },
  {
    id: 2,
    date: 8,
    day: "WED",
    title: "ACOUSTIC SOUL",
    subtitle: "Intimate Sessions",
    time: "19:30",
    venue: "VIP Lounge",
  },
  {
    id: 3,
    date: 15,
    day: "WED",
    title: "MIDNIGHT GROOVE",
    subtitle: "Deep House Experience",
    time: "23:00",
    venue: "Underground",
  },
  {
    id: 4,
    date: 22,
    day: "WED",
    title: "GOLDEN HOUR",
    subtitle: "Sunset Sessions",
    time: "18:00",
    venue: "Rooftop Terrace",
  },
]

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth()

export function CalendarPageContent() {
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonth])

  // Generate calendar grid for the month
  const getDaysInMonth = (month: string, year: number) => {
    const monthIndex = months.indexOf(month)
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
    const firstDayOfWeek = new Date(year, monthIndex, 1).getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = new Date(year, monthIndex, day).toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
      const event = sampleEvents.find((e) => e.date === day)

      days.push({
        date: day,
        day: dayOfWeek,
        event: event,
      })
    }

    return days
  }

  const calendarDays = getDaysInMonth(selectedMonth, currentYear)

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-6xl md:text-8xl font-bold tracking-wider">
              <span className="text-white">MERAKI</span>
            </h1>
            <div className="text-right">
              <div className="text-2xl md:text-4xl font-light">EVENTS</div>
            </div>
          </div>

          {/* Month selector and date range */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48 bg-transparent border-orange-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-orange-500">
                {months.map((month) => (
                  <SelectItem key={month} value={month} className="text-white hover:bg-orange-500/20">
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-orange-500 text-xl">/ {currentYear}</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 md:gap-4 mb-8">
          {/* Weekday headers */}
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div key={day} className="text-center text-gray-400 text-sm font-medium p-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div key={index} className="aspect-square">
              {day ? (
                <div className="h-full border border-gray-800 hover:border-orange-500 transition-colors relative group">
                  {day.event ? (
                    // Day with event
                    <div className="h-full bg-gradient-to-br from-orange-500/20 to-transparent p-2 md:p-3">
                      <div className="text-orange-500 text-2xl md:text-4xl font-bold mb-1">
                        {day.date.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-400 mb-1">{day.day}</div>
                      <div className="text-xs md:text-sm font-medium text-white leading-tight">{day.event.title}</div>
                      <div className="text-xs text-gray-300 mt-1">{day.event.time}</div>
                      <div className="text-xs text-orange-400">{day.event.venue}</div>
                    </div>
                  ) : (
                    // Regular day
                    <div className="h-full p-2 md:p-3 flex flex-col">
                      <div className="text-gray-400 text-lg md:text-2xl font-medium">
                        {day.date.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs text-gray-500">{day.day}</div>
                      {/* Add event button - visible on hover */}
                      <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" className="text-orange-500 hover:bg-orange-500/20">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Empty cell
                <div className="h-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="text-center border-t border-gray-800 pt-8">
          <div className="text-orange-500 text-2xl md:text-3xl font-bold mb-2">CONTACT FOR GUESTLIST AND TABLES</div>
          <div className="text-gray-300 text-lg mb-4">
            <div>(+91) 7758095284</div>
            <div className="text-sm mt-2">Meraki Entertainment</div>
          </div>
          <div className="text-sm text-gray-400">merakientertainment2025@gmail.com</div>
        </div>

        {/* QR Code placeholder */}
        <div className="absolute bottom-8 left-8 w-16 h-16 border-2 border-gray-600 flex items-center justify-center text-xs text-gray-500">
          QR
        </div>
      </div>
    </div>
  )
}
