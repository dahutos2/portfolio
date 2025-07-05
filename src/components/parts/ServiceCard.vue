<script setup lang="ts">
import type { Service } from '../../types/portfolio';
defineProps<{ service: Service }>()
</script>
<template>
  <div class="card-base">
    <h3 class="text-xl font-semibold text-gray-900
     dark:text-gray-100 mb-2 group-hover:text-primary-500 transition">
      {{ service.title }}
    </h3>
    <p class="text-gray-600 dark:text-gray-400 mb-4">{{ service.blurb }}</p>
    <ul class="flex flex-wrap gap-2">
      <li v-for="stack in service.stack" :key="stack"
        class="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-500 text-sm">
        {{ stack }}
      </li>
    </ul>
  </div>
</template>