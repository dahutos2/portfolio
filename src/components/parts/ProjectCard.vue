<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { Repo } from '../../types/portfolio'
const props = defineProps<{ repo: Repo }>()
const open = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)
const popStyle = ref<Record<string, string>>({})
const OFFSET_PX = 72
function show() {
  open.value = true; nextTick(() => {
    if (!triggerRef.value || !popoverRef.value) return;
    const rect = triggerRef.value.getBoundingClientRect();
    const w = popoverRef.value.offsetWidth;
    let left = rect.left; const m = 8;
    const max = window.innerWidth - w - m;
    if (left > max) left = max;
    if (left < m) left = m;
    popStyle.value = { top: `${OFFSET_PX}px`, left: `${left}px` };
  });
}
function hide() { open.value = false }
function toggle() { open.value ? hide() : show() }
</script>
<template>
  <a ref="triggerRef" :href="`https://github.com/${props.repo.full_name}`" target="_blank" class="card-base group"
    @mouseenter="show" @mouseleave="hide" @focus="show" @blur="hide" @click="toggle">
    <h3 class="text-lg font-semibold mb-2 group-hover:text-primary-500 transition">
      {{ props.repo.full_name }}
    </h3>
    <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
      {{ props.repo.description }}
    </p>
    <div class="flex justify-between text-sm">
      <span>{{ props.repo.lang }}</span>
      <span>⭐ {{ props.repo.stars }}</span>
    </div>
  </a>
  <transition enter-active-class="transition transform duration-150" enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100" leave-active-class="transition transform duration-100"
    leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
    <div v-if="open" ref="popoverRef" :style="popStyle" class="fixed z-30 max-w-[80vw] max-h-[60vh] overflow-auto
      rounded-lg border border-gray-200 dark:border-gray-700
      bg-white dark:bg-gray-900 shadow-xl p-4 text-sm
      leading-relaxed markdown-body" @mouseenter="show" @mouseleave="hide">
      <div v-html="props.repo.html" />
    </div>
  </transition>
</template>