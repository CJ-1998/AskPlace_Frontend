import type { Place } from '@/features/place/types/place'

export const MOCK_PLACES: Place[] = [
  {
    placeId: '1',
    placeName: '경복궁',
    placeAddress: '161 사직로, 종로구, 서울',
    placeDetailAddress: 'Main Gate',
    latitude: 37.579617,
    longitude: 126.977041,
    placePhoneNumber: '02-3700-3900',
    placeImageUrl: 'https://images.unsplash.com/photo-1638964663550-e2123ac8900b?q=80&w=1000&auto=format&fit=crop',
    placeThumbnailImageUrl: 'https://images.unsplash.com/photo-1638964663550-e2123ac8900b?q=80&w=200&auto=format&fit=crop',
    contentId: '1001',
    contentTypeId: '12',
    region: '서울',
    siGunGu: '종로구',
    placeDescription: 'The main royal palace of the Joseon dynasty.'
  },
  {
    placeId: '2',
    placeName: 'N 서울 타워',
    placeAddress: '105 남산공원, 용산구, 서울',
    placeDetailAddress: 'Observation Deck',
    latitude: 37.551169,
    longitude: 126.988227,
    placePhoneNumber: '02-3455-9277',
    placeImageUrl: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=1000&auto=format&fit=crop',
    placeThumbnailImageUrl: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=200&auto=format&fit=crop',
    contentId: '1002',
    contentTypeId: '12',
    region: '서울',
    siGunGu: '용산구',
    placeDescription: 'A communication and observation tower located on Namsan Mountain.'
  }
]
