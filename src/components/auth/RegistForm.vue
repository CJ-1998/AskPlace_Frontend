<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { RegistRequest } from '@/types/auth'

const emit = defineEmits<{
  (e: 'regist', data: RegistRequest ): void
}>()

const form = ref({
  email: '',
  password: '',
  passwordConfirm: '',
  name: ''
})

const errors = ref({
  email: '',
  password: '',
  passwordConfirm: '',
  name: ''
})

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validatePassword = (password: string) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return re.test(password)
}

const handleSubmit = () => {
  let isValid = true
  errors.value = { email: '', password: '', passwordConfirm: '', name: '' }

  if (!form.value.email) {
    errors.value.email = '이메일을 입력해주세요.'
    isValid = false
  } else if (!validateEmail(form.value.email)) {
    errors.value.email = '유효한 이메일 형식이 아닙니다.'
    isValid = false
  }

  if (!form.value.name) {
    errors.value.name = '이름을 입력해주세요.'
    isValid = false
  }

  if (!form.value.password) {
    errors.value.password = '비밀번호를 입력해주세요.'
    isValid = false
  } else if (validatePassword(form.value.password) === false) {
    errors.value.password = '8~36자, 대/소문자, 숫자, 특수문자(@$!%*?&)를 포함해야 합니다.'
    isValid = false
  }

  if (form.value.password !== form.value.passwordConfirm) {
    errors.value.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    isValid = false
  }

  if (isValid) {
    emit('regist', form.value)
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <Input v-model="form.name" placeholder="이름" />
      <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
    </div>
    <div class="space-y-2">
      <Input v-model="form.email" type="email" placeholder="이메일" />
      <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
    </div>
    <div class="space-y-2">
      <Input v-model="form.password" type="password" placeholder="비밀번호 (8자 이상)" />
      <p v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</p>
    </div>
    <div class="space-y-2">
      <Input v-model="form.passwordConfirm" type="password" placeholder="비밀번호 확인" />
      <p v-if="errors.passwordConfirm" class="text-xs text-red-500">{{ errors.passwordConfirm }}</p>
    </div>
    <Button @click="handleSubmit" class="w-full py-6 font-bold shadow-md">
      회원가입
    </Button>
  </div>
</template>
