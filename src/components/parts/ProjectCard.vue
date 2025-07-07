<script setup lang="ts">
import type { Repo } from '../../types/portfolio'

defineProps<{ repo: Repo }>()
</script>

<template>
  <article class="card-base flex flex-col space-y-4">
    <a :href="`https://github.com/${repo.full_name}`" target="_blank" rel="noopener noreferrer">
      <img :src="`https://opengraph.githubassets.com/1/${repo.full_name}`" :alt="repo.full_name"
        class="w-full aspect-video rounded-lg object-cover" loading="lazy" />
    </a>

    <h3 class="text-lg font-semibold text-gray-900 dark:text-on-surface">
      {{ repo.full_name }}
    </h3>

    <p class="flex-1 text-gray-600 dark:text-on-surface/80 line-clamp-3">
      {{ repo.description }}
    </p>

    <div class="flex justify-between items-center text-sm">
      <span class="chip">{{ repo.lang ?? 'Others' }}</span>
      <span class="flex items-center gap-1 text-primary-500 dark:text-primary-300">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <<path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.38.6.11.82-.26.82-.58
    0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76
    -1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6
    -2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.16 0 0 1-.32 3.3 1.23
    .95-.26 1.97-.39 2.98-.39 1.01 0 2.03.13 2.98.39 2.3-1.55 3.3-1.23 3.3-1.23.66 1.64.24 2.86.12 3.16
    .77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22
    0 1.6-.01 2.89-.01 3.28 0 .32.22.69.83.57C20.57 21.8 24 17.3 24 12
    24 5.37 18.63 0 12 0z" />
        </svg>
        {{ repo.stars }}
      </span>
    </div>
  </article>
</template>
