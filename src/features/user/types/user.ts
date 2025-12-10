import type { Plan } from '@/features/plan/types/plan'
import type { Place } from '@/features/place/types/place'
import type { Video } from '@/features/video/types/video'

export interface UserProfile {
  userUuid: string
  email: string
  name: string
  role?: string
  profileImage?: string
  introduction?: string
  joinDate?: string
}

export interface UserActivity {
  myPlans: Plan[]
  likedPlaces: Place[]
  myVideos: Video[]
}
