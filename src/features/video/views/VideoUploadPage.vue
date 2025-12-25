<script setup lang="ts">
import { ref } from 'vue'
import { useVideoUpload } from '@/features/video/composables/useVideoUpload'
import { Button } from '@ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@ui/card'
import { Input } from '@ui/input'
import { Textarea } from '@ui/textarea'
import { UploadCloud, FileVideo, X, Loader2 } from 'lucide-vue-next'

const {
  // State
  file,
  title,
  description,
  destinationId,
  isUploading,
  uploadProgress,
  uploadStep,
  isDragging,
  
  // Methods
  removeFile,
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  uploadVideo: handleUpload // Aliasing explicitly to match template
} = useVideoUpload()

const fileInput = ref<HTMLInputElement | null>(null)

// Prevent accidental window close
window.addEventListener('beforeunload', (e) => {
  if (isUploading.value) {
    e.preventDefault()
    e.returnValue = ''
  }
})

// Place Search Logic
import { useDebounceFn } from '@vueuse/core'
import { placeApi } from '@/features/place/api/place'
import type { PlaceSummary } from '@/features/place/types/place'

const placeSearchQuery = ref('')
const placeSearchResults = ref<PlaceSummary[]>([])
const isSearchingPlace = ref(false)
const showPlaceResults = ref(false)
const selectedPlace = ref<PlaceSummary | null>(null)

// Debounced Search Handler
const handlePlaceSearch = useDebounceFn(async () => {
  if (!placeSearchQuery.value || placeSearchQuery.value.length < 2) {
    placeSearchResults.value = []
    showPlaceResults.value = false
    return
  }

  isSearchingPlace.value = true
  showPlaceResults.value = true
  
  try {
    const response = await placeApi.getPlaces({ 
      placeName: placeSearchQuery.value,
      page: 0, 
      size: 5 // Limit suggestions
    })
    placeSearchResults.value = response.placeSearchResponseDtoList
  } catch (error) {
    console.error('Failed to search places:', error)
    placeSearchResults.value = []
  } finally {
    isSearchingPlace.value = false
  }
}, 500)

const selectPlace = (place: PlaceSummary) => {
  selectedPlace.value = place
  destinationId.value = place.placeId 
  
  placeSearchQuery.value = ''
  showPlaceResults.value = false
}

const clearSelectedPlace = () => {
  selectedPlace.value = null
  destinationId.value = undefined
}
</script>

<template>
  <div class="container mx-auto py-10 px-4 max-w-2xl">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl">동영상 업로드</CardTitle>
        <CardDescription>여행지의 순간을 공유하세요. <br /> 장소를 선택하고 영상을 업로드하면 이용자 분들께 도움이 됩니다.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">

        <!-- Guide Box -->
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 class="font-bold text-blue-900 mb-2 text-sm">💡 업로드 가이드</h4>
          <ul class="text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>촬영한 동영상 파일을 선택해주세요. (최대 500MB)</li>
            <li>영상 제목과 상세 설명을 입력해주세요.</li>
            <li><b>장소 선택은 필수입니다.</b> 영상이 촬영된 장소를 검색하여 지정해주세요.</li>
          </ul>
        </div>
        
        <!-- File Drop Zone -->
        <div 
          v-if="!file"
          class="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors"
          :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
          @click="fileInput?.click()"
        >
          <UploadCloud class="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <h3 class="text-lg font-medium text-slate-700">동영상을 이곳에 드래그하세요</h3>
          <p class="text-sm text-slate-500 mb-2">또는 클릭하여 파일 선택</p>
          <p class="text-xs text-red-500 font-medium mt-4">
            * 최대 500MB, MP4/MOV 형식만 지원
          </p>
          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            accept="video/mp4,video/quicktime"
            @change="handleFileChange"
          />
        </div>

        <!-- Selected File Preview -->
        <div v-else class="bg-slate-50 border rounded-lg p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <FileVideo class="w-6 h-6" />
            </div>
            <div>
              <p class="font-medium text-sm line-clamp-1">{{ file.name }}</p>
              <p class="text-xs text-slate-500">{{ (file.size / 1024 / 1024).toFixed(1) }} MB</p>
            </div>
          </div>
          <button 
            @click="removeFile" 
            :disabled="isUploading"
            class="text-slate-400 hover:text-red-500 disabled:opacity-50"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Metadata Inputs -->
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">제목 <span class="text-red-500">*</span></label>
            <Input v-model="title" placeholder="영상 제목을 입력하세요" :disabled="isUploading" />
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-medium">설명</label>
            <Textarea v-model="description" placeholder="영상에 대한 설명을 입력하세요" :disabled="isUploading" />
          </div>

          <!-- Location (Place Search) -->
          <div class="space-y-2 relative">
            <label class="text-sm font-medium">장소 선택 <span class="text-red-500">*</span></label>
            
            <!-- Selected Place Display -->
            <div v-if="selectedPlace" class="flex items-center justify-between p-3 border rounded-md bg-blue-50 border-blue-200">
              <div class="flex flex-col">
                <span class="font-medium text-sm text-blue-900">{{ selectedPlace.placeName }}</span>
                <span class="text-xs text-blue-600">{{ selectedPlace.placeAddress }}</span>
              </div>
              <button @click="clearSelectedPlace" :disabled="isUploading" class="text-blue-400 hover:text-blue-600">
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Search Input -->
            <div v-else class="relative">
              <Input 
                v-model="placeSearchQuery" 
                placeholder="장소 검색 (예: 서울타워)" 
                :disabled="isUploading"
                @input="handlePlaceSearch"
              />
              <Loader2 v-if="isSearchingPlace" class="absolute right-3 top-2.5 w-4 h-4 animate-spin text-slate-400" />
              
              <!-- Search Results Dropdown -->
              <div 
                v-if="showPlaceResults && placeSearchResults.length > 0"
                class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                <button
                  v-for="place in placeSearchResults"
                  :key="place.placeId"
                  class="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm focus:outline-none focus:bg-slate-50 transition-colors"
                  @click="selectPlace(place)"
                >
                  <div class="font-medium text-slate-900">{{ place.placeName }}</div>
                  <div class="text-xs text-slate-500 truncate">{{ place.placeAddress }}</div>
                </button>
              </div>
              <div 
                v-else-if="showPlaceResults && placeSearchQuery.length > 1"
                class="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-4 text-center text-sm text-slate-500"
              >
                장소를 찾을 수 없습니다.
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div v-if="isUploading" class="space-y-2">
          <div class="flex justify-between text-xs font-medium text-slate-600">
            <span>
              <span v-if="uploadStep === 'preparing'">준비 중...</span>
              <span v-else-if="uploadStep === 'uploading'">업로드 중... {{ uploadProgress }}%</span>
              <span v-else-if="uploadStep === 'saving'">저장 중...</span>
              <span v-else-if="uploadStep === 'completed'" class="text-green-600">완료!</span>
            </span>
            <span>{{ uploadProgress }}%</span>
          </div>
          <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              class="h-full bg-blue-600 transition-all duration-300 ease-out"
              :style="{ width: `${uploadProgress}%` }"
            ></div>
          </div>
        </div>

        <!-- Upload Button -->
        <Button 
          class="w-full h-11 text-base"
          :disabled="!file || !title || !destinationId || isUploading"
          @click="handleUpload"
        >
          <Loader2 v-if="isUploading" class="w-4 h-4 mr-2 animate-spin" />
          {{ isUploading ? '업로드 중...' : '업로드 하기' }}
        </Button>

      </CardContent>
    </Card>
  </div>
</template>
