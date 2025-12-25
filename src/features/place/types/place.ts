export interface PlaceBase {
  placeId: string
  placeName: string
  placeAddress: string
  latitude: number
  longitude: number
  placeImageUrl?: string
  contentId: string
}

export interface PlaceSummary extends PlaceBase {
  placeRegion: string
  placeSiGunGu: string
  placeThumbnailImageUrl?: string
  contentTypeId?: string
  placeDetailAddress?: string
  placeDescription?: string
}

export interface PlaceDetail extends PlaceBase {
  placeDetailAddress?: string
  placePhoneNumber?: string
  contentTypeId?: string // Detail only, but optional as Backend DTO excludes it
  region: string       // Detail uses 'region'
  siGunGu: string      // Detail uses 'siGunGu'
  placeDescription?: string

  // Plan Edit Fields
  startTime?: string // HH:mm
  endTime?: string   // HH:mm
  durationMinutes?: number
  budget?: number
  memo?: string
  placeThumbnailImageUrl?: string
  isWishlistPlaceholder?: boolean
}

// Re-export Place as PlaceDetail for backward compatibility in Detail views,
// but components using List data must migrate to PlaceSummary.
export type Place = PlaceDetail

export interface PlaceSearchParams {
  keyword?: string
  region?: string
  sigungu?: string
  contentTypeId?: string
}

export interface Region {
  code: string
  label: string
}

// Backend Response DTOs
export interface PlaceListSearchResponseDto {
  placeSearchResponseDtoList: PlaceSummary[]
  placeCount: number
  totalCount: number
  totalPages: number
  currentPage: number
}

export interface PlaceDetailResponseDto extends PlaceDetail {
  // If backend adds more fields later, add them here
}