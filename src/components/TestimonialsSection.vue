<script setup lang="ts">
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'
import SectionTitle from './parts/SectionTitle.vue'
import { useFetch } from '../composables/useFetch'
import type { Testimonial } from '../types/portfolio'
import TestimonialCard from './parts/TestimonialCard.vue'

const { data: testimonials, loading } = useFetch<Testimonial[]>('testimonials.json')
</script>

<template>
  <SectionContainer id="testimonials">
    <SectionTitle title="Voices" />

    <SectionState :loading="loading" :data="testimonials" empty-text="推薦がありません">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <TestimonialCard v-for="t in testimonials!" :key="t.author" :testimonial="t" />
      </div>
    </SectionState>
  </SectionContainer>
</template>
