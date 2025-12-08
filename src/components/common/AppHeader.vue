<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { useAppStore } from '@/stores'
import { User, LogOut } from 'lucide-vue-next'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const route = useRoute()
const modalStore = useModalStore()
const store = useAppStore()

const isActive = (path: string) => {
  return route.path.includes(path)
}

const openAuthModal = (mode: 'login' | 'regist') => {
  modalStore.openAuth(mode)
}

const userInitial = computed(() => {
  return store.currentUser ? store.currentUser.charAt(0).toUpperCase() : '?'
})
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 cursor-pointer">
        <i class="fa-solid fa-plane-departure text-primary text-2xl"></i>
        <img src="@/assets/askPlace.png" alt="Logo" class="w-5 h-5" />
        <span class="text-xl font-bold text-indigo-950">AskPlace</span>
      </router-link>

      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <router-link 
          to="/search" 
          :class="{ 'text-primary': isActive('search') }"
          class="hover:text-primary transition-colors"
        >
          여행지 찾기
        </router-link>
        <router-link 
          to="/plan" 
          :class="{ 'text-primary': isActive('plan') }"
          class="hover:text-primary transition-colors"
        >
          여행 계획
        </router-link>
        <router-link 
          to="/video" 
          :class="{ 'text-primary': isActive('video') }"
          class="hover:text-primary transition-colors"
        >
          실시간 영상
        </router-link>
      </nav>

      <div class="flex items-center gap-3">
        <template v-if="!store.isLoggedIn">
          <button 
            @click="openAuthModal('login')" 
            class="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            로그인
          </button>
          <button 
            @click="openAuthModal('regist')" 
            class="bg-primary text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm hover:bg-indigo-600"
          >
            회원가입
          </button>
        </template>
        <DropdownMenu v-else>
          <DropdownMenuTrigger as-child>
            <div class="flex items-center gap-2 cursor-pointer outline-none">
              <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold text-xs">
                {{ userInitial }}
              </div>
              <span class="text-sm font-medium hidden sm:block">{{ store.currentUser }}</span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" class="w-56">
            <DropdownMenuLabel>내 계정</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem class="cursor-pointer">
              <User class="mr-2 h-4 w-4" />
              <span>내 정보</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem @click="store.logout" class="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut class="mr-2 h-4 w-4" />
              <span>로그아웃</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>