<script setup lang="ts">
import type { Testimonial } from '../../types/portfolio';
defineProps<{ testimonial: Testimonial }>()
</script>
<template>
  <div class="card-base">
    <p class="italic text-gray-600 dark:text-gray-300 mb-4">"{{ testimonial.quote }}"</p>
    <div class="flex items-center">
      <img :src="`${import.meta.env.BASE_URL}testimonial.avatar`" alt="" class="w-10 h-10 rounded-full mr-3" />
      <div>
        <h4 class="font-semibold">{{ testimonial.author }}</h4>
        <span class="text-sm text-gray-500">
          {{ testimonial.position }}
        </span>
      </div>
    </div>
  </div>
</template>