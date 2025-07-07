<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
    <h2 class="mb-12 text-3xl md:text-5xl font-bold leading-tight
    text-gray-900 dark:text-on-surface md:text-center">
        {{ title }}
    </h2>
</template>
