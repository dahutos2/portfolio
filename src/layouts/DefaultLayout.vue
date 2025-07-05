<script setup lang="ts">
const links = [
    { label: 'Home', to: '#top' },
    { label: 'About', to: '#about' },
    { label: 'Work', to: '#projects' },
    { label: 'Services', to: '#services' },
    { label: 'Timeline', to: '#timeline' },
    { label: 'Contact', to: '#contact' }
]
</script>
<template>
    <header class="bg-white/80 backdrop-blur sticky top-0 z-50 
        border-b border-gray-100 dark:bg-gray-900/80 dark:border-gray-700">
        <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
            <a href="#" class="text-primary-500 font-semibold text-lg tracking-tight">Okumura.dev</a>
            <nav class="hidden md:flex space-x-6">
                <a v-for="l in links" :key="l.to" :href="l.to" class="hover:text-primary-500 transition">
                    {{ l.label }}
                </a>
            </nav>
        </div>
    </header>
    <main>
        <slot />
    </main>
    <footer class="mt-24 py-8 bg-gray-900 text-gray-400">
        <div class="max-w-6xl mx-auto px-4 text-center">
            © {{ new Date().getFullYear() }} Daichi Okumura — All rights reserved.
        </div>
    </footer>
</template>