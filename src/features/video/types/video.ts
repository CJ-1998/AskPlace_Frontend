export interface VideoResponse {
  id: string;
  objectKey: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  duration: number; // seconds
  viewCount: number;
  placeId: string;
  placeName?: string;
  createdAt: string;
  preSignedUrl: string;
  thumbnailUrl?: string; // Optional because legacy videos might not have it
}

export type Video = VideoResponse;

export interface VideoPageResponse {
  content: VideoResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  number: number;
  size: number;
  numberOfElements: number;
  empty: boolean;
}
