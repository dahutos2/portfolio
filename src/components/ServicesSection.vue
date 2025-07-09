<script setup lang="ts">
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'
import SectionTitle from './parts/SectionTitle.vue'
import { useFetch } from '../composables/useFetch'
import type { Service } from '../types/portfolio'
import ServiceCard from './parts/ServiceCard.vue'
import { computed, ref } from 'vue'

const { data: services, loading } = useFetch<Service[]>('services.json')

// 表示切り替え用の状態
const showAll = ref(false)
const LIMIT = 3

// 表示対象のリスト
const visibleServices = computed(() => {
  return showAll.value ? services?.value ?? [] : (services?.value ?? []).slice(0, LIMIT)
})

// 切り替えトグル
const toggle = () => (showAll.value = !showAll.value)
</script>

<template>
  <SectionContainer id="services">
    <SectionTitle title="提供できること" />

    <SectionState :loading="loading" :data="services" empty-text="登録されたサービスはありません">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <ServiceCard v-for="s in visibleServices" :key="s.title" :service="s" />
      </div>

      <!-- もっと見る／閉じる -->
      <div v-if="(services?.length ?? 0) > LIMIT" class="text-center mt-6">
        <button class="btn-outline text-sm" @click="toggle">
          {{ showAll ? '閉じる' : 'もっと見る' }}
        </button>
      </div>
    </SectionState>
  </SectionContainer>
</template>
