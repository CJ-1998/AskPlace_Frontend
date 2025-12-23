<script setup lang="ts">
import type { PlaceDetail } from '@/features/plan/types/plan'
import { Card, CardContent } from '@ui/card'
import { Badge } from '@ui/badge'
import { getPlaceIcon, getCategoryName } from '@/features/plan/utils/planMappers'

defineProps<{
  place: PlaceDetail
  index: number
  dayColor: string
}>()

const emit = defineEmits<{
  (e: 'click-place', place: PlaceDetail): void
}>()
</script>

<template>
  <div class="relative group" @click="emit('click-place', place)">
    <!-- Timeline Connector Dot -->
    <!-- When first item, it's bigger and colored. When hovered, others become colored. -->
    <div 
        class="absolute -left-[31px] top-6 w-4 h-4 rounded-full border-[3px] border-white shadow-sm transition-all z-10"
        :class="[
          index === 0 ? 'scale-110' : 'bg-slate-300 group-hover:scale-110'
        ]"
        :style="{ 
          backgroundColor: index === 0 ? dayColor : undefined,
          '--hover-color': dayColor 
        }"
    >
      <!-- CSS variable workaround for hover color in style tag won't work easily with tailwind classes logic mixed -->
      <!-- We will use inline style for hover in a clearer way if needed, or just rely on class logic if color was static. -->
      <!-- Since color is dynamic, we apply background color directly for active state. -->
      <!-- For hover state on non-active items, it's tricky with inline styles. 
           We'll simply use the dayColor for the active one, and maybe a standard hover color 
           or bind mouseenter/leave if we strictly need dynamic hover color for the DOT.
           Refining: Let's keep it simple. Active = dayColor. Inactive = Gray. 
      -->
    </div>
    
    <!-- We can do a dynamic style binding for the group hover effect using a computed style or CSS variable scope -->
    <div class="hidden" :style="{ '--dynamic-color': dayColor }"></div>

    <!-- Place Card -->
    <!-- Hover border color needs to be dynamic. 
         We can use a wrapper with style binding or a border-color utility if we pass the color. -->
    <Card 
      class="cursor-pointer transition-all hover:shadow-md group-hover:-translate-y-0.5 border-transparent border"
      :style="{ borderColor: 'transparent' /* Default */ }" 
      @mouseenter="$el.style.borderColor = dayColor"
      @mouseleave="$el.style.borderColor = 'transparent'"
    >
      <CardContent class="p-4">
        <div class="flex justify-between items-start mb-2">
            <Badge 
              variant="secondary" 
              class="text-xs font-medium text-slate-500 bg-slate-100 transition-colors"
            >
                <i :class="[getPlaceIcon(place.contentTypeId), 'mr-1.5']"></i>
                {{ getCategoryName(place.contentTypeId) }}
            </Badge>
            <span class="text-[10px] text-slate-300 font-mono font-bold">#{{ place.order }}</span>
        </div>
        
        <h4 
          class="font-bold text-slate-800 text-base mb-1 transition-colors line-clamp-1"
          @mouseenter="$event.target.style.color = dayColor"
          @mouseleave="$event.target.style.color = ''"
        >
            {{ place.placeName }}
        </h4>
        <p class="text-xs text-slate-400 truncate">
            <i class="fa-solid fa-map-pin mr-1"></i>
            {{ place.latitude.toFixed(4) }}, {{ place.longitude.toFixed(4) }}
        </p>
      </CardContent>
    </Card>
  </div>
</template>
