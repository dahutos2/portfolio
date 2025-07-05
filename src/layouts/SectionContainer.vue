<script setup lang="ts">
defineProps<{ id: string }>()
</script>
<template>
    <section :id="id" class="py-24">
        <div class="max-w-6xl mx-auto px-4">
            <slot />
        </div>
    </section>
</template>