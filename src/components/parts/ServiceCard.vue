<script setup lang="ts">
import type { Service } from '../../types/portfolio'
defineProps<{ service: Service }>()
</script>

<template>
  <article class="card-base space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-on-surface">
      {{ service.title }}
    </h3>
    <p class="text-gray-600 dark:text-on-surface/80">
      {{ service.blurb }}
    </p>

    <ul class="flex flex-wrap gap-2">
      <li v-for="t in service.stack" :key="t" class="chip">{{ t }}</li>
    </ul>
  </article>
</template>
