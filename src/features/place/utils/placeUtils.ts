const placeTypeMap = new Map<string, string>([
    // 국문 콘텐츠타입 코드표 참조(https://www.data.go.kr/data/15101578/openapi.do)
    ['12', '관광지'],
    ['14', '문화시설'],
    ['15', '축제공연'],
    ['25', '여행코스'],
    ['28', '레포츠'],
    ['32', '숙박'],
    ['38', '쇼핑'],
    ['39', '음식점']
]);

export const getPlaceTypeLabel = (typeId: string): string => {
    return placeTypeMap.get(typeId) || '기타';
}