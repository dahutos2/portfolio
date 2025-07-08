<script setup lang="ts">
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'
import SectionTitle from './parts/SectionTitle.vue'
import { useFetch } from '../composables/useFetch'
import type { Service } from '../types/portfolio'
import ServiceCard from './parts/ServiceCard.vue'

const { data: services, loading } = useFetch<Service[]>('services.json')
</script>

<template>
  <SectionContainer id="services">
    <SectionTitle title="What&nbsp;I&nbsp;Offer" />

    <SectionState :loading="loading" :data="services" empty-text="登録されたサービスはありません">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <ServiceCard v-for="s in services!" :key="s.title" :service="s" />
      </div>
    </SectionState>
  </SectionContainer>
</template>
