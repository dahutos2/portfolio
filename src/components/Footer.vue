<script setup lang="ts">
import { ref, onMounted } from 'vue'
const user = ref<any>()
onMounted(async () => user.value = await (await fetch('/data/user.json')).json())
</script>

<template>
    <footer class="bg-gray-100 py-10">
        <SectionContainer class="text-center text-sm">
            <p v-if="user">© {{ new Date().getFullYear() }} {{ user.name }}.</p>
            <p>Built with Vue + Naive UI + GitHub Pages</p>
        </SectionContainer>
    </footer>
</template>
