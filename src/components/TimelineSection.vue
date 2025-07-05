<script setup lang="ts">
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'
import { useFetch } from '../composables/useFetch'
import type { TimelineEntry } from '../types/portfolio'
const { data: timeline, loading } = useFetch<TimelineEntry[]>('timeline.json')
</script>
<template>
  <SectionContainer id="timeline">
    <h2 class="mb-12 text-center">キャリアタイムライン</h2>
    <SectionState :loading="loading" :data="timeline" empty-text="タイムラインがありません">
      <ol class="relative border-l border-gray-200 dark:border-gray-700">
        <li v-for="i in timeline!" :key="i.date" class="mb-10 ml-6">
          <span class="absolute flex items-center
            justify-center w-6 h-6 bg-primary-500
            rounded-full -left-3 ring-8 ring-white dark:ring-gray-900">
          </span>
          <time class="mb-1 text-sm text-gray-400 dark:text-gray-500">{{ i.date }}</time>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ i.text }}</h3>
        </li>
      </ol>
    </SectionState>
  </SectionContainer>
</template>