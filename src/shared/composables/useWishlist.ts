import { ref, watch, onMounted } from 'vue'

export interface WishPlace {
  placeId: number | string
  placeName: string
  category: string
  address: string
  thumbnailUrl?: string
}

const WISHLIST_KEY = 'askplace_wishlist'

export function useWishlist() {
  const savedPlaces = ref<WishPlace[]>([])

  // 초기화: LocalStorage에서 로드
  const loadWishlist = () => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY)
      if (stored) {
        savedPlaces.value = JSON.parse(stored)
      }
    } catch (e) {
      console.warn('Failed to load wishlist from localStorage', e)
    }
  }

  // 저장: LocalStorage에 쓰기
  const persistWishlist = () => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(savedPlaces.value))
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage', e)
    }
  }

  // Action: 추가
  const addToWishlist = (place: WishPlace) => {
    if (!isInWishlist(place.placeId)) {
      savedPlaces.value.push(place)
    }
  }

  // Action: 제거
  const removeFromWishlist = (placeId: number | string) => {
    savedPlaces.value = savedPlaces.value.filter(p => p.placeId !== placeId)
  }

  // Action: 토글
  const toggleWishlist = (place: WishPlace) => {
    if (isInWishlist(place.placeId)) {
      removeFromWishlist(place.placeId)
    } else {
      addToWishlist(place)
    }
  }

  // Helper: 존재 여부 확인
  const isInWishlist = (placeId: number | string): boolean => {
    return savedPlaces.value.some(p => p.placeId === placeId)
  }

  // Watch: 변경 시 자동 저장
  watch(savedPlaces, () => {
    persistWishlist()
  }, { deep: true })

  // Lifecycle: 마운트 시 로드
  onMounted(() => {
    loadWishlist()
  })

  return {
    savedPlaces,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist
  }
}
