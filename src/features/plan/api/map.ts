import axios from 'axios'

export interface LatLng {
    lat: number
    lng: number
}

export interface RouteResponse {
    route: {
        traoptimal: {
            summary: {
                start: { location: [number, number] },
                goal: { location: [number, number] },
                distance: number,
                duration: number,
                bbox: [[number, number], [number, number]],
                tollFare: number,
                taxiFare: number,
                fuelPrice: number
            },
            path: [number, number][], // [lng, lat]
            section: any[]
        }[]
    },
    code: number,
    message: string
}

// Client ID and Secret should be in .env 
// VITE_NAVER_MAP_API_CLIENT_ID
// VITE_NAVER_MAP_API_CLIENT_SECRET
const CLIENT_ID = import.meta.env.VITE_NAVER_MAP_API_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_NAVER_MAP_API_CLIENT_SECRET

const mapApi = axios.create({
    baseURL: '/naver-api', // Proxied to https://naveropenapi.apigw.ntruss.com
    headers: {
        'X-NCP-APIGW-API-KEY-ID': CLIENT_ID,
        'X-NCP-APIGW-API-KEY': CLIENT_SECRET
    }
})

export const getDrivingRoute = async (
    start: LatLng,
    goal: LatLng,
    waypoints: LatLng[] = []
): Promise<RouteResponse | null> => {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error('Naver Map Client ID or Secret is missing.')
        return null
    }

    // Format: "lng,lat"
    const startStr = `${start.lng},${start.lat}`
    const goalStr = `${goal.lng},${goal.lat}`
    const waypointsStr = waypoints.map(p => `${p.lng},${p.lat}`).join('|')

    // Logic: > 5 waypoints -> driving15, <= 5 -> driving
    // Note: Naver driving supports up to 5 waypoints. driving15 supports up to 15.
    const isExtended = waypoints.length > 5

    const url = isExtended
        ? '/map-direction-15/v1/driving'
        : '/map-direction/v1/driving'

    try {
        const response = await mapApi.get<RouteResponse>(url, {
            params: {
                start: startStr,
                goal: goalStr,
                waypoints: waypointsStr,
                option: 'traoptimal' // Default optimal path
            }
        })

        if (response.data.code === 0) {
            return response.data
        } else {
            console.error('Map Route API Error:', response.data.message)
            return null
        }
    } catch (error) {
        console.error('Failed to fetch route:', error)
        return null
    }
}
