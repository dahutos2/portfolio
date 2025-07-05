<script setup lang="ts">
import DefaultLayout from './layouts/DefaultLayout.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import SocialProof from './components/SocialProof.vue'
import TechStack from './components/TechStack.vue'
import TimelineSection from './components/TimelineSection.vue'
import AchievementsSection from './components/AchievementsSection.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import ContactSection from './components/ContactSection.vue'
</script>
<template>
  <DefaultLayout>
    <HeroSection />
    <AboutSection />
    <ServicesSection />
    <ProjectsSection />
    <SocialProof />
    <TechStack />
    <TimelineSection />
    <AchievementsSection />
    <TestimonialsSection />
    <ContactSection />
  </DefaultLayout>
</template>