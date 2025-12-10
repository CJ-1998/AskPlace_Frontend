import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/app/App.vue'
import router from '@/app/router'
import '@/assets/styles/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

import { useAuthStore } from '@/features/auth/stores/authStore'

const authStore = useAuthStore()

// 앱 초기화: 세션 복구 대기
await authStore.restoreSession()

app.mount('#app')