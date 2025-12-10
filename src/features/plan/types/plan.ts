import type { Place } from '@/features/place/types/place'

export interface Plan {
  id: number
  title: string
  author: string
  duration: string
  views: number
  likes: number
  coverImage: string
  description?: string
  startDate?: string
  endDate?: string
  totalPlaces?: number
  totalTime?: string
  totalDistance?: string
  totalBudget?: string
}

export interface DayPlan {
  day: number
  title: string
  places: Place[]
  details: string
}

export interface TimelineItem {
  time: string
  place: Place
  duration: string
  cost: string
  notes?: string
}
