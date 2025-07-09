<script setup lang="ts">
defineProps<{ id: string; muted?: boolean }>()
</script>

<template>
    <section :id="id" :class="[muted ? 'section-muted' : 'section-light', 'py-24']">
        <div class="max-w-7xl mx-auto px-4 md:px-6">
            <slot />
        </div>
    </section>
</template>
