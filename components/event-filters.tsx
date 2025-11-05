"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EventFiltersProps {
  search: string
  category: string
  location: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onLocationChange: (value: string) => void
}

export function EventFilters({
  search,
  category,
  location,
  onSearchChange,
  onCategoryChange,
  onLocationChange,
}: EventFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="tech">Technology</SelectItem>
          <SelectItem value="workshop">Workshop</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="networking">Networking</SelectItem>
          <SelectItem value="business">Business</SelectItem>
        </SelectContent>
      </Select>
      <Select value={location} onValueChange={onLocationChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          <SelectItem value="in-person">In-Person</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="hybrid">Hybrid</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
