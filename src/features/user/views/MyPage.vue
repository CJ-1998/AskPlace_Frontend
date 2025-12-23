<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMyPage } from '@/features/user/composables/useMyPage'
import UserProfileSidebar from '@/features/user/components/UserProfileSidebar.vue'
import UserActivitySection from '@/features/user/components/UserActivitySection.vue'

const {
  isLoading,
  isEditing,
  activeTab,
  profile,
  editForm,
  activity,
  isLoggedIn,
  fetchUserData,
  startEdit,
  cancelEdit,
  saveProfile,
  withdrawUser,
  logout
} = useMyPage()

const router = useRouter()

// TODO : 원래대로면 내비게이션 가드에서 처리하지만
// 유저의 정보를 불러오는 행위가 필요하기 때문에
// onMount때 재처리하도록 함(비효율적)
onMounted(() => {
  if (!isLoggedIn.value) {
    router.push({ name: 'home' })
    return
  }
  fetchUserData()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">마이페이지</h1>
      <p class="text-slate-500">내 정보와 여행 기록을 관리하세요.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <UserProfileSidebar 
        :profile="profile"
        :activity="activity"
        :is-editing="isEditing"
        v-model:edit-form="editForm"
        @start-edit="startEdit"
        @cancel-edit="cancelEdit"
        @save-profile="saveProfile"
        @withdraw="withdrawUser"
        @logout="logout"
      />

      <UserActivitySection 
        v-model:active-tab="activeTab"
        :activity="activity"
        :is-loading="isLoading"
      />
    </div>
  </div>
</template>