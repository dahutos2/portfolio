<script setup lang="ts">
import { useFetch } from '../composables/useFetch'
import type { User } from '../types/portfolio'
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/ui/SectionState.vue'
const { data: user, loading } = useFetch<User>('user.json')
</script>
<template>
  <SectionContainer id="top">
    <SectionState :loading="loading" :data="user">
      <div class="flex flex-col md:flex-row items-center space-y-10 md:space-y-0 md:space-x-8">
        <div class="flex-1 space-y-6">
          <h1 class="text-gray-900 dark:text-white">{{ user!.name }}</h1>
          <p class="text-lg text-gray-600 dark:text-gray-300">{{ user!.bio }}</p>
          <div class="flex space-x-4">
            <a :href="`https://github.com/${user!.twitter}`" target="_blank" class="btn-primary">GitHub</a>
            <a href="#contact" class="btn-outline">お問い合わせ</a>
          </div>
        </div>
        <img :src="user!.avatar" alt="avatar" class="w-52 h-52 rounded-full shadow-lg" />
      </div>
    </SectionState>
  </SectionContainer>
</template>