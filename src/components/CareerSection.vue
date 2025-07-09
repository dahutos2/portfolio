<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'
import SectionTitle from './parts/SectionTitle.vue'
import { useFetch } from '../composables/useFetch'
import type { CareerEvent } from '../types/portfolio'

const { data: career, loading } = useFetch<CareerEvent[]>('career.json')
const sorted = computed(() =>
    [...(career.value ?? [])].sort((a, b) => b.date.localeCompare(a.date))
)

// 実績: リンク付き + 3件
const LIMIT = 3
const achievements = computed(() =>
    sorted.value.filter(e => e.link).slice(0, LIMIT)
)

// タイムライン表示件数
const SHOW_COUNT = 6
const showAll = ref(false)
const visibleTimeline = computed(() =>
    showAll.value ? sorted.value : sorted.value.slice(0, SHOW_COUNT)
)

// ハイライト ID
const highlightedId = ref<string | null>(null)
const headerH = ref(0)
onMounted(() => {
    const h = document.querySelector('header') as HTMLElement | null
    headerH.value = h?.offsetHeight ?? 0
})

// 共通 ID 生成
const makeId = (d: string, t: string) => `tl-${d}-${t.replace(/\s+/g, '-')}`

// UI操作
function toggleAll() {
    showAll.value = !showAll.value
}
function scrollTo(date: string, title: string) {
    const id = makeId(date, title)
    const idx = sorted.value.findIndex(e => makeId(e.date, e.title) === id)

    if (!showAll.value && idx >= SHOW_COUNT) showAll.value = true

    nextTick(() => {
        const el = document.getElementById(id)
        if (!el) return
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        highlightedId.value = id
    })
}

// 外側クリック解除
function handleClickOutside(e: MouseEvent) {
    if (!highlightedId.value) return
    const target = e.target as HTMLElement
    const parent = target.closest('[data-id]') as HTMLElement | null

    if (!parent || parent.dataset.id !== highlightedId.value) {
        highlightedId.value = null
    }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
    <SectionContainer id="career">
        <SectionTitle title="経歴と実績" />

        <!-- 実績カード -->
        <SectionState :loading="loading" :data="achievements" empty-text="実績がありません">
            <ul v-if="achievements.length" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
                <li v-for="a in achievements" :key="a.title" :data-id="makeId(a.date, a.title)" data-achievement :class="[
                    'card-base flex flex-col h-full p-4 space-y-4 cursor-pointer transition',
                    highlightedId === makeId(a.date, a.title)
                        ? 'ring-2 ring-primary-400'
                        : 'hover:ring-2 ring-primary-300'
                ]" @click="scrollTo(a.date, a.title)">
                    <!-- タイトル -->
                    <h3 class="flex items-start gap-2 min-h-[3rem]">
                        <span class="flex-1 text-base font-semibold text-gray-900 dark:text-on-surface line-clamp-2">
                            {{ a.title }}
                        </span>
                        <span class="shrink-0 whitespace-nowrap text-xs text-gray-500 dark:text-on-surface/60">
                            ({{ a.date }})
                        </span>
                    </h3>
                    <div class="flex-1" />
                    <a :href="a.link" target="_blank" rel="noopener noreferrer" class="btn-outline text-xs self-start"
                        @click.stop>
                        詳細を見る
                    </a>
                </li>
            </ul>
        </SectionState>

        <!-- タイムライン -->
        <SectionState :loading="loading" :data="sorted" empty-text="タイムラインがありません">
            <ol class="relative ml-3 md:ml-0 border-l border-gray-300 dark:border-gray-600">
                <li v-for="t in visibleTimeline" :key="t.date + t.title" :id="makeId(t.date, t.title)"
                    :data-id="makeId(t.date, t.title)" :style="{ scrollMarginTop: `${headerH + 16}px` }"
                    class="mb-8 ml-6">
                    <!-- 玉 -->
                    <span class="absolute -left-3 w-6 h-6" aria-hidden="true">
                        <!-- メイン -->
                        <span :class="[
                            'relative flex items-center justify-center w-6 h-6 rounded-full ring-8 ring-white dark:ring-surface transition',
                            highlightedId === makeId(t.date, t.title)
                                ? 'bg-primary-400 shadow-lg'
                                : 'bg-primary-500'
                        ]" />
                        <!-- 波紋 -->
                        <span v-if="highlightedId === makeId(t.date, t.title)"
                            class="absolute inset-0 rounded-full bg-primary-400/60 animate-ping pointer-events-none" />
                    </span>

                    <!-- 本文 -->
                    <time class="mb-1 text-sm text-gray-400 dark:text-on-surface/60">
                        {{ t.date }}
                    </time>
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ t.title }}
                    </h4>
                </li>
            </ol>

            <!-- More / Close -->
            <div v-if="sorted.length > SHOW_COUNT" class="text-center mt-6">
                <button class="btn-outline text-sm" @click="toggleAll">
                    {{ showAll ? '閉じる' : 'もっと見る' }}
                </button>
            </div>
        </SectionState>
    </SectionContainer>
</template>
