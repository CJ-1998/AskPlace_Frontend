import { apiClient } from '@/shared/api/client'
import type { PlaceDetail } from '@/features/place/types/place'

export interface PathData {
    path: { lat: number; lng: number }[]
    duration: number
    distance: number
}

// Naver Maps API Responses (Simplified)
interface NaverDrivingResponse {
    code: number
    message: string
    route: {
        trafast?: NaverRouteData[]
        traoptimal?: NaverRouteData[]
    }
}

interface NaverRouteData {
    summary: {
        distance: number
        duration: number
        bbox: number[][]
    }
    path: number[][] // [lng, lat][]
}

/**
 * Fetches the driving route path between multiple places.
 * Automatically chooses between 'Directions 5' and 'Directions 15' APIs based on waypoint count.
 * 
 * Logic:
 * - <= 5 places: Uses 'Directions 5' (standard)
 * - > 5 places: Uses 'Directions 15' (multipoint)
 * 
 * @param places List of places to visit (ordered)
 * @returns PathData (coordinates, duration, distance)
 */
export const fetchRoutePath = async (places: PlaceDetail[]): Promise<PathData | null> => {
    if (places.length < 2) {
        console.warn('Need at least 2 places to calculate a route.')
        return null
    }

    const start = places[0]
    const goal = places[places.length - 1]
    const waypoints = places.slice(1, places.length - 1)

    // Use apiClient which handles base URL and auth if needed
    // We assume backend has proxy endpoints:
    // /api/naver/driving (for <= 5)
    // /api/naver/driving-15 (for > 5)

    try {
        let response;

        if (places.length <= 5) {
            // Directions 5 Logic
            // Params: start, goal, waypoints (pipe separated)
            // Format: lng,lat
            const startParam = `${start.longitude},${start.latitude}`
            const goalParam = `${goal.longitude},${goal.latitude}`
            const waypointsParam = waypoints.map(p => `${p.longitude},${p.latitude}`).join('|')

            response = await apiClient.get<NaverDrivingResponse>('/naver/driving', {
                params: {
                    start: startParam,
                    goal: goalParam,
                    waypoints: waypointsParam || undefined,
                    option: 'trafast' // Real-time fast route
                }
            })
            console.log('[Directions 5] Response:', response.data)

        } else {
            // Directions 15 Logic
            // Different API endpoint usually required for > 5 waypoints
            const startParam = `${start.longitude},${start.latitude}`
            const goalParam = `${goal.longitude},${goal.latitude}`
            const waypointsParam = waypoints.map(p => `${p.longitude},${p.latitude}`).join('|')

            response = await apiClient.get<NaverDrivingResponse>('/naver/driving-15', { // specific proxy endpoint
                params: {
                    start: startParam,
                    goal: goalParam,
                    waypoints: waypointsParam,
                    option: 'trafast'
                }
            })
        }

        const data = response.data

        // Naver API structure: route.trafast[0] or route.traoptimal[0]
        const route = data.route?.trafast?.[0] || data.route?.traoptimal?.[0]

        if (!route) {
            throw new Error('No route found')
        }

        return {
            // Convert [lng, lat] -> { lat, lng }
            path: route.path.map(p => ({ lat: p[1], lng: p[0] })),
            duration: route.summary.duration, // milliseconds
            distance: route.summary.distance  // meters
        }

    } catch (error) {
        console.error('Failed to fetch route path:', error)
        return null
    }
}
