export interface Place {
  placeId: string
  placeName: string
  placeAddress: string
  placeDetailAddress?: string
  latitude: number
  longitude: number
  placePhoneNumber?: string
  placeImageUrl?: string
  placeThumbnailImageUrl?: string
  contentId: string
  contentTypeId: string
  region: string
  siGunGu: string
  placeDescription?: string
}

export interface PlaceSearchParams {
  keyword?: string
  region?: string
  sigungu?: string
  contentTypeId?: string
}
