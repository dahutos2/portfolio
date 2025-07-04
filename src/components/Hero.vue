<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NButton, NAvatar, NSpace } from 'naive-ui'
const user = ref<any>()
onMounted(async () => user.value = await (await fetch('/data/user.json')).json())
</script>

<template>
    <SectionContainer id="home" v-if="user" class="pt-24">
        <NSpace align="center" size="large">
            <NAvatar :src="user.avatar" round size="medium" />
            <div>
                <h1 class="text-4xl font-extrabold">{{ user.name }}</h1>
                <p class="mt-2 max-w-xl">{{ user.bio }}</p>
                <NSpace class="mt-4">
                    <NButton tag="a" href="#contact" type="primary" size="large">Contact</NButton>
                    <NButton tag="a" :href="user.blog" size="large" tertiary>Blog</NButton>
                </NSpace>
            </div>
        </NSpace>
    </SectionContainer>
</template>
