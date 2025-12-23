import type { DailyPlan as StoreDailyPlan, TravelPlan } from '@/features/plan/types/plan'
import type { DailyPlanDetail, DailySpot, DailyStats } from '@/features/plan/types/dailyPlan'

/**
 * Store의 DailyPlan 데이터를 View의 DailyPlanDetail 데이터로 변환합니다.
 */
export const mapToDailyPlanDetail = (
    dailyPlan: StoreDailyPlan, 
    travelPlan: TravelPlan
): DailyPlanDetail => {
    
    // 1. Map Spots
    const spots: DailySpot[] = dailyPlan.placeDetails.map((place, index, arr) => {
        const nextPlace = arr[index + 1]
        
        // Connectivity Logic (Mocked for distance/time as no API is available yet for routing)
        let nextTransport = undefined
        
        if (nextPlace) {
             nextTransport = {
                 mode: 'CAR', 
                 durationMinutes: 15, // Default Mock (Routing API required for real data)
                 distanceKm: 5.5, // Default Mock
                 cost: 0
             }
        }
        
        return {
            uid: place.placeDetailId,
            placeId: place.placeDetailId, 
            order: place.order,
            name: place.placeName,
            category: '장소', // TODO: Map contentTypeId to readable Category
            description: place.placeAddress, 
            thumbnailUrl: place.placeImageUrl,
            location: {
                lat: place.latitude,
                lng: place.longitude
            },
            // Mapping Real Data
            stayDurationMinutes: place.durationMinutes || 60,
            admissionFee: 0, // No API data yet
            budget: place.budget || 0, // User planned budget
            hasParking: true, // Default
            arrivalTime: place.startTime ? place.startTime.substring(0, 5) : '10:00',
            isLiveVideoAvailable: false, // Default
            nextTransport: nextTransport as any
        }
    })

    // 2. Calculate Stats
    const totalDurationMinutes = spots.reduce((sum, spot) => sum + spot.stayDurationMinutes, 0)
    const totalCost = spots.reduce((sum, spot) => sum + (spot.budget || 0), 0)

    const stats: DailyStats = {
        totalSpots: spots.length,
        totalDistanceKm: 12.5, // Transport distance is still mocked
        totalDurationMinutes: totalDurationMinutes, 
        totalCost: totalCost 
    }

    return {
        dailyPlanId: dailyPlan.dailyPlanId,
        dayNumber: dailyPlan.dayNumber,
        date: dailyPlan.date,
        themeTitle: `${travelPlan.title} - ${dailyPlan.dayNumber}일차`,
        stats: stats,
        spots: spots
    }
}
