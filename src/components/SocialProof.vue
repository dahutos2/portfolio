<script setup lang="ts">
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/ui/SectionState.vue'
import { useFetch } from '../composables/useFetch'
import type { User, Metrics, CodingStats } from '../types/portfolio'
import { computed } from 'vue'
const { data: user, loading: lu } = useFetch<User>('user.json')
const { data: metricsRaw, loading: lm } = useFetch<Metrics>('metrics.json')
const { data: coding, loading: lc } = useFetch<CodingStats>('coding.json')
const loading = computed(() => lu.value || lm.value || lc.value)
const metrics = computed(() => {
    if (!user.value || !metricsRaw.value || !coding.value) return null
    return {
        followers: user.value.followers,
        stars: metricsRaw.value.total_stars,
        hours: (coding.value.total_seconds / 3600).toFixed(0)
    }
})
</script>
<template>
    <SectionContainer id="social">
        <SectionState :loading="loading" :data="metrics">
            <div class="grid grid-cols-3 md:grid-cols-6 gap-6 text-center text-xl font-semibold">
                <div><span class="text-3xl">{{ metrics!.followers }}</span><br />Followers</div>
                <div><span class="text-3xl">{{ metrics!.stars }}</span><br />GitHub Stars</div>
                <div><span class="text-3xl">{{ metrics!.hours }}</span><br />Coding&nbsp;Hours</div>
            </div>
        </SectionState>
    </SectionContainer>
</template>