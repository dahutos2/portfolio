<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchData } from '../lib/fetchData';
import type { User } from '../types/portfolio';
const user = ref<User | null>(null)
onMounted(async () => user.value = await fetchData<User>("user.json"))
</script>

<template>
    <footer class="bg-gray-100 py-10">
        <SectionContainer class="text-center text-sm">
            <p v-if="user">© {{ new Date().getFullYear() }} {{ user.name }}.</p>
            <p>Built with Vue + Naive UI + GitHub Pages</p>
        </SectionContainer>
    </footer>
</template>
