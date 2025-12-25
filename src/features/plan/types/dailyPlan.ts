/**
 * @file dailyPlan.ts
 * @description 여행 일자별 상세 타임라인을 위한 프론트엔드 전용 데이터 구조입니다.
 * @author Senior Data Architect Integration
 */

/**
 * 지리적 좌표 인터페이스
 * Google Maps / Naver Maps 등 지도 라이브러리와 호환성을 고려하여 설계.
 */
export interface GeoLocation {
    lat: number;
    lng: number;
}

/**
 * 이동 수단 타입 정의
 * - WALK: 도보
 * - CAR: 차량
 * - PUBLIC: 대중교통 (확장성을 위해 포함)
 */
export type TransportMode = 'WALK' | 'CAR' | 'PUBLIC';

/**
 * **TransportInfo (Edge)**
 * 
 * 현재 장소(Node)에서 다음 장소(Next Node)로 이동하는 경로에 대한 메타데이터입니다.
 * 리스트 렌더링 시, 현재 Spot 아이템의 하단 또는 우측에 연결선으로 표현됩니다.
 */
export interface TransportInfo {
    /** 이동 수단 (UI 아이콘 분기용) */
    mode: TransportMode;

    /** 예상 소요 시간 (분 단위) */
    durationMinutes: number;

    /** 이동 거리 (km 단위). UI 표기를 위해 미터가 아닌 킬로미터 사용 권장 */
    distanceKm: number;

    /** (Optional) 이동 비용 (택시비, 통행료 등 예상치) */
    cost?: number;
}

/**
 * **DailySpot (Node)**
 * 
 * 타임라인을 구성하는 개별 장소 단위입니다.
 * UI 렌더링의 핵심이 되는 객체로, 메타데이터와 연결(Connectivity) 정보를 모두 포함합니다.
 */
export interface DailySpot {
    /** 프론트엔드 리스트 키 관리를 위한 고유 ID */
    uid: string;

    /** 실제 장소의 DB ID (API 요청용) */
    placeId: string;

    /** 표시 순서 (0-indexed or 1-indexed) */
    order: number;

    // --- 1. Basic Display Info ---
    name: string;
    category: string; // e.g., '관광지', '음식점', '카페'
    description?: string; // (Optional) 한 줄 요약
    thumbnailUrl?: string; // (Optional) 이미지가 없을 경우 대비
    address?: string; // 장소 상세 주소

    // --- 2. Spot Metadata (UI Logic) ---
    location: GeoLocation;

    /** (Optional) 입장료 (장소 정보 기반) */
    admissionFee?: number;

    /** (Optional) 사용자 설정 예산 (여행 계획 시 입력) */
    budget?: number; // User-planned budget

    /** (Optional) 주차 가능 여부. 아이콘 활성화 플래그로 사용. */
    hasParking?: boolean;

    /** 권장 체류 시간 (분 단위) */
    stayDurationMinutes: number;

    /** 예상 도착 시간 (HH:mm 포맷). 이전 장소의 출발 시간 + 이동 시간을 누적 계산. */
    arrivalTime?: string;

    // --- 3. Special Flags ---
    /** 
     * '실시간 라이브 영상' 버튼 활성화 여부
     * true일 경우 CCTV 모달 트리거 버튼이 렌더링됨.
     */
    isLiveVideoAvailable: boolean;

    // --- 4. Connectivity ---
    /** 
     * 다음 장소로의 이동 정보.
     * 배열의 마지막 요소(Last Spot)는 이 필드가 undefined여야 합니다.
     */
    nextTransport?: TransportInfo;
}

/**
 * **DailyStats (Aggregation)**
 * 
 * 해당 일자(Day)의 전체 요약 통계입니다.
 * 헤더(Header) 영역에 요약 정보를 보여주기 위해 사용됩니다.
 */
export interface DailyStats {
    totalSpots: number;
    totalDistanceKm: number;      // 총 이동 거리
    totalDurationMinutes: number; // 총 소요 시간 (이동 + 체류)
    totalCost: number;            // 총 예산 (입장료 + 이동비 + 기타)
}

/**
 * **DailyPlanDetail (Root Aggregate)**
 * 
 * 일자별 페이지(Daily View)의 최상위 데이터 컨테이너입니다.
 */
export interface DailyPlanDetail {
    /** 일자 계획 고유 ID */
    dailyPlanId: string;

    /** N일차 (1, 2, 3...) */
    dayNumber: number;

    /** 실제 날짜 (YYYY-MM-DD) */
    date: string;

    /** (Optional) "제주 동부 감성 투어" 같은 일자별 테마/제목 */
    themeTitle?: string;

    /** 이 날의 요약 통계 */
    stats: DailyStats;

    /** 
     * 방문 장소 리스트 (순서대로 정렬됨).
     * 렌더링 편의성을 위해 Linked List가 아닌 Ordered Array 형식을 채택.
     */
    spots: DailySpot[];
}
