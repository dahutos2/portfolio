<script setup lang="ts">
import { ref, nextTick, withDefaults, defineEmits } from 'vue'

/** 受け取る props */
const props = withDefaults(defineProps<{
    offset?: number          // Y 方向の固定オフセット
    showDelay?: number       // 表示遅延 ms
    hideDelay?: number       // 非表示遅延 ms
}>(), {
    offset: 72,
    showDelay: 500,
    hideDelay: 100,
})

/* 内部状態 */
const open = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const popRef = ref<HTMLElement | null>(null)
const popStyle = ref<Record<string, string>>({})

/* タイマー管理 */
let showTimer: number | null = null
let hideTimer: number | null = null
const clearShow = () => { if (showTimer) { clearTimeout(showTimer); showTimer = null } }
const clearHide = () => { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null } }

function scheduleShow() {
    clearShow(); clearHide()
    showTimer = window.setTimeout(() => {
        open.value = true
        position()
        showTimer = null
    }, props.showDelay)
}
function scheduleHide() {
    clearShow(); clearHide()
    hideTimer = window.setTimeout(() => {
        open.value = false
        hideTimer = null
    }, props.hideDelay)
}

/* ポジション計算 */
function position() {
    nextTick(() => {
        if (!triggerRef.value || !popRef.value) return
        const rect = triggerRef.value.getBoundingClientRect()
        const w = popRef.value.offsetWidth
        const m = 8
        const left = Math.max(m, Math.min(rect.left, window.innerWidth - w - m))
        popStyle.value = { top: `${props.offset}px`, left: `${left}px` }
    })
}

/* ツールチップクリックを外から拾えるようにする */
const emit = defineEmits<
    (e: 'click', ev: MouseEvent) => void
>()
</script>

<template>
    <!-- ───── トリガ + スロット ───── -->
    <div ref="triggerRef" class="relative group" @mouseenter="scheduleShow" @mouseleave="scheduleHide"
        @focusin="scheduleShow" @focusout="scheduleHide">
        <!-- アンカー用スロット -->
        <slot name="anchor" />

        <!-- ───── ポップオーバー本体 ───── -->
        <transition enter-active-class="transition transform duration-150" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition transform duration-100"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="open" ref="popRef" :style="popStyle" class="fixed z-30 max-w-[80vw] max-h-[60vh] overflow-auto
               rounded-lg border border-gray-200 dark:border-gray-700
               bg-white dark:bg-gray-900 shadow-xl p-4 text-sm
               leading-relaxed markdown-body cursor-pointer" @mouseenter="clearHide" @mouseleave="scheduleHide"
                @click="(ev) => emit('click', ev)">
                <!-- デフォルトスロット: ツールチップ内容 -->
                <slot />
            </div>
        </transition>
    </div>
</template>
