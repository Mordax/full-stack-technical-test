"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Spinner } from "@/components/ui/spinner"

interface RegistrationFormProps {
  eventId: string
  isFull: boolean
}

export function RegistrationForm({ eventId, isFull }: RegistrationFormProps) {
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [formData, setFormData] = useState({
    attendeeName: "",
    attendeeEmail: "",
    groupSize: 1,
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setRegistered(true)
        toast({
          title: isFull ? "Added to waitlist!" : "Registration successful!",
          description: isFull
            ? "You've been added to the waitlist. We'll notify you if a spot opens up."
            : "You're all set! Check your email for confirmation details.",
        })
      } else {
        throw new Error(data.message || "Registration failed")
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{isFull ? "You're on the waitlist!" : "You're registered!"}</h3>
          <p className="text-sm text-muted-foreground mt-1">Check your email for details</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={formData.attendeeName}
          onChange={(e) => setFormData({ ...formData, attendeeName: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={formData.attendeeEmail}
          onChange={(e) => setFormData({ ...formData, attendeeEmail: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="groupSize">Group Size</Label>
        <Input
          id="groupSize"
          type="number"
          min="1"
          max="10"
          value={formData.groupSize}
          onChange={(e) => setFormData({ ...formData, groupSize: Number.parseInt(e.target.value) })}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Spinner className="h-4 w-4 mr-2" />
            {isFull ? "Joining Waitlist..." : "Registering..."}
          </>
        ) : isFull ? (
          "Join Waitlist"
        ) : (
          "Register Now"
        )}
      </Button>
    </form>
  )
}
