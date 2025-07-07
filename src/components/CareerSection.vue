<script setup lang="ts">
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'
import SectionTitle from './parts/SectionTitle.vue'
import { useFetch } from '../composables/useFetch'
import type { Achievement, TimelineEntry } from '../types/portfolio'

const { data: achievements, loading: la } = useFetch<Achievement[]>('achievements.json')
const { data: timeline, loading: lt } = useFetch<TimelineEntry[]>('timeline.json')
</script>

<template>
    <SectionContainer id="career" muted>
        <SectionTitle title="Career&nbsp;&amp;&nbsp;Achievements" />

        <!-- Achievements -->
        <SectionState :loading="la" :data="achievements" empty-text="実績がありません">
            <div v-if="achievements?.length" class="mb-16">
                <ul class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <li v-for="a in achievements" :key="a.title" class="card-base space-y-3">
                        <h3 class="text-base font-semibold text-gray-900 dark:text-on-surface flex items-center gap-2">
                            <span>{{ a.title }}</span>
                            <span class="text-xs text-gray-500 dark:text-on-surface/60">
                                ({{ a.date }})
                            </span>
                        </h3>

                        <a v-if="a.link" :href="a.link" target="_blank" rel="noopener noreferrer"
                            class="btn-outline text-xs inline-block">
                            詳細を見る
                        </a>
                    </li>
                </ul>
            </div>
        </SectionState>

        <!-- Timeline -->
        <SectionState :loading="lt" :data="timeline" empty-text="タイムラインがありません">
            <ol class="relative border-l border-gray-300 dark:border-gray-600">
                <li v-for="i in timeline!" :key="i.date" class="mb-8 ml-6">
                    <span class="absolute -left-3 flex items-center justify-center w-6 h-6
                   bg-primary-500 rounded-full ring-8 ring-white dark:ring-surface" />
                    <time class="mb-1 text-sm text-gray-400 dark:text-on-surface/60">
                        {{ i.date }}
                    </time>
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ i.text }}
                    </h4>
                </li>
            </ol>
        </SectionState>
    </SectionContainer>
</template>
