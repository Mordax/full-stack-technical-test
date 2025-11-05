"use client"

import { useState, useEffect } from "react"
import { EventCard } from "@/components/event-card"
import { EventFilters } from "@/components/event-filters"
import type { Event } from "@/lib/types"
import { Spinner } from "@/components/ui/spinner"

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [location, setLocation] = useState("all")

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (category !== "all") params.set("category", category)
      if (location !== "all") params.set("location", location)

      const response = await fetch(`/api/events?${params.toString()}`)
      const data = await response.json()
      setEvents(data)
      setLoading(false)
    }

    const debounce = setTimeout(() => {
      fetchEvents()
    }, 300)

    return () => clearTimeout(debounce)
  }, [search, category, location])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Events</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {events.length} {events.length === 1 ? "event" : "events"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Filters */}
          <EventFilters
            search={search}
            category={category}
            location={location}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onLocationChange={setLocation}
          />

          {/* Events Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
