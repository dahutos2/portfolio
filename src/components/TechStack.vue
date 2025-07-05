<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { NProgress } from 'naive-ui'
import type { CodingStats } from '../types/portfolio'
import { fetchData } from '../lib/fetchData'

const coding = ref<CodingStats | null>(null)
onMounted(async () => {
    coding.value = await fetchData<CodingStats>('coding.json')
})

const stats = computed(() => {
    if (!coding.value) return []
    const total = coding.value.total_seconds
    return [...coding.value.languages]
        .sort((a, b) => b.seconds - a.seconds)
        .slice(0, 6)
        .map(l => ({ ...l, pct: l.seconds / total }))
})
</script>

<template>
    <SectionContainer v-if="stats.length">
        <h2 class="text-2xl font-bold mb-6">Tech Stack (by time)</h2>

        <div v-for="l in stats" :key="l.lang" class="mb-4">
            <div class="flex justify-between text-sm mb-1">
                <span>{{ l.lang }}</span>
                <span>{{ (l.pct * 100).toFixed(0) }}%</span>
            </div>
            <NProgress :percentage="l.pct * 100" :show-indicator="false" />
        </div>
    </SectionContainer>
</template>
