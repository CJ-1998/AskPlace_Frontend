import { ref, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePlace } from './usePlace'

export const usePlaceSearch = () => {
    const router = useRouter()
    const route = useRoute()
    const { 
        places, 
        fetchPlaces, 
        resetPlace, 
        isLoading, 
        error, 
        currentPage,
        totalPages,
        regions,
        fetchRegions
    } = usePlace()

    // 초기 데이터 로드 (Lifecycle Hook)
    onMounted(() => {
        fetchRegions()
    })

    // 상태 관리 (ViewModel State)
    const searchText = ref(route.query.q as string || '')
    
    // 필터 데이터 (locations 대신 regions 사용)
    // const locations = ['전체', '서울', '부산', '제주', '강원', '경주']
    
    // 현재 선택된 지역 (URL Query 기반)
    const currentRegion = computed(() => (route.query.region as string) || '전체')

    // 검색 결과 (더 이상 computed 아니지만 호환 유지)
    // const filteredPlaces = computed(() => places.value)

    // UI Actions
    const onSearch = () => {
        router.push({
            name: 'place-list',
            query: { ...route.query, q: searchText.value }
        })
    }

    const onSelectRegion = (regionCode?: string) => {
        const query = { ...route.query }
        if (!regionCode || regionCode === 'ALL') {
            delete query.region
        } else {
            query.region = regionCode
        }
        
        router.push({ name: 'place-list', query })
    }

    const goToDetail = (id: string) => {
        resetPlace()
        router.push({ name: 'place-detail', params: { id } })
    }

    const loadMore = () => {
        if (currentPage.value + 1 < totalPages.value) {
            fetchPlaces(searchText.value, currentRegion.value, currentPage.value + 1, true)
        }
    }

    // URL Sync Logic (Watcher)
    // 쿼리 파라미터가 변경되면 즉시 API 호출 (검색어가 없으면 usePlace 내부에서 전체 목록 호출됨)
    watch(
        [() => route.query.q, () => route.query.region],
        ([newKeyword, newRegion]) => {
            const keyword = (newKeyword as string) || ''
            const region = (newRegion as string) || ''
            
            searchText.value = keyword
            // 새 검색이므로 page=0, isLoadMore=false
            fetchPlaces(keyword, region, 0, false) 
        },
        { immediate: true }
    )

    return {
        // State
        searchText,
        regions,
        currentRegion,
        places,
        isLoading,
        error,
        currentPage,
        totalPages,

        // Actions
        fetchRegions,
        onSearch,
        onSelectRegion,
        goToDetail,
        loadMore
    }
}
