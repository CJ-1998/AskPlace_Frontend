<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useNaverMap } from '@/shared/composables/useNaverMap'
import type { TravelPlan, DailyPlan, PlaceDetail } from '@/features/plan/types/plan'
import type { DailyPlanDetail } from '@/features/plan/types/dailyPlan'
import { getDailyColor } from '@/shared/constants/colors'
import { getPlaceIcon } from '@/features/plan/utils/planMappers'
import { getDrivingRoute, type LatLng } from '@/features/plan/api/map'

const props = defineProps<{
  plan?: TravelPlan | null
  dayPlan?: DailyPlanDetail | DailyPlan | null
}>()

const mapContainer = ref<HTMLElement | null>(null)
const { initMap, mapInstance, addMarker, addPolyline, fitBounds, createLatLng } = useNaverMap()

const markers = ref<any[]>([])
const polylines = ref<any[]>([])

// --- Marker Generators ---
const createDayMarkerHtml = (dayNumber: number, color: string) => `
  <div style="position:relative;text-align:center;">
    <div style="background-color:${color};color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;
      justify-content:center;font-weight:800;border:3px solid white;box-shadow:0 4px 6px rgba(0,0,0,0.3);font-size:16px;z-index:2;position:relative;">
      ${dayNumber}
    </div>
  </div>
`

const createPlaceMarkerHtml = (contentTypeId: string | undefined, color: string) => {
    const iconClass = getPlaceIcon(contentTypeId)
    return `
      <div style="width:30px;height:30px;background-color:${color};border:2px solid white;border-radius:50%;
        display:flex;align-items:center;justify-content:center;color:white;font-size:13px;box-shadow:0 2px 5px rgba(0,0,0,0.25);">
        <i class="${iconClass}"></i>
      </div>
    `
}

// --- Map Drawing Logic ---
const clearMap = () => {
  markers.value.forEach(m => m.setMap(null))
  markers.value = []
  polylines.value.forEach(p => p.setMap(null))
  polylines.value = []
}

// Draw Markers only (for route mode, line is drawn separately)
const drawMarkers = (places: PlaceDetail[], dayNumber: number, dayColor: string, allPoints: { lat: number, lng: number }[]) => {
     places.forEach((place, index) => {
        const latLng = createLatLng(place.latitude, place.longitude)
        if (!latLng) return
        
        allPoints.push({ lat: place.latitude, lng: place.longitude })

        const isStart = index === 0
        const html = isStart 
            ? createDayMarkerHtml(dayNumber, dayColor) 
            : createPlaceMarkerHtml(place.contentTypeId, dayColor)
        
        const marker = addMarker({
            position: latLng,
            title: place.placeName,
            icon: {
                content: html,
                size: new window.naver.maps.Size(40, 40),
                anchor: new window.naver.maps.Point(20, 20)
            },
            zIndex: isStart ? 30 : 20
        })

         if (marker) {
             window.naver.maps.Event.addListener(marker, 'click', () => {
                mapInstance.value?.panTo(latLng)
            })
            markers.value.push(marker)
        }
    })
}

// Existing logic for Full Plan Overview (Straight Lines)
const drawDaySummary = (day: DailyPlan, allPoints: { lat: number, lng: number }[]) => {
    const dailyPlaces = day.placeDetails
    if (dailyPlaces.length === 0) return

    const dayColor = getDailyColor(day.dayNumber)
    drawMarkers(dailyPlaces, day.dayNumber, dayColor, allPoints)
    
    // Draw straight lines as fallback/summary
    const path: any[] = dailyPlaces.map(p => createLatLng(p.latitude, p.longitude)).filter(Boolean)

    if (path.length > 1) {
        const polyline = addPolyline({
            path: path,
            strokeColor: dayColor,
            strokeWeight: 5,
            strokeOpacity: 0.8,
            strokeStyle: 'solid',
            zIndex: 10, 
        })
        if (polyline) polylines.value.push(polyline)
    }
}

// New logic for Single Day Route (Driving Path)
const drawDailyRoute = async (day: DailyPlanDetail | DailyPlan, allPoints: { lat: number, lng: number }[]) => {
    const places: PlaceDetail[] = 'spots' in day ? (day as any).spots : (day as DailyPlan).placeDetails
    if (!places || places.length === 0) return

    const dayNumber = 'day' in day ? (day as any).day : (day as DailyPlan).dayNumber
    const dayColor = getDailyColor(dayNumber)
    
    // 1. Draw Markers
    drawMarkers(places, dayNumber, dayColor, allPoints)

    if (places.length < 2) return

    // 2. Fetch Driving Route
    const start = { lat: places[0].latitude, lng: places[0].longitude }
    const goal = { lat: places[places.length - 1].latitude, lng: places[places.length - 1].longitude }
    const waypoints = places.slice(1, places.length - 1).map(p => ({ lat: p.latitude, lng: p.longitude }))

    const routeData = await getDrivingRoute(start, goal, waypoints)

    if (routeData && routeData.route && routeData.route.traoptimal) {
        // Naver returns path as [lng, lat] array
        const pathData = routeData.route.traoptimal[0].path
        const parsePath = pathData.map(p => createLatLng(p[1], p[0])).filter(Boolean)

        const polyline = addPolyline({
            path: parsePath,
            strokeColor: dayColor,
            strokeWeight: 6,
            strokeOpacity: 0.9,
            zIndex: 10
        })
        if (polyline) polylines.value.push(polyline)
    } else {
        // Fallback to straight line if API fails
        const path = places.map(p => createLatLng(p.latitude, p.longitude)).filter(Boolean)
        const polyline = addPolyline({ path, strokeColor: dayColor, strokeWeight: 5, strokeOpacity: 0.5 })
        if (polyline) polylines.value.push(polyline)
    }
}

const drawItinerary = async () => {
  if (!mapInstance.value || !window.naver) return
  clearMap()

  const allPoints: { lat: number, lng: number }[] = []

  if (props.dayPlan) {
      // Single Day Mode (Detailed Route)
      await drawDailyRoute(props.dayPlan, allPoints)
  } else if (props.plan) {
      // Full Plan Mode (Summary)
      props.plan.dailyPlans?.forEach(day => drawDaySummary(day, allPoints))
  }

  if (allPoints.length > 0) fitBounds(allPoints, 60)
}

// --- Exposed Actions ---
const focusPlace = (lat: number, lng: number) => {
  if (!mapInstance.value || !window.naver) return
  const position = new window.naver.maps.LatLng(lat, lng)
  mapInstance.value.panTo(position, { duration: 500 })
}

defineExpose({ focusPlace })

onMounted(() => {
  if (mapContainer.value) {
    initMap(mapContainer.value, { 
        zoom: 10, 
        scaleControl: false, 
        logoControl: false, 
        mapDataControl: false 
    })
  }
})

watch(() => [props.plan, props.dayPlan], () => {
   if (mapInstance.value) drawItinerary()
}, { deep: true })

watch(() => mapInstance.value, (newMap) => {
  if (newMap) drawItinerary()
})
</script>

<template>
  <div class="w-full h-full bg-slate-100">
    <div ref="mapContainer" class="w-full h-full focus:outline-none"></div>
  </div>
</template>
