import type { DailyPlan as StoreDailyPlan, TravelPlan } from '@/features/plan/types/plan'
import type { DailyPlanDetail, DailySpot, DailyStats } from '@/features/plan/types/dailyPlan'

/**
 * Store의 DailyPlan 데이터를 View의 DailyPlanDetail 데이터로 변환합니다.
 */
export const mapToDailyPlanDetail = (
    dailyPlan: StoreDailyPlan,
    travelPlan: TravelPlan
): DailyPlanDetail => {

    const spots: DailySpot[] = dailyPlan.placeDetails.map((place, index, arr) => {
        const nextPlace = arr[index + 1]

        let nextTransport = undefined

        if (nextPlace) {
            nextTransport = {
                mode: 'CAR',
                durationMinutes: 15,
                distanceKm: 5.5,
                cost: 0
            }
        }

        return {
            uid: place.placeDetailId,
            placeId: place.placeDetailId,
            order: place.order,
            name: place.placeName,
            category: '장소',
            description: place.memo,
            address: place.placeAddress,
            thumbnailUrl: place.placeImageUrl,
            location: {
                lat: place.latitude,
                lng: place.longitude
            },
            stayDurationMinutes: place.durationMinutes || 60,
            admissionFee: 0,
            budget: place.budget || 0,
            hasParking: true,
            arrivalTime: place.startTime ? place.startTime.substring(0, 5) : '10:00',
            isLiveVideoAvailable: false, // Default
            nextTransport: nextTransport as any
        }
    })

    const totalDurationMinutes = spots.reduce((sum, spot) => sum + spot.stayDurationMinutes, 0)
    const totalCost = spots.reduce((sum, spot) => sum + (spot.budget || 0), 0)

    const stats: DailyStats = {
        totalSpots: spots.length,
        totalDistanceKm: 12.5,
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
