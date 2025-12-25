import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { video } from '@/features/video/api/video'
import { useToast } from '@/shared/composables/useToast'
import axios from 'axios'

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime'] // MP4, MOV

export function useVideoUpload() {
  const router = useRouter()
  const { showToast } = useToast()

  // State
  const file = ref<File | null>(null)
  const title = ref('')
  const description = ref('')
  const destinationId = ref<string | undefined>(undefined)

  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const uploadStep = ref<'idle' | 'preparing' | 'uploading' | 'saving' | 'completed'>('idle')
  const isDragging = ref(false)

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      showToast('파일 크기는 500MB 이하여야 합니다.', 'error')
      return
    }

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      showToast('MP4 또는 MOV 형식만 지원합니다.', 'error')
      return
    }

    file.value = selectedFile

    // Auto-fill title if empty
    if (!title.value) {
      title.value = selectedFile.name.split('.').slice(0, -1).join('.')
    }
  }

  const removeFile = () => {
    file.value = null
    uploadProgress.value = 0
    uploadStep.value = 'idle'
  }

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      validateAndSetFile(target.files[0])
    }
  }

  // Drag & Drop
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = true
  }

  const handleDragLeave = () => {
    isDragging.value = false
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = false
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  // Helper: Generate Thumbnail from Video File
  const generateThumbnail = async (videoFile: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.muted = true
      video.crossOrigin = 'anonymous'
      video.playsInline = true

      const url = URL.createObjectURL(videoFile)
      video.src = url

      video.onloadeddata = () => {
        // Fallback if metadata load is weird? No, usually handled by metadata.
      }

      video.onloadedmetadata = () => {
        const duration = Number.isFinite(video.duration) ? video.duration : 10
        // Try to seek to 1.5s or 20% to skip intro fades
        video.currentTime = Math.min(duration - 0.5, Math.max(1.5, duration * 0.2))
      }

      video.onseeked = () => {
        // Small delay to ensure frame is decoded and ready for canvas
        setTimeout(() => {
          try {
            if (video.videoWidth === 0 || video.videoHeight === 0) {
              reject(new Error('Video dimensions are zero, cannot generate thumbnail'))
              URL.revokeObjectURL(url)
              return
            }

            const canvas = document.createElement('canvas')
            canvas.width = 640
            canvas.height = 360

            const ctx = canvas.getContext('2d')
            if (!ctx) throw new Error('Canvas context not supported')

            // Draw video to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

            canvas.toBlob((blob) => {
              if (blob) {
                const rectFile = new File([blob], `thumb_${videoFile.name.split('.')[0]}.jpg`, { type: 'image/jpeg' })
                resolve(rectFile)
              } else {
                reject(new Error('Thumbnail generation failed'))
              }
              URL.revokeObjectURL(url)
            }, 'image/jpeg', 0.8)
          } catch (e) {
            reject(e)
            URL.revokeObjectURL(url)
          }
        }, 300) // 300ms delay
      }

      video.onerror = () => {
        reject(new Error('Video load failed. Codec might not be supported.'))
        URL.revokeObjectURL(url)
      }
    })
  }

  // Upload Logic
  const uploadVideo = async () => {
    if (!file.value || !title.value || !destinationId.value) {
      showToast('모든 필수 정보를 입력해주세요.', 'error')
      return
    }

    try {
      isUploading.value = true
      uploadStep.value = 'preparing'

      // Step 0: Generate Thumbnail
      const thumbnailFile = await generateThumbnail(file.value)

      // Step 1: Get Pre-signed URLs for BOTH Video and Thumbnail
      const [videoUpload, thumbUpload] = await Promise.all([
        video.initUpload(file.value.name, file.value.type),
        video.initUpload(thumbnailFile.name, thumbnailFile.type)
      ])

      // Step 2: Upload to S3 (Parallel)
      uploadStep.value = 'uploading'

      const uploadPromises = [
        axios.put(videoUpload.uploadUrl, file.value, {
          headers: { 'Content-Type': file.value.type },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              // Approximate 80% weight to video
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              uploadProgress.value = Math.round(percent * 0.9)
            }
          }
        }),
        axios.put(thumbUpload.uploadUrl, thumbnailFile, {
          headers: { 'Content-Type': thumbnailFile.type }
        })
      ]

      await Promise.all(uploadPromises)
      uploadProgress.value = 100

      // Step 3: Save Metadata with Thumbnail Key
      uploadStep.value = 'saving'
      await video.saveVideo({
        title: title.value,
        description: description.value,
        objectKey: videoUpload.fileName,
        thumbnailObjectKey: thumbUpload.fileName, // Pass thumb key
        placeId: destinationId.value?.toString() || '',
        duration: 0
      })

      uploadStep.value = 'completed'
      showToast('업로드가 완료되었습니다!', 'success')

      setTimeout(() => {
        router.push('/videos')
      }, 1500)

    } catch (error) {
      console.error(error)
      showToast('업로드 중 오류가 발생했습니다.', 'error')
      isUploading.value = false
      uploadStep.value = 'idle'
    }
  }

  return {
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
    uploadVideo
  }
}
