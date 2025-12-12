<script setup lang="ts">
import { computed } from 'vue'
import type { UserProfile, UserActivity } from '@/features/user/types/user'
import { Button } from '@/shared/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { Input } from '@/shared/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/shared/components/ui/dialog'
import { Edit2, LogOut, Save, X, Trash2, Lock } from 'lucide-vue-next'

interface Props {
  profile: UserProfile
  editForm: Partial<UserProfile>
  activity: UserActivity
  isEditing: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:editForm', value: Partial<UserProfile>): void
  (e: 'start-edit'): void
  (e: 'cancel-edit'): void
  (e: 'save-profile'): void
  (e: 'logout'): void
  (e: 'withdraw'): void
}>()

// Proxy needed for v-model on prop object field (Vue pattern)
const localEditForm = computed({
  get: () => props.editForm,
  set: (val) => emit('update:editForm', val)
})
</script>

<template>
  <aside class="lg:col-span-1 space-y-6">
    <Card>
      <CardHeader class="text-center pb-2">
        <div class="flex justify-center mb-4 relative">
          <Avatar class="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage v-if="profile.profileImage" :src="profile.profileImage" :alt="profile.name" />
            <AvatarFallback class="text-2xl">{{ profile.name ? profile.name.charAt(0).toUpperCase() : 'U' }}</AvatarFallback>
          </Avatar>
        </div>
        
        <template v-if="!isEditing">
          <CardTitle class="text-xl mb-1">{{ profile.name }}</CardTitle>
          <CardDescription>{{ profile.email }}</CardDescription>
        </template>
        <template v-else>
           <div class="space-y-3 text-left">
              <div>
                <label class="text-xs font-medium text-slate-500 ml-1">이름</label>
                <div class="relative">
                  <Input :model-value="localEditForm.name" class="h-8 text-sm pr-8" disabled />
                  <Lock class="w-3 h-3 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>
           </div>
        </template>
      </CardHeader>
      
      <CardContent>
        <div class="space-y-4">
          <div v-if="!isEditing" class="text-sm text-slate-600 bg-slate-50 p-3 rounded-md min-h-[60px]">
            {{ profile.introduction || '자기소개를 입력해주세요.' }}
          </div>
           <div v-else>
             <label class="text-xs font-medium text-slate-500 ml-1">자기소개 (255자 이내)</label>
             <textarea 
                v-model="localEditForm.introduction"
                maxlength="255"
                class="w-full flex min-h-[80px] rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              ></textarea>
           </div>

          <Separator />
          
          <div class="pt-2 flex flex-col gap-2">
            <template v-if="!isEditing">
              <Button variant="outline" class="w-full" @click="emit('start-edit')">
                <Edit2 class="w-4 h-4 mr-2" /> 프로필 수정
              </Button>
            </template>
            <template v-else>
              <div class="flex gap-2">
                <Button class="flex-1" @click="emit('save-profile')">
                  <Save class="w-4 h-4 mr-2" /> 저장
                </Button>
                <Button variant="ghost" class="px-3" @click="emit('cancel-edit')">
                  <X class="w-4 h-4" />
                </Button>
              </div>
            </template>

            <Button variant="ghost" class="w-full text-slate-600 hover:text-slate-900 hover:bg-slate-100" @click="emit('logout')">
              <LogOut class="w-4 h-4 mr-2" /> 로그아웃
            </Button>

            <Separator class="my-2" />

            <!-- Withdrawal Dialog -->
            <Dialog>
              <DialogTrigger as-child>
                <Button variant="ghost" class="w-full text-red-500 hover:text-red-600 hover:bg-red-50 text-xs">
                  <Trash2 class="w-3 h-3 mr-2" /> 회원 탈퇴
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>정말 탈퇴하시겠습니까?</DialogTitle>
                  <DialogDescription>
                    탈퇴 시 계정은 즉시 영구 삭제됩니다.<br/>
                    이 작업은 되돌릴 수 없습니다.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose as-child>
                    <Button variant="outline">취소</Button>
                  </DialogClose>
                  <Button variant="destructive" @click="emit('withdraw')">탈퇴하기</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Stats -->
    <Card>
      <CardContent class="p-4 grid grid-cols-3 gap-2 text-center divide-x">
        <div>
          <div class="text-xl font-bold text-primary">{{ activity.myPlans.length }}</div>
          <div class="text-xs text-slate-500">Plans</div>
        </div>
         <div>
          <div class="text-xl font-bold text-primary">{{ activity.likedPlaces.length }}</div>
          <div class="text-xs text-slate-500">Places</div>
        </div>
         <div>
          <div class="text-xl font-bold text-primary">{{ activity.myVideos.length }}</div>
          <div class="text-xs text-slate-500">Videos</div>
        </div>
      </CardContent>
    </Card>
  </aside>
</template>
