<script setup lang="ts">
import DefaultLayout from './layouts/DefaultLayout.vue'
import Hero from './components/Hero.vue'
import SocialProof from './components/SocialProof.vue'
import Services from './components/Services.vue'
import RepoGallery from './components/RepoGallery.vue'
import TechStack from './components/TechStack.vue'
import Timeline from './components/Timeline.vue'
import Testimonials from './components/Testimonials.vue'
import ContactSection from './components/ContactSection.vue'
</script>

<template>
  <DefaultLayout>
    <Hero />
    <SocialProof />
    <Services />
    <RepoGallery />
    <TechStack />
    <Timeline />
    <Testimonials />
    <ContactSection />
  </DefaultLayout>
</template>
