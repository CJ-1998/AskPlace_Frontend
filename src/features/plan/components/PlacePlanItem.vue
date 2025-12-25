<script setup lang="ts">
import type { PlaceDetail } from '@/features/plan/types/plan'
import { Button } from '@ui/button'
import { getContentTypeLabel, getContentTypeColor } from '@/features/place/utils/contentTypeMapper'
import { useRouter } from 'vue-router'
import placeholderImg from '@/assets/placeholder.png'

const props = defineProps<{
  place: PlaceDetail
  isLast: boolean
}>()

const router = useRouter()

const getCategoryIcon = (contentTypeId?: string) => {
    switch(contentTypeId) {
        case '12': return 'fa-solid fa-umbrella-beach'
        case '14': return 'fa-solid fa-landmark'
        case '32': return 'fa-solid fa-hotel'
        case '39': return 'fa-solid fa-utensils'
        default: return 'fa-solid fa-map-pin'
    }
}

const handleGoToVideo = () => {
    if (props.place.placeDetailId) {
        router.push({ path: '/videos', query: { placeId: props.place.placeDetailId } })
    }
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = placeholderImg
}
const formatTime = (time?: string) => {
    if (!time) return ''
    return time.substring(0, 5)
}
</script>

<template>
    <div class="relative flex gap-4">
        <!-- 1. Vertical Timeline -->
        <div class="flex flex-col items-center pt-[6px]"> <!-- Adjusted padding to align dot with time -->
            <!-- Marker -->
            <div class="w-3 h-3 rounded-full bg-slate-50 ring-[3px] ring-white border-[3px] border-emerald-500 shadow-sm z-10 shrink-0 transition-colors group-hover:bg-emerald-500"></div>
            
            <!-- Vertical Line -->
            <div v-if="!isLast" class="w-[2px] bg-slate-400 flex-1 my-1"></div>
        </div>

        <!-- 2. Info Card -->
        <div class="flex-1 pb-8">
            <!-- Time Display (Moved here, aligns with marker) -->
            <div v-if="place.startTime" class="mb-3 flex items-center h-4">
                 <span class="text-sm font-bold text-slate-600 font-mono">{{ formatTime(place.startTime) }}</span> ~ <span class="text-sm font-bold text-slate-600 font-mono">{{ formatTime(place.endTime) }}</span>
            </div>
            
            <!-- Card -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col sm:flex-row transition-all hover:shadow-md hover:border-emerald-200 group cursor-pointer">
                
                <!-- Thumbnail -->
                <div class="relative w-full sm:w-28 h-28 sm:h-auto shrink-0 bg-slate-50">
                    <img 
                        v-if="place.thumbnailUrl || place.placeImageUrl" 
                        :src="place.thumbnailUrl || place.placeImageUrl" 
                        :alt="place.placeName"
                        class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-slate-300 text-2xl">
                        <i :class="getCategoryIcon(place.contentTypeId)"></i>
                    </div>
                    
                    <!-- Order Label -->
                    <div class="absolute top-2 left-2 w-5 h-5 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center text-[10px] font-bold font-mono">
                        {{ place.order }}
                    </div>
                </div>

                <!-- Content -->
                <div class="flex-1 p-3 flex flex-col min-h-[110px]">
                    <div class="mb-2">
                        <div class="flex justify-between items-start">
                            <h4 class="font-bold text-base text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                {{ place.placeName }}
                            </h4>
                            <!-- Category Badge (Optional) -->
                            <!-- <Badge variant="outline" class="text-[10px] h-5 px-1.5 text-slate-400 font-normal">
                                Category
                            </Badge> -->
                        </div>
                    </div>
                    <p v-if="place.description" class="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {{ place.description }}
                    </p>

                    <!-- Meta Info Grid Service -->
                    <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                        <!-- Duration -->
                        <div class="flex flex-col">
                            <span class="text-[11px] text-slate-400 mb-1">소요시간</span>
                            <span class="text-xs font-bold text-slate-700">{{ place.durationMinutes || 60 }}분</span>
                        </div>
                        <!-- Budget -->
                        <div class="flex flex-col">
                            <span class="text-[11px] text-slate-400 mb-1">예산</span>
                            <span class="text-xs font-bold text-slate-700">
                                {{ `${(place.budget || 0).toLocaleString()}원` }}
                            </span>
                        </div>
                    </div>

                    <!-- Live Video Section -->
                    <div v-if="place.hasLiveVideo && place.latestVideo" class="mt-4">
                        <div class="relative group/video overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
                            <div class="flex p-3 gap-4 h-24">
                                <!-- Thumbnail -->
                                <div class="relative w-32 shrink-0 rounded-md overflow-hidden bg-slate-100 group cursor-pointer" @click.stop="handleGoToVideo">
                                    <img 
                                        :src="place.latestVideo.thumbnailUrl || place.thumbnailUrl || place.placeImageUrl || placeholderImg" 
                                        class="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        alt="Live Video"
                                        @error="handleImageError"
                                    />
                                    <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                    <div class="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 animate-pulse">
                                        <div class="w-1.5 h-1.5 rounded-full bg-white"></div> ACTIVE
                                    </div>
                                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div class="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                            <i class="fa-solid fa-play text-slate-900 ml-0.5 text-xs"></i>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Info & Action -->
                                <div class="flex flex-col justify-between flex-1 py-0.5">
                                    <div>
                                        <h5 class="text-sm font-bold text-slate-800 line-clamp-1 mb-1">
                                            {{ place.latestVideo.title || `${place.placeName} 실시간 현장` }}
                                        </h5>
                                        <p class="text-[11px] text-slate-500 line-clamp-1 md:line-clamp-1">
                                            현장의 분위기를 확인해보세요!
                                        </p>
                                    </div>
                                    
                                    <Button 
                                        @click.stop="handleGoToVideo"
                                        class="w-full sm:w-fit self-end bg-slate-900 hover:bg-slate-800 text-white text-[11px] h-7 px-3 rounded shadow-sm font-medium border-none flex items-center gap-1.5"
                                    >
                                        <span>영상 보러가기</span>
                                        <i class="fa-solid fa-arrow-right text-[9px]"></i>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- No Live Video Indicator -->
                    <div v-else class="mt-2 text-[10px] text-slate-300 flex items-center gap-1.5 select-none">
                        <i class="fa-solid fa-video-slash"></i> 실시간 영상 없음
                    </div>
                </div>
            </div>
        </div>
  </div>
</template>
