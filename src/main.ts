import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import '@/assets/styles/style.css'
import { useAppStore } from '@/stores'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const appStore = useAppStore()
appStore.restoreSession().finally(() => {
  app.mount('#app')
})