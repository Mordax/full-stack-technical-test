import { EventsClient } from "@/components/events-client"
import type { Event } from "@/lib/types"

const API_BASE_URL = "https://cw67o3d8j7.execute-api.eu-north-1.amazonaws.com/prod/events"
const API_KEY = process.env.API_KEY!

async function getEvents(): Promise<Event[]> {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: {
        "accept": "application/json",
        "x-api-key": API_KEY,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`)
      return []
    }

    const data = await response.json()
    const events = data.events || []

    // Normalize location type: convert "physical" to "in-person" for UI consistency
    return events.map((event: any) => ({
      ...event,
      location: {
        ...event.location,
        type: event.location.type === "physical" ? "in-person" : event.location.type
      }
    }))
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

export default async function HomePage() {
  const initialEvents = await getEvents()

  return <EventsClient initialEvents={initialEvents} />
}
