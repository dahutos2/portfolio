<script setup lang="ts">
import { computed } from 'vue'
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'
import SectionTitle from './parts/SectionTitle.vue'
import { useFetch } from '../composables/useFetch'
import type { CodingStats } from '../types/portfolio'

const { data: coding, loading } = useFetch<CodingStats>('coding.json')

/* 上位 8 言語を抽出し、時間・割合を計算 */
const rows = computed(() => {
    if (coding.value == null) return []
    const totalHours = coding.value.total_seconds / 3600
    return coding.value.languages
        .sort((a, b) => b.seconds - a.seconds)
        .slice(0, 8)
        .map(l => ({
            ...l,
            hours: (l.seconds / 3600).toFixed(1),
            pct: (l.seconds / coding.value!.total_seconds) * 100,
            totalHours: totalHours.toFixed(1),
        }))
})
</script>

<template>
    <SectionContainer id="skills">
        <SectionTitle title="Skills&nbsp;&amp;&nbsp;Tools" />

        <SectionState :loading="loading" :data="rows">
            <p class="mb-6 text-sm text-right text-gray-600 dark:text-on-surface/70">
                作業時間 {{ rows[0]?.totalHours }}&nbsp;h
            </p>

            <div v-for="r in rows" :key="r.lang" class="mb-4">
                <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-700 dark:text-on-surface">{{ r.lang }}</span>
                    <span class="text-gray-600 dark:text-on-surface/80">
                        {{ r.hours }}h — {{ r.pct.toFixed(0) }}%
                    </span>
                </div>
                <!-- プログレスバー -->
                <div class="w-full h-2 rounded bg-gray-200 dark:bg-gray-600">
                    <div class="h-2 rounded bg-primary-400" :style="{ width: r.pct + '%' }" />
                </div>
            </div>
        </SectionState>
    </SectionContainer>
</template>
