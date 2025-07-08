<script setup lang="ts">
const links = [
    { label: 'Home', to: '#top' },
    { label: 'About', to: '#about' },
    { label: 'Services', to: '#services' },
    { label: 'Stats', to: '#stats' },
    { label: 'Work', to: '#projects' },
    { label: 'Skills', to: '#skills' },
    { label: 'Career', to: '#career' },
    { label: 'Contact', to: '#contact' }
]
</script>

<template>
    <!-- ===== Header ===== -->
    <header class="sticky top-0 z-50 backdrop-blur
           bg-white/80 border-b border-gray-100
           dark:bg-surface/80 dark:border-surface-muted">
        <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
            <a href="#top" class="text-primary-600 dark:text-primary-400 font-semibold text-lg tracking-tight">
                Okumura.dev
            </a>

            <!-- PC ナビ -->
            <nav class="hidden md:flex space-x-6">
                <a v-for="l in links" :key="l.to" :href="l.to"
                    class="text-gray-700 dark:text-on-surface hover:text-primary-600 dark:hover:text-primary-300 transition">
                    {{ l.label }}
                </a>
            </nav>
        </div>
    </header>

    <!-- ===== Content ===== -->
    <main>
        <slot />
    </main>

    <!-- ===== Footer ===== -->
    <footer class="mt-24 py-8 bg-surface text-on-surface/70">
        <div class="max-w-6xl mx-auto px-4 text-center text-sm">
            © {{ new Date().getFullYear() }} Daichi Okumura — All&nbsp;rights reserved.
        </div>
    </footer>
</template>
