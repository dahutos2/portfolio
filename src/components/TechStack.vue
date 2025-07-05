<script setup lang="ts">
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/ui/SectionState.vue'
import { useFetch } from '../composables/useFetch'
import type { CodingStats } from '../types/portfolio'
import { computed } from 'vue'
const { data: coding, loading } = useFetch<CodingStats>('coding.json')
const stats = computed(() => {
    if (!coding.value) return []
    const total = coding.value.total_seconds
    return [...coding.value.languages].sort(
        (a, b) => b.seconds - a.seconds
    ).slice(0, 6).map(l => ({ ...l, pct: l.seconds / total }))
})
</script>
<template>
    <SectionContainer id="tech">
        <SectionState :loading="loading" :data="stats">
            <h2 class="text-2xl font-bold mb-6">Tech Stack (by time)</h2>
            <div v-for="l in stats" :key="l.lang" class="mb-4">
                <div class="flex justify-between text-sm mb-1">
                    <span>{{ l.lang }}</span><span>{{ (l.pct * 100).toFixed(0) }}%</span>
                </div>
                <progress class="w-full h-2 rounded-full
                    overflow-hidden bg-gray-200 dark:bg-gray-700 
                    progress-tailwind" :value="(l.pct * 100).toFixed(1)" max="100" />
            </div>
        </SectionState>
    </SectionContainer>
</template>