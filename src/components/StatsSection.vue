<script setup lang="ts">
import { computed } from 'vue'
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'
import SectionTitle from './parts/SectionTitle.vue'
import { useFetch } from '../composables/useFetch'
import type { User, Metrics, CodingStats } from '../types/portfolio'

const { data: user, loading: lu } = useFetch<User>('user.json')
const { data: metrics, loading: lm } = useFetch<Metrics>('metrics.json')
const { data: coding, loading: lc } = useFetch<CodingStats>('coding.json')

const loading = computed(() => lu.value || lm.value || lc.value)

const stats = computed(() => {
    if (!user.value || !metrics.value || !coding.value) return null
    return [
        { label: 'Followers', value: user.value.followers },
        { label: 'GitHub Stars', value: metrics.value.total_stars },
        {
            label: 'Coding Hours',
            value: (coding.value.total_seconds / 3600).toFixed(0),
        },
    ]
})
</script>

<template>
    <SectionContainer id="stats">
        <SectionTitle title="Stats" />

        <SectionState :loading="loading" :data="stats">
            <ul class="grid gap-6 sm:grid-cols-3 text-center">
                <li v-for="s in stats!" :key="s.label" class="card-base py-8 space-y-1">
                    <p class="text-3xl font-bold text-primary-500">
                        {{ s.value }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-on-surface/80">
                        {{ s.label }}
                    </p>
                </li>
            </ul>
        </SectionState>
    </SectionContainer>
</template>
