<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { NProgress } from 'naive-ui'
import type { Metrics, MetricsLanguage } from '../types/portfolio'
import { fetchData } from '../lib/fetchData'
const langs = ref<MetricsLanguage[]>([])
onMounted(async () => {
    const m = await fetchData<Metrics>('metrics.json')
    langs.value = m.languages
})

const stats = computed(() => {
    if (!langs.value.length) return []
    const total = langs.value.reduce((s, l) => s + l.count, 0)
    return [...langs.value]                        // コピーして
        .sort((a, b) => b.count - a.count)          // 件数降順
        .slice(0, 6)                                // TOP6
        .map(l => ({ ...l, pct: l.count / total })) // 割合を付与
})
</script>

<template>
    <SectionContainer v-if="stats.length">
        <h2 class="text-2xl font-bold mb-6">Tech Stack</h2>
        <div v-for="s in stats" :key="s.lang" class="mb-4">
            <div class="flex justify-between text-sm mb-1">
                <span>{{ s.lang }}</span>
                <span>{{ (s.pct * 100).toFixed(0) }}%</span>
            </div>
            <NProgress :percentage="s.pct * 100" :show-indicator="false" />
        </div>
    </SectionContainer>
</template>
