<script setup lang="ts">
import GithubIcon from '@/assets/github.svg'
import type { Repo } from '../../types/portfolio'

defineProps<{ repo: Repo }>()
</script>

<template>
  <article class="card-base flex flex-col space-y-4">
    <a :href="`https://github.com/${repo.full_name}`" target="_blank" rel="noopener noreferrer">
      <img :src="`https://opengraph.githubassets.com/1/${repo.full_name}`" :alt="repo.full_name"
        class="w-full aspect-video rounded-lg object-cover" loading="lazy" />
    </a>

    <h3 class="text-lg font-semibold text-gray-900 dark:text-on-surface break-words">
      {{ repo.full_name }}
    </h3>

    <p class="flex-1 text-gray-600 dark:text-on-surface/80 line-clamp-3">
      {{ repo.description }}
    </p>

    <div class="flex justify-between items-center text-sm">
      <span class="chip">{{ repo.lang ?? 'Others' }}</span>
      <span class="flex items-center gap-1 text-primary-500 dark:text-primary-300">
        <GithubIcon class="w-4 h-4 fill-current" />
        {{ repo.stars }}
      </span>
    </div>
  </article>
</template>
