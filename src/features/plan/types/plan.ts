import type { VideoResponse } from '@/features/video/types/video'

export interface TravelPlanResponseDto {
  travelPlanId: string;
  travelPlanTitle: string;
  travelPlanDescription: string;
  user: {
    uuid: string;
    name: string;
  };
  travelTotalDays: number;
  representativeImage?: string;
}

export interface TravelPlanListResponseDto {
  travelPlans: TravelPlanResponseDto[];
  travelPlanCount: number;
}

export interface PlacePlanResponseDto {
  placePlanOrder: number;
  placeId: string;
  placeContentId: string;
  placeName: string;
  placeAddress: string;
  placeDescription: string;
  placeLatitude: number;
  placeLongitude: number;
  placePlanStartTime: string; // HH:mm
  placePlanEndTime: string;   // HH:mm
  placePlanBudget: number;
  region?: string;
  siGunGu?: string;
  contentTypeId?: string;
  placeImageUrl?: string;
  placeThumbnailImageUrl?: string;
  hasLiveVideo?: boolean;
  latestVideo?: VideoResponse;
}

export interface DailyPlanResponseDto {
  dailyPlanId: string;
  dailyPlanTitle: string;
  dailyPlanDescription: string;
  dailyPlanDate: string; // yyyy-MM-dd
  dailyPlanPlaceCount: number;
  dailyPlanTotalMinutes: number;
  dailyPlanTotalDistance: number;
  dailyPlanBudget: number;
}

export interface DailyPlanDetailResponseDto {
  dailyPlan: DailyPlanResponseDto;
  placePlanResponseDtoList: PlacePlanResponseDto[];
}

export interface TravelPlanDetailResponseDto {
  travelPlanId: string;
  travelPlanTitle: string;
  travelPlanDescription: string;
  user: {
    uuid: string;
    name: string;
  };
  travelPlanStartDate: string;
  travelPlanEndDate: string;
  travelPlanPlaceCount: number;
  travelPlanTotalDays: number;
  travelPlanTotalMinutes: number;
  travelPlanTotalDistance: number;
  travelPlanBudget: number;
  dailyPlanResponseDtoList: DailyPlanResponseDto[];
}

// --- Request DTOs ---

export interface PlacePlanRequestDto {
  placeId: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  budget: number;
}

export interface DailyPlanRequestDto {
  title: string;
  description: string;
  date: string; // yyyy-MM-dd
  placePlanRequestDtoList: PlacePlanRequestDto[];
}

export interface TravelPlanRequestDto {
  title: string;
  description: string;
  startDate: string; // yyyy-MM-dd
  endDate: string;   // yyyy-MM-dd
  dailyPlanRequestDtoList: DailyPlanRequestDto[];
}

// --- Domain Models (Frontend Component Types) ---
export interface PlaceDetail {
  placeDetailId: string;
  order: number;
  placeName: string;
  latitude: number;
  longitude: number;
  contentTypeId?: string;
  placeAddress?: string;
  placeImageUrl?: string;

  // Planning Fields
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  budget?: number;
  memo?: string;
  description?: string;
  thumbnailUrl?: string;
  hasLiveVideo?: boolean;
  latestVideo?: VideoResponse;
}

export interface DailyPlan {
  dailyPlanId: string;
  dayNumber: number;
  date: string;
  color?: string;
  placeDetails: PlaceDetail[];
}



// ... Domain Models ...
export interface TravelPlan {
  id: string;
  user: {
    uuid: string;
    name: string;
  };
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  duration: string;
  totalTimeMinutes?: number;
  totalDistance?: number;
  budget?: number;
  dailyPlans?: DailyPlan[];

  // UI Specific Fields (Mocked/Calculated)
  coverImage?: string;
  views?: number;
  likes?: number;
  profileImage?: string;
}

export type Plan = TravelPlan;

