import { notFound } from "next/navigation"
import { Calendar, MapPin, Users, DollarSign, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Event, getCapacityStatus } from "@/lib/types"
import { RegistrationForm } from "@/components/registration-form"

async function getEvent(id: string): Promise<Event | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/events/${id}`, {
      cache: "no-store",
    })
    if (!response.ok) return null
    return response.json()
  } catch (error) {
    return null
  }
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) {
    notFound()
  }

  const capacityStatus = getCapacityStatus(event.capacity)
  const spotsLeft = event.capacity.max - event.capacity.registered
  const isFull = capacityStatus === "full"

  const statusConfig = {
    available: {
      label: "Available",
      className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    },
    "few-spots": {
      label: `Only ${spotsLeft} spots left!`,
      className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    },
    full: { label: "Event Full", className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
    waitlist: {
      label: "Join Waitlist",
      className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    },
  }

  const status = statusConfig[capacityStatus]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  className="border"
                  style={{
                    backgroundColor: `${event.category.color}15`,
                    color: event.category.color,
                    borderColor: `${event.category.color}30`,
                  }}
                >
                  {event.category.name}
                </Badge>
                <Badge variant="outline" className={status.className}>
                  {status.label}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold leading-tight text-balance">{event.title}</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>About this event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground capitalize">{event.location.type}</p>
                    <p className="text-sm text-muted-foreground">{event.location.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Capacity</p>
                    <p className="text-sm text-muted-foreground">
                      {event.capacity.registered} / {event.capacity.max} registered
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-sm text-muted-foreground">
                      {event.pricing.individual === 0 ? "Free" : `$${event.pricing.individual} per person`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle>{isFull ? "Join Waitlist" : "Register for Event"}</CardTitle>
                  <CardDescription>
                    {isFull
                      ? "This event is currently full. Join the waitlist to be notified if spots open up."
                      : "Fill out the form below to secure your spot at this event."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RegistrationForm eventId={event.id} isFull={isFull} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
