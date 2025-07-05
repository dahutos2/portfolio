<script setup lang="ts">
import type { Achievement } from '../../types/portfolio';
defineProps<{ achievement: Achievement }>()
</script>
<template>
  <div class="card-base bg-gradient-to-br from-secondary-100 to-primary-100">
    <h3 class="text-lg font-semibold mb-2 text-primary-700">{{ achievement.title }}</h3>
    <p class="text-gray-700 dark:text-gray-800">{{ achievement.link }}</p>
    <span class="text-sm text-gray-600">{{ achievement.date }}</span>
  </div>
</template>