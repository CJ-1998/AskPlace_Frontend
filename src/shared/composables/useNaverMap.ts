import { shallowRef } from 'vue'

export interface MapMarkerConfig {
  id: string | number
  lat: number
  lng: number
  title: string
  description?: string
  order?: number
}

export const useNaverMap = () => {
  const mapInstance = shallowRef<any>(null)

  // 1. Initialize Map
  const initMap = (container: HTMLElement, options: any) => {
    if (!window.naver) {
      console.error('Naver Map script not loaded')
      return
    }
    const defaultOptions = {
      center: new window.naver.maps.LatLng(37.5665, 126.9780),
      zoom: 14,
      ...options
    }
    mapInstance.value = new window.naver.maps.Map(container, defaultOptions)
  }

  // 2. Add Marker (Pure Wrapper)
  // options: naver.maps.MarkerOptions
  const addMarker = (options: any) => {
    if (!mapInstance.value || !window.naver) return null

    const marker = new window.naver.maps.Marker({
      map: mapInstance.value,
      ...options
    })
    return marker
  }

  // 3. Add Polyline (Pure Wrapper)
  // options: naver.maps.PolylineOptions
  const addPolyline = (options: any) => {
    if (!mapInstance.value || !window.naver) return null

    const polyline = new window.naver.maps.Polyline({
      map: mapInstance.value,
      ...options
    })
    return polyline
  }

  // 4. Fit Bounds
  // latLngs: { lat: number, lng: number }[]
  const fitBounds = (latLngs: { lat: number; lng: number }[], margin = 50) => {
    if (!mapInstance.value || !window.naver || latLngs.length === 0) return

    const bounds = new window.naver.maps.LatLngBounds()
    latLngs.forEach(p => {
      bounds.extend(new window.naver.maps.LatLng(p.lat, p.lng))
    })

    mapInstance.value.fitBounds(bounds, {
      top: margin, bottom: margin, left: margin, right: margin
    })
  }

  // 5. Utility: Create LatLng
  const createLatLng = (lat: number, lng: number) => {
    if (!window.naver) return null
    return new window.naver.maps.LatLng(lat, lng)
  }

  // 6. Create InfoWindow
  const createInfoWindow = (content: string) => {
    if (!window.naver) return null
    return new window.naver.maps.InfoWindow({
      content: content,
      backgroundColor: "transparent",
      borderColor: "transparent",
      borderWidth: 0,
      disableAnchor: false,
      pixelOffset: new window.naver.maps.Point(0, -10)
    })
  }

  // 7. Add Listener
  const addListener = (target: any, event: string, handler: (e: any) => void) => {
    if (!window.naver) return null
    return window.naver.maps.Event.addListener(target, event, handler)
  }

  return {
    mapInstance,
    initMap,
    addMarker,
    addPolyline,
    fitBounds,
    createLatLng,
    createInfoWindow,
    addListener
  }
}