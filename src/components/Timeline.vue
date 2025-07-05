<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TimelineEntry } from '../types/portfolio';
import { fetchData } from '../lib/fetchData';
const timeline = ref<TimelineEntry[]>([])
onMounted(async () => timeline.value = await fetchData<TimelineEntry[]>("timeline.json"))
</script>

<template>
    <SectionContainer>
        <h2 class="text-2xl font-bold mb-6">Career Timeline</h2>
        <ul class="border-l-2 border-primary-500 pl-6">
            <li v-for="t in timeline" :key="t.date" class="mb-6 relative">
                <span class="absolute -left-3 top-1.5 w-3 h-3 bg-primary-500 rounded-full" />
                <time class="font-semibold">{{ t.date }}</time> – {{ t.text }}
            </li>
        </ul>
    </SectionContainer>
</template>
