<script setup lang="ts">
import DefaultLayout from './layouts/DefaultLayout.vue'
import HeroSection from './components/HeroSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import AboutSection from './components/AboutSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import CareerSection from './components/CareerSection.vue'
import ContactSection from './components/ContactSection.vue'
</script>
<template>
  <DefaultLayout>
    <HeroSection />
    <AboutSection />
    <ServicesSection muted />
    <ProjectsSection muted />
    <SkillsSection muted />
    <CareerSection />
    <ContactSection muted />
  </DefaultLayout>
</template>
