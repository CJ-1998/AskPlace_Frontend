import type { Place } from '@/features/place/types/place'
import type { 
  TravelPlan,
  TravelPlanRequestDto,
  DailyPlanRequestDto,
  PlacePlanRequestDto
} from '@/features/plan/types/plan'
import { type DateValue, getLocalTimeZone } from '@internationalized/date'

export const getPlaceIcon = (contentTypeId?: string): string => {
  switch (contentTypeId) {
    case '12': return 'fa-solid fa-camera'
    case '14': return 'fa-solid fa-landmark'
    case '32': return 'fa-solid fa-bed'
    case '39': return 'fa-solid fa-utensils'
    case '28': return 'fa-solid fa-person-running'
    case '38': return 'fa-solid fa-bag-shopping'
    default: return 'fa-solid fa-location-dot'
  }
}

export const getCategoryName = (contentTypeId?: string): string => {
  switch (contentTypeId) {
    case '12': return '관광지'
    case '14': return '문화시설'
    case '32': return '숙소'
    case '39': return '음식점'
    case '28': return '레포츠'
    case '38': return '쇼핑'
    default: return '장소'
  }
}



const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const createPlanRequestDto = (
  title: string,
  dateRange: { start: DateValue | undefined; end: DateValue | undefined },
  dailyPlans: Place[][]
): TravelPlanRequestDto | null => {
  if (!dateRange.start || !dateRange.end) return null

  const startDate = dateRange.start.toDate(getLocalTimeZone())
  const endDate = dateRange.end.toDate(getLocalTimeZone())
  
  // Create Daily Plans
  const dailyPlanRequestDtoList: DailyPlanRequestDto[] = dailyPlans.map((places, index) => {
    const currentDay = new Date(startDate)
    currentDay.setDate(startDate.getDate() + index)
    
    // Create Place Plans
    const placePlanRequestDtoList: PlacePlanRequestDto[] = places.map((place) => {
        // Simple duration calculation if needed, or just rely on user input
        // For now, we use what's in the place object
        let calculatedEndTime = place.endTime || '12:00'
        if (place.startTime && place.durationMinutes) {
             const [hours, minutes] = place.startTime.split(':').map(Number)
             const totalMinutes = hours * 60 + minutes + place.durationMinutes
             const endHours = Math.floor(totalMinutes / 60) % 24
             const endMinutes = totalMinutes % 60
             calculatedEndTime = `${String(endHours).padStart(2,'0')}:${String(endMinutes).padStart(2,'0')}`
        }

        return {
          placeId: place.placeId,
          startTime: (place.startTime || '10:00').substring(0, 5), // Ensure HH:mm
          endTime: calculatedEndTime.substring(0, 5), // Ensure HH:mm
          budget: place.budget || 0
        }
    })

    return {
      title: `${index + 1}일차`,
      description: '',
      date: formatDate(currentDay),
      placePlanRequestDtoList
    }
  })

  return {
    title,
    description: '',
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    dailyPlanRequestDtoList
  }
}

export const mapDomainToPlaces = (plan: TravelPlan): Place[][] => {
  if (!plan.dailyPlans) return []
  
  // Sort by day number to be safe
  const sortedDays = [...plan.dailyPlans].sort((a, b) => a.dayNumber - b.dayNumber)
  
  return sortedDays.map(day => {
    // Sort places by order
    const sortedPlaces = [...day.placeDetails].sort((a, b) => a.order - b.order)
    
    // Convert PlaceDetail to Place
    return sortedPlaces.map(pd => ({
      placeId: pd.placeDetailId,
      placeName: pd.placeName,
      placeAddress: pd.placeAddress || '',
      latitude: pd.latitude,
      longitude: pd.longitude,
      placeImageUrl: pd.placeImageUrl,
      contentId: '', // Detail might not have this, usage depends on if we need to navigate back
      contentTypeId: pd.contentTypeId || '',
      region: '',  // might be missing in detail
      siGunGu: '', // might be missing in detail
      startTime: pd.startTime,
      endTime: pd.endTime,
      budget: pd.budget,
      durationMinutes: pd.durationMinutes
    }))
  })
}

export const mapDtoToTravelPlan = (dto: any): TravelPlan => {
  return {
    id: dto.travelPlanId,
    title: dto.travelPlanTitle,
    description: dto.travelPlanDescription,
    startDate: '', // Not in summary DTO
    endDate: '', // Not in summary DTO
    user: {
      uuid: dto.user.uuid,
      name: dto.user.name
    },
    duration: `${dto.travelTotalDays}일`,
    // Add other fields with default values if necessary
    dailyPlans: []
  }
}
