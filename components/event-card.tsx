import Link from "next/link"
import { Calendar, MapPin, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Event, getCapacityStatus } from "@/lib/types"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const capacityStatus = getCapacityStatus(event.capacity)
  const spotsLeft = event.capacity.max - event.capacity.registered

  const statusConfig = {
    available: {
      label: "Available",
      className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    },
    "few-spots": {
      label: `${spotsLeft} spots left`,
      className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    },
    full: { label: "Full", className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
    waitlist: { label: "Waitlist", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
  }

  const status = statusConfig[capacityStatus]

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 hover:border-foreground/20 h-full">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-2">
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
          <h3 className="text-xl font-semibold leading-tight group-hover:underline text-balance">{event.title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{event.description}</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span className="capitalize">{event.location.type}</span>
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>
                {event.capacity.registered} / {event.capacity.max} registered
              </span>
            </div>
            <span className="font-semibold text-foreground">
              {event.pricing.individual === 0 ? "Free" : `$${event.pricing.individual}`}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
