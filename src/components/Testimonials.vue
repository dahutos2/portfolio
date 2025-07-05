<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import Swiper from 'swiper'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import type { Testimonial } from '../types/portfolio'
import { fetchData } from '../lib/fetchData'

const tes = ref<Testimonial[]>([])

onMounted(async () => {
    // JSON を取得
    tes.value = await fetchData<Testimonial[]>("testimonials.json")

    // DOM が描画されてから Swiper を初期化
    await nextTick()
    new Swiper('#testimonial-swiper', { // NOSONAR
        modules: [Autoplay],
        loop: true,
        autoplay: { delay: 5000 }
    })
})
</script>

<template>
    <SectionContainer v-if="tes.length">
        <h2 class="text-2xl font-bold mb-6">Testimonials</h2>
        <div class="swiper-container" id="testimonial-swiper">
            <div class="swiper-wrapper">
                <div class="swiper-slide p-6" v-for="t in tes" :key="t.author">
                    <p class="italic">“{{ t.quote }}”</p>
                    <p class="mt-4 font-semibold">{{ t.author }}</p>
                </div>
            </div>
        </div>
    </SectionContainer>
</template>
