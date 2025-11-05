import { NextResponse } from "next/server"

const API_BASE_URL = "https://x15zoj9on9.execute-api.us-east-1.amazonaws.com/prod/events"
const API_KEY = process.env.API_KEY!

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const category = searchParams.get("category")
  const location = searchParams.get("location")

  // Build query parameters for external API
  const queryParams = new URLSearchParams()

  if (search) {
    queryParams.set("search", search)
  }

  if (category && category !== "all") {
    queryParams.set("category", category)
  }

  if (location && location !== "all") {
    // Convert UI value "in-person" to API value "physical"
    const apiLocation = location === "in-person" ? "physical" : location
    queryParams.set("location", apiLocation)
  }

  try {
    const url = `${API_BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

    const response = await fetch(url, {
      headers: {
        "accept": "application/json",
        "x-api-key": API_KEY,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    // External API returns { events: [...], total: number, lastKey?: string }
    // Extract just the events array for frontend compatibility
    const events = data.events || []

    // Normalize location type: convert "physical" to "in-person" for UI consistency
    const normalizedEvents = events.map((event: any) => ({
      ...event,
      location: {
        ...event.location,
        type: event.location.type === "physical" ? "in-person" : event.location.type
      }
    }))

    return NextResponse.json(normalizedEvents)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Failed to fetch events", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
