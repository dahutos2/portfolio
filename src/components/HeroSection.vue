<script setup lang="ts">
import { useFetch } from '../composables/useFetch'
import type { User } from '../types/portfolio'
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'

const { data: user, loading } = useFetch<User>('user.json')
</script>

<template>
  <SectionContainer id="top">
    <SectionState :loading="loading" :data="user">
      <div class="flex flex-col md:flex-row items-center space-y-10 md:space-y-0 md:space-x-8">
        <!-- テキスト -->
        <div class="flex-1 space-y-6">
          <h1 class="text-4xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
            {{ user!.name }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-on-surface/80">
            {{ user!.bio }}
          </p>

          <div class="flex space-x-4">
            <a :href="`https://github.com/${user!.owner}`" target="_blank" rel="noopener noreferrer"
              class="btn-primary">
              GitHub
            </a>
            <a href="#contact" class="btn-outline">お問い合わせ</a>
          </div>
        </div>

        <!-- アバター -->
        <img :src="user!.avatar" alt="avatar" class="w-52 h-52 rounded-full shadow-lg object-cover" />
      </div>
    </SectionState>
  </SectionContainer>
</template>
