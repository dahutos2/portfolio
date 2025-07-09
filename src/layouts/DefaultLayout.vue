<script setup lang="ts">
import { ref } from 'vue'
// メニュー開閉フラグ
const open = ref(false)
const toggle = () => (open.value = !open.value)
const close = () => (open.value = false)

const links = [
    { label: 'トップ', to: '#top' },
    { label: '自己紹介', to: '#about' },
    { label: 'サービス内容', to: '#services' },
    { label: '実績', to: '#projects' },
    { label: 'スキル', to: '#skills' },
    { label: '経歴', to: '#career' },
    { label: 'お問い合わせ', to: '#contact' },
]
</script>

<template>
    <!-- ===== Header ===== -->
    <header class="sticky top-0 z-50 backdrop-blur
           bg-white/80 border-b border-gray-100
           dark:bg-surface/80 dark:border-surface-muted">
        <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
            <!-- Logo -->
            <a href="#top" class="text-primary-600 dark:text-primary-400 font-semibold text-lg tracking-tight">
                Okumura.dev
            </a>

            <!-- Hamburger -->
            <button class="md:hidden p-2 rounded
               text-gray-700 dark:text-on-surface
               hover:text-primary-600 dark:hover:text-primary-300
               focus-visible:outline-none
               focus-visible:ring-2 focus-visible:ring-primary-500" @click="toggle" aria-label="Toggle main menu"
                :aria-expanded="open" aria-controls="mobile-nav">
                <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <!-- PC Nav -->
            <nav class="hidden md:flex space-x-6" aria-label="Main navigation">
                <a v-for="l in links" :key="l.to" :href="l.to"
                    class="text-gray-700 dark:text-on-surface hover:text-primary-600 dark:hover:text-primary-300 transition">
                    {{ l.label }}
                </a>
            </nav>
        </div>

        <!-- ===== Mobile Nav (absolute) ===== -->
        <Transition enter-active-class="transition transform ease-out duration-300"
            enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition transform ease-in duration-200" leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2">
            <nav v-if="open" id="mobile-nav" aria-label="Mobile navigation" class="md:hidden absolute inset-x-0 top-14 z-40
               bg-white dark:bg-surface border-t border-gray-100 dark:border-surface-muted shadow">
                <ul class="flex flex-col px-4 py-3 space-y-2">
                    <li v-for="l in links" :key="l.to">
                        <a :href="l.to" @click="close" class="block text-gray-700 dark:text-on-surface
                     hover:text-primary-600 dark:hover:text-primary-300">
                            {{ l.label }}
                        </a>
                    </li>
                </ul>
            </nav>
        </Transition>
    </header>

    <!-- ===== Content ===== -->
    <main>
        <slot />
    </main>

    <!-- ===== Footer ===== -->
    <footer class="mt-24 py-8 bg-surface text-on-surface/70">
        <div class="max-w-6xl mx-auto px-4 text-center text-sm">
            © {{ new Date().getFullYear() }} Daichi Okumura — All&nbsp;rights&nbsp;reserved.
        </div>
    </footer>
</template>
