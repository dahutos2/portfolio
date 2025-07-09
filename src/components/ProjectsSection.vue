<script setup lang="ts">
import { ref, computed } from 'vue'
import SectionContainer from '../layouts/SectionContainer.vue'
import SectionState from '../components/parts/SectionState.vue'
import SectionTitle from './parts/SectionTitle.vue'
import { useFetch } from '../composables/useFetch'
import type { Repo } from '../types/portfolio'
import ProjectCard from './parts/ProjectCard.vue'

const { data: repos, loading } = useFetch<Repo[]>('repos.json')

// 表示切り替え状態
const showAll = ref(false)
const LIMIT = 3

// 表示対象のリスト
const visibleRepos = computed(() => {
  return showAll.value ? repos.value ?? [] : (repos.value ?? []).slice(0, LIMIT)
})

const toggle = () => (showAll.value = !showAll.value)
</script>

<template>
  <SectionContainer id="projects">
    <SectionTitle title="制作実績" />

    <SectionState :loading="loading" :data="repos" empty-text="プロジェクトがありません">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <ProjectCard v-for="r in visibleRepos" :key="r.full_name" :repo="r" />
      </div>

      <!-- もっと見る／閉じる -->
      <div v-if="(repos?.length ?? 0) > LIMIT" class="text-center mt-6">
        <button class="btn-outline text-sm" @click="toggle">
          {{ showAll ? '閉じる' : 'もっと見る' }}
        </button>
      </div>
    </SectionState>
  </SectionContainer>
</template>
