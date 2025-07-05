<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NCard, NCollapse, NCollapseItem } from 'naive-ui'
import type { Repo } from '../types/portfolio'
import { fetchData } from '../lib/fetchData'
const repos = ref<Repo[]>([])
onMounted(async () => {
    repos.value = (await fetchData<Repo[]>("repos.json"))
        .sort((a: any, b: any) => b.stars - a.stars)
})
</script>

<template>
    <SectionContainer id="projects">
        <h2 class="text-2xl font-bold mb-6">Featured Projects</h2>
        <NCard v-for="r in repos" :key="r.full_name" class="my-8">
            <template #header>{{ r.full_name }}</template>
            <p>{{ r.description }}</p>
            <p class="text-sm mb-4">⭐ {{ r.stars }} ｜ {{ r.lang }}</p>
            <NCollapse :default-expanded-names="[]">
                <NCollapseItem :title="`README – ${r.full_name}`" :name="r.full_name">
                    <div v-html="r.html" class="prose max-w-none" />
                </NCollapseItem>
            </NCollapse>
        </NCard>
    </SectionContainer>
</template>
