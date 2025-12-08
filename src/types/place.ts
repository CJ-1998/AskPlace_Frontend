export interface Place {
  id: number
  title: string
  location: string
  desc: string
  tags: string[]
  image: string
  lat?: number
  lng?: number
  live?: boolean
  category?: string
  operatingHours?: string
  admission?: string
  parking?: string
  phone?: string
  website?: string
  season?: string
}

export interface Location {
  lat: number
  lng: number
}

export interface Filter {
  location: string
  category?: string[]
  theme?: string[]
  season?: string[]
}

export interface ToastMessage {
  show: boolean
  message: string
  type?: 'success' | 'error' | 'info'
}
