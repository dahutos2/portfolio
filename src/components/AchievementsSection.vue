<script setup lang="ts">
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'
import { useFetch } from '../composables/useFetch'
import type { Achievement } from '../types/portfolio'
import AchievementCard from './parts/AchievementCard.vue'
const { data: achievements, loading } = useFetch<Achievement[]>('achievements.json')
</script>
<template>
  <SectionContainer id="achievements">
    <h2 class="mb-12 text-center">実績</h2>
    <SectionState :loading="loading" :data="achievements" empty-text="実績がありません">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AchievementCard v-for="a in achievements!" :key="a.title" :achievement="a" />
      </div>
    </SectionState>
  </SectionContainer>
</template>