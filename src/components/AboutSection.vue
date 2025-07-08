<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionTitle from './parts/SectionTitle.vue'
import type { User } from '../types/portfolio'
import { fetchData } from '../utils/fetchData'

const user = ref<User | null>(null)
onMounted(async () => {
  user.value = await fetchData<User>('user.json')
})
</script>

<template>
  <SectionContainer id="about">
    <SectionTitle title="About&nbsp;Me" />

    <p class="text-xl leading-relaxed text-gray-700 dark:text-on-surface max-w-3xl">
      {{ user?.bio }}
    </p>

    <ul class="mt-8 space-y-2 text-gray-700 dark:text-on-surface/80">
      <li><strong>所在地:</strong> {{ user?.location }}</li>
      <li><strong>フォロワー:</strong> {{ user?.followers }}</li>
    </ul>
  </SectionContainer>
</template>
