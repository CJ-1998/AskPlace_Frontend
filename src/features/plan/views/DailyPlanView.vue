<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useNaverMap } from '@/shared/composables/useNaverMap'
import { fetchRoutePath, type PathData } from '@/shared/services/directionService'
import type { DailyPlanDetail, DailySpot } from '@/features/plan/types/dailyPlan'
import type { PlaceDetail } from '@/features/plan/types/plan'
import PlacePlanItem from '@/features/plan/components/PlacePlanItem.vue'
import { Card, CardContent } from '@ui/card'
import { calculateHaversine } from '@/features/plan/utils/distance'

interface Props {
  plan: DailyPlanDetail
}

const props = defineProps<Props>()

const mapContainer = ref<HTMLElement | null>(null)
const { initMap, addMarker, addPolyline, fitBounds, createInfoWindow, addListener, mapInstance } = useNaverMap()

const routeData = ref<PathData | null>(null)
const isRouteLoading = ref(false)

// Keep track of open InfoWindow to close previous one
let currentInfoWindow: any = null

// --- Video State ---
import { getLatestVideoByPlace } from '@/features/video/api/video'
import type { VideoResponse } from '@/features/video/api/video'

const liveVideos = ref<Record<string, VideoResponse>>({})

const fetchLiveVideos = async () => {
    const spots = props.plan.spots || []
    if (spots.length === 0) return

    const uniquePlaceIds = [...new Set(spots.map(s => s.placeId).filter(Boolean))]
    
    // Reset video map (or keep? depends on if we want cache. Reset is safer for clean state)
    // Actually we can just update.
    
    // Fetch in parallel
    const promises = uniquePlaceIds.map(async (placeId) => {
        try {
            const video = await getLatestVideoByPlace(placeId)
            if (video) {
                liveVideos.value[placeId] = video
            }
        } catch (e) {
            // Ignore error or no video found
        }
    })
    
    await Promise.allSettled(promises)
}


// --- Transport & Distance Calculation ---
const processedSpots = computed(() => {
    const spots = props.plan.spots || []
    return spots.map((spot, index) => {
        // Clone spot to avoid mutating prop directly if needed, 
        // effectively we are augmenting it.
        const newSpot = { ...spot }

        if (index < spots.length - 1) {
             const nextSpot = spots[index + 1]
             if (spot.location && nextSpot.location) {
                 const distMeters = calculateHaversine(
                    spot.location.lat, 
                    spot.location.lng, 
                    nextSpot.location.lat, 
                    nextSpot.location.lng
                 )
                 const distKm = distMeters / 1000
                 
                 const isWalk = distKm < 2.0
                 const mode = isWalk ? 'WALK' : 'CAR'
                 
                 const displayDistKm = isWalk ? distKm : (distKm)

                 const durationMinutes = isWalk 
                    ? Math.round(displayDistKm * 15) 
                    : Math.round(displayDistKm * 1) // 60km/h

                 newSpot.nextTransport = {
                     mode,
                     durationMinutes: durationMinutes < 1 ? 1 : durationMinutes,
                     distanceKm: parseFloat(displayDistKm.toFixed(1))
                 }
             }
        }
        return newSpot
    })
})

const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}분`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`
}

// --- Stats Calculation (Frontend) ---
const calculatedStats = computed(() => {
    const spots = props.plan.spots || []
    const totalCount = spots.length
    let totalCost = 0
    let totalDuration = 0
    let totalDistMeters = 0

    // 1. Calculate Cost (Budget + Admission) & Distance
    spots.forEach((spot, index) => {
        totalCost += (spot.budget || 0)
        totalCost += (spot.admissionFee || 0)
        
        // Add stay duration
        totalDuration += spot.stayDurationMinutes

        // Calculate Haversine Distance to next spot
        if (index < spots.length - 1) {
            const nextSpot = spots[index + 1]
            if (spot.location && nextSpot.location) {
                totalDistMeters += calculateHaversine(
                    spot.location.lat, 
                    spot.location.lng, 
                    nextSpot.location.lat, 
                    nextSpot.location.lng
                )
            }
        }
    })
    
    // Fallback: if routeData is available, use IT for total duration as it includes traffic/routes
    if (routeData.value) {
        // totalDuration from route is just travel time. We must ADD stay durations.
        // HOWEVER, user requested Haversine for DISTANCE. We keep the explicit request.
        // We can still use route duration for time if we want, but let's stick to simple sum + route travel time if available?
        // Let's rely on simple sum of stay + (maybe route duration if available, else 0/manual)?
        // For consistency with "TripSummary", we might want to just sum up.
        // Actually, let's add the route travel time (converted to minutes) to the total duration
        const routeTravelMinutes = Math.round(routeData.value.duration / 60000)
        totalDuration += routeTravelMinutes
    }

    return {
        count: totalCount,
        cost: totalCost,
        distance: (totalDistMeters / 1000).toFixed(1), // km conversion
        duration: formatDuration(totalDuration)
    }
})

// --- Mapping Helper ---
const mapSpotToPlaceDetail = (spot: DailySpot): PlaceDetail => {
    // Calculate endTime based on arrival + stay
    let startTime = spot.arrivalTime // "HH:mm"
    let endTime = undefined
    
    if (startTime) {
        const [h, m] = startTime.split(':').map(Number)
        const totalM = h * 60 + m + spot.stayDurationMinutes
        const endH = Math.floor(totalM / 60) % 24
        const endM = totalM % 60
        endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
    }

    return {
        placeDetailId: spot.placeId, // Map placeId
        order: spot.order,
        placeName: spot.name,
        latitude: spot.location.lat,
        longitude: spot.location.lng,
        placeAddress: spot.address,
        placeImageUrl: spot.thumbnailUrl, // Map thumbnail
        contentTypeId: undefined, // Not in DailySpot, maybe not critical for icon if fallback used
        description: spot.description,
        
        // Planning
        startTime: startTime,
        endTime: endTime,
        durationMinutes: spot.stayDurationMinutes,
        budget: spot.budget,
        hasLiveVideo: !!liveVideos.value[spot.placeId], 
        latestVideo: liveVideos.value[spot.placeId],
        thumbnailUrl: spot.thumbnailUrl
    }
}

// --- Map Logic ---

const initializeMapAndMarkers = async () => {
    if (!mapContainer.value) return
    
    // 1. Init Map
    initMap(mapContainer.value, {
        zoom: 12
    })

    // 2. Add Markers & InfoWindows
    const latLngs: { lat: number; lng: number }[] = []
    
    props.plan.spots.forEach((spot: DailySpot) => {
        const marker = addMarker({
            position: { lat: spot.location.lat, lng: spot.location.lng },
            title: spot.name,
            icon: {
                content: `
                  <div style="
                      background: #FF5A5F; 
                      color: white; 
                      width: 28px; 
                      height: 28px; 
                      border-radius: 50%; 
                      display: flex; 
                      align-items: center; 
                      justify-content: center; 
                      font-weight: 700; 
                      font-size: 14px;
                      border: 2px solid white; 
                      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                      cursor: pointer;
                      font-family: sans-serif;
                  ">
                    ${spot.order}
                  </div>
                `,
                anchor: { x: 14, y: 14 }
            }
        })
        
        // InfoWindow Content
        const infoContent = `
            <div style="
                padding: 20px; 
                background: white; 
                border-radius: 16px; 
                box-shadow: 0 4px 20px rgba(0,0,0,0.15); 
                min-width: 280px;
                max-width: 320px;
                text-align: left;
                border: 1px solid #f1f5f9;
                font-family: 'Pretendard', sans-serif;
            ">
                <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: start;">
                     <span style="
                        background: #eff6ff; 
                        color: #3b82f6; 
                        font-size: 11px; 
                        padding: 4px 8px; 
                        border-radius: 6px; 
                        font-weight: 600;
                     ">${spot.category}</span>
                     <span style="font-size: 12px; font-weight: 700; color: #cbd5e1;">NO.${spot.order}</span>
                </div>
                
                <h4 style="margin: 0 0 6px 0; font-size: 18px; font-weight: 700; color: #1e293b; line-height: 1.3; letter-spacing: -0.5px;">
                    ${spot.name}
                </h4>
                
                <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; line-height: 1.4;">
                    <span style="margin-right: 4px;">📍</span>${spot.address || '주소 정보 없음'}
                </p>

                ${spot.description ? `
                <div style="
                    margin-bottom: 12px; 
                    padding: 10px; 
                    background: #f8fafc; 
                    border-radius: 8px; 
                    font-size: 13px; 
                    color: #475569; 
                    line-height: 1.5;
                ">
                    ${spot.description}
                </div>
                ` : ''}
                
                <div style="
                    display: flex; 
                    gap: 12px; 
                    border-top: 1px solid #f1f5f9; 
                    padding-top: 12px;
                    margin-top: 4px;
                ">
                    <div style="flex: 1;">
                        <span style="display: block; font-size: 11px; color: #94a3b8; margin-bottom: 2px;">소요 시간</span>
                        <span style="font-size: 14px; color: #0f172a; font-weight: 600;">
                            <span style="color: #06b6d4;">⏱</span> ${spot.stayDurationMinutes}분
                        </span>
                    </div>
                    <div style="width: 1px; background: #f1f5f9;"></div>
                    <div style="flex: 1;">
                         <span style="display: block; font-size: 11px; color: #94a3b8; margin-bottom: 2px;">예산</span>
                         <span style="font-size: 14px; color: #0f172a; font-weight: 600;">
                            <span style="color: #eab308;">₩</span> ${spot.budget ? spot.budget.toLocaleString() : '0'}
                         </span>
                    </div>
                </div>
            </div>
        `
        const infoWindow = createInfoWindow(infoContent)

        // Add Click Listener
        if (marker && infoWindow) {
            addListener(marker, 'click', () => {
                if (currentInfoWindow) {
                     currentInfoWindow.close()
                }
                
                if (infoWindow.getMap()) {
                    infoWindow.close()
                } else {
                    infoWindow.open(mapInstance.value, marker)
                    currentInfoWindow = infoWindow
                }
            })
            
            // Also close InfoWindow when clicking on the map
            addListener(mapInstance.value, 'click', () => {
                 infoWindow.close()
            })
        }

        latLngs.push({ lat: spot.location.lat, lng: spot.location.lng })
    })

    // 3. Fit Bounds
    if (latLngs.length > 0) {
        setTimeout(() => {
             fitBounds(latLngs, 50)
        }, 100)
    }

    // 4. Fetch and Draw Route
    await drawRoute()
}

const drawRoute = async () => {
    if (props.plan.spots.length < 2) return

    isRouteLoading.value = true
    try {
        // Map DailySpot to PlaceDetail-compatible object
        const placesForRoute: PlaceDetail[] = props.plan.spots.map(spot => ({
            placeDetailId: spot.placeId,
            placeName: spot.name,
            placeAddress: '', 
            latitude: spot.location.lat,
            longitude: spot.location.lng,
            order: spot.order,
            contentId: '',
            region: '',
            siGunGu: '',
            description: '',
            thumbnailUrl: '',
            // Mock other required props
        }))

        const data = await fetchRoutePath(placesForRoute)
        
        if (data) {
            routeData.value = data
            
            // Draw Polyline
            addPolyline({
                path: data.path,
                strokeColor: '#06b6d4', // BRAND_COLOR
                strokeWeight: 5,
                strokeOpacity: 0.9,
                strokeLineCap: 'round',
                strokeLineJoin: 'round'
            })
        }
    } catch (error) {
        console.error('Failed to draw route:', error)
    } finally {
        isRouteLoading.value = false
    }
}

const openNaverMapDirections = (start: DailySpot, end: DailySpot, mode: 'transit' | 'car' | 'walk') => {
    if (!start.location || !end.location) return

    const startName = encodeURIComponent(start.name || '출발지')
    const endName = encodeURIComponent(end.name || '도착지')
    
    // Naver Map P-type Direction URL format (New)
    // https://map.naver.com/p/directions/startLng,startLat,startName/endLng,endLat,endName/-/mode?c=13.00,0,0,0,dh
    const url = `https://map.naver.com/p/directions/${start.location.lng},${start.location.lat},${startName}/${end.location.lng},${end.location.lat},${endName}/-/${mode}?c=13.00,0,0,0,dh`
    
    window.open(url, '_blank')
}

onMounted(async () => {
    await nextTick()
    initializeMapAndMarkers()
    fetchLiveVideos()
})

watch(() => props.plan, () => {
    routeData.value = null // Reset route data
    initializeMapAndMarkers()
    fetchLiveVideos()
}, { deep: true })
</script>

<template>
  <div class="daily-plan-view-container">
    <!-- Map Section (Top) -->
    <div class="map-wrapper">
        <div ref="mapContainer" class="map-section"></div>
        
        <!-- Loading Overlay -->
        <div v-if="isRouteLoading" class="map-loading-overlay">
            <div class="spinner"></div>
            <span>경로 탐색 중...</span>
        </div>
    </div>

    <!-- List Section (Bottom) -->
    <div class="list-section">
        <!-- Daily Header Statistics -->
        <Card class="mb-8 border-none shadow-none bg-slate-50/50">
            <CardContent class="p-6">
                <h2 class="text-3xl font-bold text-slate-900 mb-2">
                    {{ plan.dayNumber }}일차 - {{ plan.themeTitle || '여행 일정' }}
                </h2>
                <p class="text-slate-500 mb-6 font-medium">
                     {{ plan.date }} · 설악산의 아름다운 자연을 만끽하는 하루 
                </p>

                <div class="flex flex-wrap gap-4 md:gap-8 items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-location-dot text-red-500 text-lg"></i>
                        <span class="font-bold text-slate-700 text-lg">{{ calculatedStats.count }}개 <span class="text-slate-400 font-normal text-sm">장소</span></span>
                    </div>
                    <div class="w-px h-8 bg-slate-100 hidden md:block"></div>
                     <div class="flex items-center gap-2">
                        <i class="fa-regular fa-clock text-slate-800 text-lg"></i>
                        <span class="font-bold text-slate-700 text-lg">{{ calculatedStats.duration }} <span class="text-slate-400 font-normal text-sm">소요</span></span>
                    </div>
                    <div class="w-px h-8 bg-slate-100 hidden md:block"></div>
                     <div class="flex items-center gap-2">
                        <i class="fa-solid fa-car text-red-500 text-lg"></i>
                        <span class="font-bold text-slate-700 text-lg">{{ calculatedStats.distance }}km <span class="text-slate-400 font-normal text-sm">이동</span></span>
                    </div>
                    <div class="w-px h-8 bg-slate-100 hidden md:block"></div>
                     <div class="flex items-center gap-2">
                        <i class="fa-solid fa-coins text-yellow-500 text-lg"></i>
                         <span class="font-bold text-slate-700 text-lg">₩{{ calculatedStats.cost.toLocaleString() }} <span class="text-slate-400 font-normal text-sm">예상</span></span>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <div class="spots-list pl-2 pr-2 md:pl-6 md:pr-6">
             <div v-for="(spot, index) in processedSpots" :key="spot.uid" class="timeline-item">
                
                <!-- Place Item -->
                <PlacePlanItem 
                    :place="mapSpotToPlaceDetail(spot)" 
                    :is-last="index === plan.spots.length - 1"
                />

                <!-- Transport Info (Between Items) -->
                <div v-if="index !== processedSpots.length - 1" class="ml-[5px] pl-6 py-6 relative border-l-[2px] border-slate-400 border-dashed">
                    <div v-if="spot.nextTransport" class="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg w-fit group hover:bg-slate-100 transition-colors">
                        <i class="fa-solid fa-person-walking text-green-500 text-lg"></i>
                        
                        <div class="flex flex-col">
                            <span class="font-bold text-slate-700">
                                직선 거리
                            </span>
                            <span class="text-xs">
                                {{ spot.nextTransport.distanceKm }}km
                            </span>
                        </div>

                        <!-- Transport Action Buttons -->
                        <div class="flex gap-1.5 ml-4">
                            <!-- Helper Tooltip -->
                            <div class="text-[10px] text-slate-400 self-center mr-1 hidden sm:block">길찾기:</div>

                            <!-- Public Transit -->
                            <button 
                                @click="openNaverMapDirections(spot, processedSpots[index + 1], 'transit')"
                                class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-green-600 hover:border-green-600 hover:bg-green-50 transition-all shadow-sm"
                                title="대중교통 길찾기"
                            >
                                <i class="fa-solid fa-bus text-xs"></i>
                            </button>

                            <!-- Car -->
                            <button 
                                @click="openNaverMapDirections(spot, processedSpots[index + 1], 'car')"
                                class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                                title="자동차 길찾기"
                            >
                                <i class="fa-solid fa-car text-xs"></i>
                            </button>

                            <!-- Walk -->
                            <button 
                                @click="openNaverMapDirections(spot, processedSpots[index + 1], 'walk')"
                                class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-orange-500 hover:border-orange-500 hover:bg-orange-50 transition-all shadow-sm"
                                title="도보 길찾기"
                            >
                                <i class="fa-solid fa-person-walking text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.daily-plan-view-container {
    display: flex;
    flex-direction: column;
    height: 100%; 
}

.map-wrapper {
    position: relative;
    width: 100%;
    height: 320px;
    background-color: #eee;
    z-index: 1;
}

.map-section {
    width: 100%;
    height: 100%;
}

.map-loading-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.9);
    padding: 12px 20px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    z-index: 10;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #cbd5e1;
    border-top-color: #06b6d4;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.list-section {
    flex: 1;
    background: white;
    z-index: 2;
    position: relative;
    /* margin-top: -20px; */
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    /* box-shadow: 0 -4px 20px rgba(0,0,0,0.1); */
    padding: 0;
    min-height: 400px; 
}

.spots-list {
    display: flex;
    flex-direction: column;
    /* gap: 20px; Ensure proper gap handled by transport blocks */ 
}
</style>
