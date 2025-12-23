<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { Button } from '@ui/button'

interface Props {
  title?: string
  backLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  backLabel: '목록으로'
})

const router = useRouter()
</script>

<template>
  <div class="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="flex-1 flex justify-start">
      <Button 
        variant="ghost" 
        size="sm" 
        class="gap-1 pl-2 pr-4 text-muted-foreground hover:text-foreground"
        @click="router.back()"
      >
        <ArrowLeft class="h-4 w-4" />
        <span>{{ backLabel }}</span>
      </Button>
    </div>
    
    <div v-if="title" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-foreground text-sm">
      {{ title }}
    </div>

    <div class="flex-1 flex justify-end">
      <slot name="actions" />
    </div>
  </div>
</template>
