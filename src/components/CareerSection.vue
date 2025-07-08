<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'
import SectionTitle from './parts/SectionTitle.vue'
import { useFetch } from '../composables/useFetch'
import type { CareerEvent } from '../types/portfolio'

const { data: career, loading } =
    useFetch<CareerEvent[]>('career.json')

const achievements = computed(() =>
    career.value?.filter(e => !!e.link) ?? [],
)
const timelineSorted = computed(() =>
    (career.value ?? []).sort(
        (a, b) => b.date.localeCompare(a.date),
    ),
)

/* ---------- タイムライン折りたたみ ---------- */
const SHOW_COUNT = 6
const showAll = ref(false)

const visibleTimeline = computed(() =>
    showAll.value
        ? timelineSorted.value
        : timelineSorted.value.slice(0, SHOW_COUNT),
)

/* ---------- 選択行ハイライト用 ---------- */
const highlightedId = ref<string | null>(null)
const HIGHLIGHT_MS = 2000

/* ---------- ヘッダー高取得 ---------- */
const headerH = ref(0)
onMounted(() => {
    const h = document.querySelector('header') as HTMLElement | null
    headerH.value = h?.offsetHeight ?? 0 // Sticky Header の実高さ (px)
})

/* ---------- ユーティリティ ---------- */
const makeId = (d: string, t: string) =>
    `tl-${d}-${t.replace(/\s+/g, '-')}`

/* ---------- UI 操作 ---------- */
function toggleAll() {
    showAll.value = !showAll.value
}

function scrollTo(date: string, title: string) {
    const id = makeId(date, title)
    const idx = timelineSorted.value.findIndex(
        e => makeId(e.date, e.title) === id,
    )

    // まだ折りたたみ中で非表示位置にある場合のみ展開
    if (!showAll.value && idx >= SHOW_COUNT) {
        showAll.value = true
    }

    nextTick(() => {
        const el = document.getElementById(id)
        if (!el) return

        /* スクロール */
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })

        /* ハイライト */
        highlightedId.value = id
        setTimeout(() => (highlightedId.value = null), HIGHLIGHT_MS)
    })
}
</script>

<template>
    <SectionContainer id="career">
        <SectionTitle title="Career&nbsp;&amp;&nbsp;Achievements" />

        <!-- Achievements -->
        <SectionState :loading="loading" :data="achievements" empty-text="実績がありません">
            <ul v-if="achievements.length" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
                <li v-for="a in achievements" :key="a.title"
                    class="card-base flex flex-col h-full p-4 space-y-4 hover:ring-2 ring-primary-300 cursor-pointer"
                    @click="scrollTo(a.date, a.title)">
                    <!-- タイトル + 日付 -->
                    <h3 class="flex items-start gap-2 min-h-[3rem]">
                        <!-- タイトル（最大 2 行で省略） -->
                        <span class="flex-1 text-base font-semibold text-gray-900 dark:text-on-surface line-clamp-2">
                            {{ a.title }}
                        </span>

                        <!-- 日付：折り返さず幅固定 -->
                        <span class="shrink-0 whitespace-nowrap text-xs text-gray-500 dark:text-on-surface/60">
                            ({{ a.date }})
                        </span>
                    </h3>
                    <div class="flex-1"></div>

                    <!-- 詳細ボタン -->
                    <a :href="a.link" target="_blank" rel="noopener noreferrer" class="btn-outline text-xs self-start"
                        @click.stop>
                        詳細を見る
                    </a>
                </li>
            </ul>
        </SectionState>

        <!-- Timeline -->
        <SectionState :loading="loading" :data="timelineSorted" empty-text="タイムラインがありません">
            <ol class="relative border-l border-gray-300 dark:border-gray-600">
                <li v-for="t in visibleTimeline" :key="t.date + t.title" :id="makeId(t.date, t.title)"
                    :style="{ scrollMarginTop: `${headerH + 16}px` }" class="mb-8 ml-6">
                    <span class="absolute -left-3 w-6 h-6" aria-hidden="true">
                        <!-- メインの玉 -->
                        <span :class="[
                            'relative flex items-center justify-center w-6 h-6 rounded-full ring-8 ring-white dark:ring-surface transition-transform duration-300',
                            highlightedId === makeId(t.date, t.title)
                                ? 'bg-primary-400 shadow-lg'
                                : 'bg-primary-500'
                        ]"></span>

                        <!-- 波紋エフェクト（ハイライト中のみ描画）-->
                        <span v-if="highlightedId === makeId(t.date, t.title)"
                            class="absolute inset-0 rounded-full bg-primary-400 opacity-50 animate-ping pointer-events-none"></span>
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

            <!-- もっと見る／閉じる -->
            <div v-if="timelineSorted.length > SHOW_COUNT" class="text-center mt-6">
                <button class="btn-outline text-sm" @click="toggleAll">
                    {{ showAll ? '閉じる' : 'もっと見る' }}
                </button>
            </div>
        </SectionState>
    </SectionContainer>
</template>
