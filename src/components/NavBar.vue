<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
const links = ['Home', 'Services', 'Projects', 'Contact']
</script>

<template>
    <header class="fixed z-50 top-0 left-0 w-full bg-white/80 backdrop-blur shadow">
        <nav class="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
            <a href="#top" class="font-bold text-lg">Daichi Okumura</a>
            <button class="md:hidden" @click="open = !open">☰</button>
            <ul :class="['md:flex gap-6', open ? 'block' : 'hidden md:block']">
                <li v-for="l in links" :key="l">
                    <a :href="'#' + l.toLowerCase()" class="hover:text-primary-500">{{ l }}</a>
                </li>
            </ul>
        </nav>
    </header>
</template>
