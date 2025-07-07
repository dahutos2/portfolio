<script setup lang="ts">
import DefaultLayout from './layouts/DefaultLayout.vue'
import HeroSection from './components/HeroSection.vue'
import StatsSection from './components/StatsSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import AboutSection from './components/AboutSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import CareerSection from './components/CareerSection.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import ContactSection from './components/ContactSection.vue'
</script>
<template>
  <DefaultLayout>
    <HeroSection />
    <AboutSection />
    <StatsSection muted />
    <SkillsSection />
    <ServicesSection muted />
    <ProjectsSection />
    <CareerSection muted />
    <TestimonialsSection />
    <ContactSection muted />
  </DefaultLayout>
</template>
