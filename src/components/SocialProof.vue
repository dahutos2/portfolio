<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Metrics, User } from '../types/portfolio'
import { fetchData } from '../lib/fetchData'
const metrics = ref<{ stars: number, followers: number }>()
onMounted(async () => {
    const user = await fetchData<User>("user.json")
    const m = await fetchData<Metrics>('metrics.json')
    metrics.value = { followers: user.followers, stars: m.total_stars }
})
</script>

<template>
    <SectionContainer v-if="metrics">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xl font-semibold">
            <div><span class="text-3xl">{{ metrics.followers }}</span><br />Followers</div>
            <div><span class="text-3xl">{{ metrics.stars }}</span><br />GitHub Stars</div>
            <!-- ロゴ壁などを置いてもOK -->
        </div>
    </SectionContainer>
</template>
