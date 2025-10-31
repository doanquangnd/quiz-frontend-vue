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
      <button
        class="navbar-toggler shadow-none ms-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navigation"
        aria-controls="navigation"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon mt-2">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div class="collapse navbar-collapse" id="navigation">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <router-link
              :to="resolve_route_name('dashboard')"
              class="nav-link d-flex align-items-center me-2"
              active-class="active"
              aria-current="page"
            >
              <i
                class="fa fa-chart-pie opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              {{ $t('my_dashboard') }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="resolve_route_name('signup')" class="nav-link me-2" active-class="active">
              <i
                class="fas fa-user-circle opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              {{ $t('sign_up') }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="resolve_route_name('signin')" class="nav-link me-2" active-class="active">
              <i
                class="fas fa-key opacity-6 me-1"
                aria-hidden="true"
                :class="isBlur ? 'text-dark' : 'text-white'"
              ></i>
              {{ $t('sign_in') }}
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav d-lg-block d-none">
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
