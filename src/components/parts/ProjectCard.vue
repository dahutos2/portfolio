<script setup lang="ts">
import type { Repo } from '../../types/portfolio'
import HoverTooltip from './HoverTooltip.vue'

const props = defineProps<{ repo: Repo }>()

function navigate() {
  window.open(`https://github.com/${props.repo.full_name}`, '_blank')
}
</script>

<template>
  <HoverTooltip @click="navigate">
    <!-- anchor -->
    <template #anchor>
      <a :href="`https://github.com/${props.repo.full_name}`" target="_blank" class="card-base block">
        <h3 class="text-lg font-semibold mb-2 group-hover:text-primary-500 transition">
          {{ props.repo.full_name }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {{ props.repo.description }}
        </p>
        <div class="flex justify-between text-sm">
          <span>{{ props.repo.lang }}</span>
          <span>⭐ {{ props.repo.stars }}</span>
        </div>
      </a>
    </template>

    <!-- tooltip -->
    <div v-html="props.repo.html" />
  </HoverTooltip>
</template>
