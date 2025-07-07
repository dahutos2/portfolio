<script setup lang="ts">
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'
import SectionTitle from './parts/SectionTitle.vue'
import { useFetch } from '../composables/useFetch'
import type { Repo } from '../types/portfolio'
import ProjectCard from './parts/ProjectCard.vue'

const { data: repos, loading } = useFetch<Repo[]>('repos.json')
</script>

<template>
  <SectionContainer id="projects">
    <SectionTitle title="Selected&nbsp;Works" />

    <SectionState :loading="loading" :data="repos" empty-text="プロジェクトがありません">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <ProjectCard v-for="r in repos!" :key="r.full_name" :repo="r" />
      </div>
    </SectionState>
  </SectionContainer>
</template>
