export interface Event {
  id: string
  title: string
  description: string
  date: string
  category: Category
  capacity: Capacity
  pricing: Pricing
  location: Location
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface Capacity {
  max: number
  registered: number
}

export interface Pricing {
  individual: number
}

export interface Location {
  type: "in-person" | "online" | "hybrid"
  address: string
}

export interface RegistrationRequest {
  attendeeEmail: string
  attendeeName: string
  groupSize?: number
}

export interface RegistrationResponse {
  success: boolean
  registrationId: string
  event: { id: string }
  attendee: {
    email: string
    name: string
  }
}

export type CapacityStatus = "available" | "few-spots" | "full" | "waitlist"

export function getCapacityStatus(capacity: Capacity): CapacityStatus {
  const spotsLeft = capacity.max - capacity.registered
  const percentFull = (capacity.registered / capacity.max) * 100

  if (spotsLeft === 0) return "full"
  if (percentFull >= 90) return "few-spots"
  return "available"
}
