<script setup lang="ts">
import { ref, computed } from 'vue'
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'
import SectionTitle from './parts/SectionTitle.vue'
import { useFetch } from '../composables/useFetch'
import type { CodingStats } from '../types/portfolio'

const { data: coding, loading } = useFetch<CodingStats>('coding.json')

// もっと見るトグル
const showAll = ref(false)
const TO_SHOW = 8

// 合計時間（h）と開始日
const totalHours = computed(() =>
    coding.value ?
        (coding.value.total_seconds / 3600).toFixed(1)
        : '0.0'
)
const startedAt = computed(() =>
    coding.value?.started_at ?
        new Date(coding.value.started_at).toLocaleDateString()
        : ''
)

// 表示行
const rows = computed(() => {
    if (!coding.value) return []
    const totalSeconds = coding.value.total_seconds
    return coding.value.languages
        .sort((a, b) => b.seconds - a.seconds)
        .map(l => ({
            ...l,
            hours: (l.seconds / 3600).toFixed(1),
            pct: (l.seconds / totalSeconds) * 100,
        }))
})

const visibleRows = computed(() =>
    showAll.value ? rows.value : rows.value.slice(0, TO_SHOW)
)
</script>

<template>
    <SectionContainer id="skills">
        <SectionTitle title="スキルとツール" />

        <SectionState :loading="loading" :data="rows">
            <div class="flex flex-wrap gap-2 justify-end mb-6 text-xs font-medium">
                <span class="px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    計測開始 {{ startedAt }}
                </span>
                <span
                    class="px-2 py-0.5 rounded bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-300">
                    合計 {{ totalHours }}&nbsp;h
                </span>
            </div>

            <div v-for="r in visibleRows" :key="r.lang" class="mb-4">
                <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-700 dark:text-on-surface">{{ r.lang }}</span>
                    <span class="text-gray-600 dark:text-on-surface/80">
                        {{ r.hours }}h — {{ r.pct.toFixed(0) }}%
                    </span>
                </div>
                <!-- プログレスバー：言語固有の color があれば使用 -->
                <div class="w-full h-2 rounded bg-gray-200 dark:bg-gray-600">
                    <div class="h-2 rounded" :style="{
                        width: r.pct + '%',
                        backgroundColor: r.color || 'rgb(34 197 94)', /* fallback: Tailwind green-500 */
                    }" />
                </div>
            </div>

            <!-- もっと見る／閉じる -->
            <div v-if="rows.length > TO_SHOW" class="text-center mt-6">
                <button class="btn-outline text-sm" @click="showAll = !showAll">
                    {{ showAll ? '閉じる' : 'もっと見る' }}
                </button>
            </div>
        </SectionState>
    </SectionContainer>
</template>
