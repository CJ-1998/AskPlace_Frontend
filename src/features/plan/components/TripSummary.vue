<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@ui/card'
import type { TravelPlan } from '@/features/plan/types/plan'

const props = defineProps<{
  plan: TravelPlan
}>()

const parseTime = (timeStr?: string): number => {
    if (!timeStr) return -1
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
}

const formatDuration = (totalMinutes: number): string => {
    if (totalMinutes <= 0) return '0분'
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours > 0) return `${hours}시간 ${minutes}분`
    return `${minutes}분`
}

const calculateHaversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3 // meters
    const toRad = (deg: number) => deg * Math.PI / 180
    
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2)
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)}m`
    return `${(meters / 1000).toFixed(1)}km`
}

const formatCurrency = (amount: number): string => {
    return `₩${amount.toLocaleString()}`
}


const totalPlaces = computed(() => {
  if (!props.plan?.dailyPlans) return 0
  return props.plan.dailyPlans.reduce((sum, day) => sum + (day.placeDetails?.length || 0), 0)
})

const totalTime = computed(() => {
    if (!props.plan?.dailyPlans) return '0분'
    
    let totalMinutes = 0
    
    props.plan.dailyPlans.forEach(day => {
        if (!day.placeDetails || day.placeDetails.length === 0) return

        let minStart = Infinity
        let maxEnd = -Infinity
        let hasValidTime = false

        day.placeDetails.forEach(place => {
            const start = parseTime(place.startTime)
            const end = parseTime(place.endTime)

            if (start !== -1) {
                if (start < minStart) minStart = start
                hasValidTime = true
            }
            if (end !== -1) {
                if (end > maxEnd) maxEnd = end
                hasValidTime = true
            }
        })
        
        if (hasValidTime && minStart !== Infinity && maxEnd !== -Infinity && maxEnd > minStart) {
            totalMinutes += (maxEnd - minStart)
        }
    })
    
    return formatDuration(totalMinutes)
})

const totalDistance = computed(() => {
    if (!props.plan?.dailyPlans) return '0km'

    let totalMeters = 0

    props.plan.dailyPlans.forEach(day => {
        const places = day.placeDetails || []
        if (places.length < 2) return

        for (let i = 0; i < places.length - 1; i++) {
            const p1 = places[i]
            const p2 = places[i + 1]
            
            if (p1.latitude && p1.longitude && p2.latitude && p2.longitude) {
                totalMeters += calculateHaversine(p1.latitude, p1.longitude, p2.latitude, p2.longitude)
            }
        }
    })

    return formatDistance(totalMeters)
})

const totalCost = computed(() => {
    if (!props.plan?.dailyPlans) return '₩0'
    
    let total = 0
    props.plan.dailyPlans.forEach(day => {
        day.placeDetails?.forEach(place => {
            total += (place.budget || 0)
        })
    })
    
    return formatCurrency(total)
})

</script>

<template>
  <div class="grid grid-cols-2 gap-3 mb-6">
    <!-- Places -->
    <Card class="bg-white shadow-sm border-slate-200">
      <CardContent class="p-4 flex flex-col items-center justify-center text-center space-y-1">
        <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-1">
            <i class="fa-solid fa-location-dot"></i>
        </div>
        <div class="text-xs text-slate-500 font-medium">총 장소</div>
        <div class="text-lg font-bold text-slate-900">{{ totalPlaces }}곳</div>
      </CardContent>
    </Card>

    <!-- Time -->
    <Card class="bg-white shadow-sm border-slate-200">
      <CardContent class="p-4 flex flex-col items-center justify-center text-center space-y-1">
        <div class="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-1">
            <i class="fa-regular fa-clock"></i>
        </div>
        <div class="text-xs text-slate-500 font-medium">순수 여행 시간</div>
        <div class="text-lg font-bold text-slate-900">{{ totalTime }}</div>
      </CardContent>
    </Card>

    <!-- Distance -->
    <Card class="bg-white shadow-sm border-slate-200">
      <CardContent class="p-4 flex flex-col items-center justify-center text-center space-y-1">
        <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-1">
            <i class="fa-solid fa-car"></i>
        </div>
        <div class="text-xs text-slate-500 font-medium">이동 거리</div>
        <div class="text-lg font-bold text-slate-900">{{ totalDistance }}</div>
      </CardContent>
    </Card>

    <!-- Cost -->
    <Card class="bg-white shadow-sm border-slate-200">
      <CardContent class="p-4 flex flex-col items-center justify-center text-center space-y-1">
         <div class="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mb-1">
            <i class="fa-solid fa-coins"></i>
        </div>
        <div class="text-xs text-slate-500 font-medium">총 예산</div>
        <div class="text-lg font-bold text-slate-900">{{ totalCost }}</div>
      </CardContent>
    </Card>
  </div>
</template>
