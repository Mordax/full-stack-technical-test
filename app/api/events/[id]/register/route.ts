import { NextResponse } from "next/server"

const API_BASE_URL = "https://x15zoj9on9.execute-api.us-east-1.amazonaws.com/prod/events"
const API_KEY = process.env.API_KEY!

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  const { attendeeEmail, attendeeName, groupSize = 1 } = body

  if (!attendeeEmail || !attendeeName) {
    return NextResponse.json(
      { error: "Bad Request", message: "attendeeEmail and attendeeName are required" },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${id}/register`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        attendeeEmail,
        attendeeName,
        groupSize,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      return NextResponse.json(
        {
          error: "Registration failed",
          message: errorData?.message || `API responded with status: ${response.status}`
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error registering for event ${id}:`, error)
    return NextResponse.json(
      { error: "Failed to register", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
