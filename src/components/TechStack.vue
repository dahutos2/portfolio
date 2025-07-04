<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { NProgress } from 'naive-ui'
import { groupBy } from 'lodash-es'
const repos = ref<any[]>([])
onMounted(async () => repos.value = await (await fetch('/data/repos.json')).json())

const stats = computed(() => {
    const total = repos.value.length
    return Object.entries(groupBy(repos.value, 'lang'))
        .map(([lang, arr]) => ({ lang, count: arr.length, pct: arr.length / total }))
        .sort((a, b) => b.count - a.count).slice(0, 6)
})
</script>

<template>
    <SectionContainer>
        <h2 class="text-2xl font-bold mb-6">Tech Stack</h2>
        <div v-for="s in stats" :key="s.lang" class="mb-4">
            <div class="flex justify-between text-sm mb-1">
                <span>{{ s.lang }}</span><span>{{ (s.pct * 100).toFixed(0) }}%</span>
            </div>
            <NProgress :percentage="s.pct * 100" :show-indicator="false" />
        </div>
    </SectionContainer>
</template>
