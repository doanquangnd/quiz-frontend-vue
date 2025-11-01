<template>
  <div class="app-wrapper">
    <router-view v-slot="{ Component, route }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
    <Toast />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Toast from '@/components/Toast.vue'
import { useLanguage } from '@/composables/useLanguage.js'

// Initialize language detection globally
const { current_language, detect_and_set_initial_language } = useLanguage()

onMounted(async () => {
  // Run detection on app mount (only on first visit)
  if (!localStorage.getItem('language_initialized')) {
    await detect_and_set_initial_language()
    localStorage.setItem('language_initialized', 'true')
  }
})
</script>

<style>
html, body, #app { 
  height: 100%;
  min-height: 100vh;
}

body {
  background-color: var(--dm-bg-secondary, #F8F9FA);
  transition: background-color 0.3s ease;
}

.app-wrapper {
  position: relative;
  min-height: 100vh;
}

/* Page transition - chỉ dùng opacity, không dùng absolute */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>


