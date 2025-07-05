<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Repo, User } from '../types/portfolio'
import { fetchData } from '../lib/fetchData'
const metrics = ref<{ stars: number, followers: number }>()
onMounted(async () => {
    const u = await fetchData<User>("user.json")
    const repos = await fetchData<Repo[]>("repos.json")
    metrics.value = {
        followers: u.followers,
        stars: repos.reduce((s: number, r: Repo) => s + r.stars, 0)
    }
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
