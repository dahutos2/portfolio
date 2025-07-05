<script setup lang="ts">
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'
import type { User } from '../types/portfolio'
import { useFetch } from '../composables/useFetch'
const { data: user, loading } = useFetch<User>('user.json')
</script>
<template>
  <SectionContainer id="about">
    <h2 class="mb-6">自己紹介</h2>
    <SectionState :loading="loading" :data="user" empty-text="ユーザー情報がありません">
      <p class="leading-relaxed text-gray-700 dark:text-gray-300 max-w-3xl">{{ user!.bio }}</p>
      <ul class="mt-8 space-y-2">
        <li><strong>所在地:</strong> {{ user!.location }}</li>
        <li><strong>フォロワー:</strong> {{ user!.followers }}</li>
      </ul>
    </SectionState>
  </SectionContainer>
</template>