<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Input } from '@ui/input'
import { uploadService, type UploadResult } from '@/features/video/api/uploadService'
import { useToast } from '@/shared/composables/useToast'
import { UploadCloud, Clock, CheckCircle, AlertCircle } from 'lucide-vue-next'

const { showToast } = useToast()

const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const results = ref<UploadResult[]>([])

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  }
}

const handleUpload = async (method: 'PRESIGNED' | 'MULTIPART' | 'STREAM') => {
  if (!selectedFile.value) {
    showToast('파일을 선택해주세요.', 'error')
    return
  }

  isUploading.value = true
  try {
    let result: UploadResult
    switch (method) {
      case 'PRESIGNED':
        result = await uploadService.uploadByPresignedUrl(selectedFile.value)
        break
      case 'MULTIPART':
        result = await uploadService.uploadByMultipart(selectedFile.value)
        break
      case 'STREAM':
        result = await uploadService.uploadByStream(selectedFile.value)
        break
    }
    
    results.value.unshift(result)
    showToast(`${method} 업로드 성공! (${result.duration.toFixed(0)}ms)`, 'success')
  } catch (error) {
    console.error(error)
    showToast(`${method} 업로드 실패`, 'error')
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <Card class="w-full max-w-2xl mx-auto">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <UploadCloud class="w-6 h-6" />
        S3 Upload Performance Test
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      
      <!-- File Input -->
      <div class="space-y-2">
        <label class="text-sm font-medium">Test File (Video/Image)</label>
        <Input type="file" @change="handleFileChange" accept="video/*,image/*" />
        <p class="text-xs text-slate-500" v-if="selectedFile">
          Selected: {{ selectedFile.name }} ({{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB)
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Button 
          variant="outline" 
          @click="handleUpload('PRESIGNED')" 
          :disabled="!selectedFile || isUploading"
        >
          1. Pre-signed URL
        </Button>
        <Button 
          variant="outline" 
          @click="handleUpload('MULTIPART')"
          :disabled="!selectedFile || isUploading"
        >
          2. Server Multipart
        </Button>
        <Button 
          @click="handleUpload('STREAM')"
          :disabled="!selectedFile || isUploading"
          class="bg-blue-600 hover:bg-blue-700 text-white"
        >
          3. Server Stream (Recommended)
        </Button>
      </div>

      <!-- Results Table -->
      <div v-if="results.length > 0" class="border rounded-lg overflow-hidden">
        <div class="bg-slate-50 px-4 py-2 text-sm font-medium border-b">Test Results</div>
        <div class="divide-y max-h-60 overflow-y-auto">
          <div v-for="(res, idx) in results" :key="idx" class="px-4 py-3 text-sm flex justify-between items-center">
            <div class="flex items-center gap-3">
              <CheckCircle class="w-4 h-4 text-green-500" />
              <span class="font-semibold w-24">{{ res.method }}</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center text-slate-600">
                <Clock class="w-3 h-3 mr-1" />
                {{ res.duration.toFixed(0) }}ms
              </div>
              <a :href="res.fileUrl" target="_blank" class="text-blue-500 hover:underline text-xs truncate max-w-[150px]">
                Link
              </a>
            </div>
          </div>
        </div>
      </div>

    </CardContent>
  </Card>
</template>
