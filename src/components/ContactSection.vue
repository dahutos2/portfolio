<script setup lang="ts">
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionTitle from './parts/SectionTitle.vue'

const mailto = 'mailto:dahutos2@gmail.com?subject=お問い合わせ%20from%20Portfolio'
</script>

<template>
    <SectionContainer id="contact">
        <SectionTitle title="お問い合わせ" />

        <div class="mx-auto max-w-xl space-y-6 text-center">
            <p class="text-lg text-gray-700 dark:text-on-surface/80">
                お仕事のご相談・ご依頼はお気軽にご連絡ください。
            </p>

            <a :href="mailto" class="btn-primary inline-block">メールを送る</a>
        </div>
    </SectionContainer>
</template>
