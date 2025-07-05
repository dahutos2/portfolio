<script setup lang="ts">
import SectionContainer from '../layouts/SectionContainer.vue'
const mailto = 'mailto:dahutos2@gmail.com?subject=お問い合わせ%20from%20Portfolio'
</script>
<template>
    <SectionContainer id="contact">
        <h2 class="mb-6 text-center">お問い合わせ</h2>
        <div class="flex flex-col items-center space-y-4">
            <p class="text-lg text-gray-700 dark:text-gray-300">
                お仕事のご相談・ご依頼はお気軽にご連絡ください。
            </p>
            <a :href="mailto" class="btn-primary">メールを送る</a>
        </div>
    </SectionContainer>
</template>