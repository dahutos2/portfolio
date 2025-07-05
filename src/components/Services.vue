<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Service } from '../types/portfolio'
import { fetchData } from '../lib/fetchData'
const services = ref<Service[]>([])
onMounted(async () => services.value = await fetchData<Service[]>("services.json"))
</script>

<template>
    <SectionContainer id="services" v-if="services.length">
        <h2 class="text-2xl font-bold mb-6">Services</h2>
        <div class="grid md:grid-cols-3 gap-8">
            <div v-for="s in services" :key="s.title" class="p-6 border rounded-lg shadow-sm">
                <h3 class="font-semibold text-lg">{{ s.title }}</h3>
                <p class="mt-2 text-sm">{{ s.blurb }}</p>
                <ul class="mt-3 flex flex-wrap gap-2">
                    <li v-for="t in s.stack" :key="t" class="text-xs bg-primary-100 text-primary-500 px-2 py-1 rounded">
                        {{ t }}</li>
                </ul>
            </div>
        </div>
    </SectionContainer>
</template>
