<script setup lang="ts">
import Skeleton from './Skeleton.vue'
const props = defineProps<{ loading: boolean; data: any; emptyText?: string }>()
</script>
<template>
    <div v-if="props.loading" class="space-y-4">
        <Skeleton height="h-8" v-for="i in 3" :key="i" />
    </div>
    <div v-else-if="Array.isArray(props.data) ?
        !props.data.length : !props.data" class="text-center text-gray-500">
        {{ props.emptyText || 'データがありません' }}</div>
    <slot v-else />
</template>