<template>
  <!-- Navbar -->
  <nav
    class="top-0 navbar navbar-expand-lg position-absolute z-index-3"
    :class="isBlur ? isBlur : 'shadow-none my-2 navbar-transparent w-100'"
  >
    <div class="container">
      <router-link :to="resolve_route_name('welcome')" class="navbar-brand m-0">
          <div class="d-flex align-items-center">
              <Logo class="h-10 sm:h-8 md:h-10" />
          </div>
      </router-link>

      <div class="d-flex align-items-center">

        <ul class="navbar-nav">
          <li class="nav-item">
            <LanguageSwitcher />
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!-- End Navbar -->
</template>

<script setup>
import { computed } from 'vue'
import { resolve_route_name } from '@/utils/route-helper.js'
import LanguageSwitcher from "@/components/LanguageSwitcher.vue"
import Logo from "@/components/Logo.vue"

// Props
const props = defineProps({
  btnBackground: String,
  isBlur: String,
  darkMode: {
    type: Boolean,
    default: false,
  },
})
</script>
