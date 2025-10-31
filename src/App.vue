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
import Toast from '@/components/Toast.vue'
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


