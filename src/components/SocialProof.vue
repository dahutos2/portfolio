<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User, Metrics, CodingStats } from '../types/portfolio'
import { fetchData } from '../lib/fetchData'

const metrics = ref<{ followers: number; stars: number; hours: string } | null>(null)

onMounted(async () => {
    const [user, m, coding] = await Promise.all([
        fetchData<User>('user.json'),
        fetchData<Metrics>('metrics.json'),
        fetchData<CodingStats>('coding.json')
    ])

    const hours = (coding.total_seconds / 3600).toFixed(0)
    metrics.value = {
        followers: user.followers,
        stars: m.total_stars,
        hours
    }
})
</script>

<template>
    <SectionContainer v-if="metrics">
        <div class="grid grid-cols-3 md:grid-cols-6 gap-6 text-center text-xl font-semibold">
            <div>
                <span class="text-3xl">{{ metrics.followers }}</span><br />Followers
            </div>
            <div>
                <span class="text-3xl">{{ metrics.stars }}</span><br />GitHub Stars
            </div>
            <div>
                <span class="text-3xl">{{ metrics.hours }}</span><br />Coding&nbsp;Hours
            </div>
        </div>
    </SectionContainer>
</template>
