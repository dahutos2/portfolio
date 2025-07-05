<script setup lang="ts">
const props = defineProps<{ height?: string }>()
</script>
<template>
    <div :class="['animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700', props.height ?? 'h-6']" />
</template>