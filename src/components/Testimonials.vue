<script setup lang="ts">
import { ref, onMounted } from 'vue'
const tes = ref<any[]>([])
onMounted(async () => tes.value = await (await fetch('/data/testimonials.json')).json())
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

<script setup>
// Swiper CDN を index.html で読み込む
import Swiper from 'swiper'
import 'swiper/css'
onMounted(()=> new Swiper('#testimonial-swiper',{loop:true,autoplay:{delay:5000}}))
</script>
