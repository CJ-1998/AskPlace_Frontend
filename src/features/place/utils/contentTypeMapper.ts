export const contentTypeMap: Record<string, string> = {
  '12': '관광지',
  '14': '문화시설',
  '15': '축제/공연/행사',
  '25': '여행코스',
  '28': '레포츠',
  '32': '숙박',
  '38': '쇼핑',
  '39': '음식점'
}

export const getContentTypeLabel = (id?: string): string => {
  if (!id) return '기타'
  return contentTypeMap[id] || '기타'
}

export const getContentTypeColor = (id?: string): string => {
  switch (id) {
    case '12': return 'text-green-600 bg-green-50 border-green-200' // 관광지
    case '14': return 'text-purple-600 bg-purple-50 border-purple-200' // 문화시설
    case '15': return 'text-pink-600 bg-pink-50 border-pink-200' // 축제
    case '25': return 'text-indigo-600 bg-indigo-50 border-indigo-200' // 여행코스
    case '28': return 'text-blue-600 bg-blue-50 border-blue-200' // 레포츠
    case '32': return 'text-amber-600 bg-amber-50 border-amber-200' // 숙박
    case '38': return 'text-cyan-600 bg-cyan-50 border-cyan-200' // 쇼핑
    case '39': return 'text-orange-600 bg-orange-50 border-orange-200' // 음식점
    default: return 'text-slate-600 bg-slate-50 border-slate-200'
  }
}
