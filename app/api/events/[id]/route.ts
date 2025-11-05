import { NextResponse } from "next/server"

const API_BASE_URL = "https://x15zoj9on9.execute-api.us-east-1.amazonaws.com/prod/events"
const API_KEY = process.env.API_KEY!

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      headers: {
        "accept": "application/json",
        "x-api-key": API_KEY,
      },
      cache: "no-store",
    })

    if (response.status === 404) {
      return NextResponse.json({ error: "Not Found", message: "Event not found" }, { status: 404 })
    }

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    // External API returns { event: {...} }
    const event = data.event

    if (!event) {
      return NextResponse.json({ error: "Not Found", message: "Event not found" }, { status: 404 })
    }

    // Normalize location type: convert "physical" to "in-person" for UI consistency
    const normalizedEvent = {
      ...event,
      location: {
        ...event.location,
        type: event.location.type === "physical" ? "in-person" : event.location.type
      }
    }

    return NextResponse.json(normalizedEvent)
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error)
    return NextResponse.json(
      { error: "Failed to fetch event", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
