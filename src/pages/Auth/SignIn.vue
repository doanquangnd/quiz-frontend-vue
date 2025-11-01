<template>
  <div>
      <div class="container top-0 position-sticky z-index-sticky">
        <div class="row">
          <div class="col-12">
            <navbar
              is-blur="blur blur-rounded my-3 py-2 start-0 end-0 mx-4 shadow"
              btn-background="bg-gradient-success"
            />
          </div>
        </div>
      </div>
    
      <main class="mt-0 main-content main-content-bg">
        <section>
          <div class="page-header pb-3 min-vh-75">
            <div class="container">
              <div class="row">
                <div class="mx-auto col-xl-4 col-lg-5 col-md-6 d-flex flex-column">
                  <div class="mt-8 card card-plain">
                    <div class="pb-0 card-header text-start">
                      <h3 class="font-weight-bolder text-success text-gradient">
                        {{ $t("sign_in_to_account") }}
                      </h3>
                      <p class="mb-0">
                        {{ $t("enter_your_email_and_password_to_sign_in") }}
                      </p>
                    </div>
    
                    <div class="card-body">
                      <form @submit.prevent="login">
                        <!-- Email -->
                        <label>{{ $t("email_address") }}</label>
                        <input
                          type="email"
                          class="form-control"
                          :placeholder="$t('email_address')"
                          v-model="form.email"
                          required
                        />
                        <div v-if="errors.email" class="text-danger text-sm mt-1">{{ errors.email }}</div>
    
                        <!-- Password -->
                        <label>{{ $t("password") }}</label>
                        <div class="position-relative">
                          <input
                            :type="showPassword ? 'text' : 'password'"
                            class="form-control pe-5"
                            :placeholder="$t('password')"
                            v-model="form.password"
                            required
                            autocomplete="current-password"
                          />
                          <i 
                            :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                            class="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer text-muted"
                            @click="showPassword = !showPassword"
                            style="cursor: pointer; user-select: none;"
                          ></i>
                        </div>
                        <div v-if="errors.password" class="text-danger text-sm mt-1">{{ errors.password }}</div>
    
                        <!-- Remember -->
                        <div class="form-check form-switch mt-3">
                          <input id="rememberMe" type="checkbox" class="form-check-input" v-model="form.remember" />
                          <label class="form-check-label" for="rememberMe">
                            {{ $t("remember_me") }}
                          </label>
                        </div>
    
                        <!-- Turnstile -->
                        <TurnstileWidget
                          v-if="turnstile_enabled && turnstile_site_key"
                          :key="`turnstile-${turnstile_site_key}`"
                          ref="turnstile_widget"
                          :site-key="turnstile_site_key"
                          :theme="turnstile_theme"
                          @verified="onTurnstileVerified"
                          @error="onTurnstileError"
                          @expired="onTurnstileExpired"
                        />
    
                        <div v-if="errors.turnstile" class="text-danger text-sm mt-1">
                          {{ errors.turnstile }}
                        </div>
    
                        <!-- Submit -->
                        <div class="text-center">
                          <button
                            type="submit"
                            class="btn btn-success btn-lg w-100 my-4 mb-2"
                            :disabled="processing"
                          >
                            <span v-if="processing">
                              <i class="fas fa-spinner fa-spin mr-2"></i>
                              {{ $t("signing_in") }}
                            </span>
                            <span v-else>{{ $t("sign_in") }}</span>
                          </button>
                        </div>
                      </form>
                    </div>
    
                    <div class="px-1 pt-0 text-center card-footer px-lg-2">
                      <p class="mx-auto mb-4 text-sm">
                        {{ $t("dont_have_account") }}
                        <router-link :to="resolve_route_name('signup')" class="text-success text-gradient font-weight-bold">
                          {{ $t("sign_up") }}
                        </router-link>
                      </p>
                    </div>
                  </div>
                </div>
    
                <!-- Background -->
                <div class="col-md-6">
                  <div class="top-0 oblique position-absolute h-100 d-md-block d-none me-n8">
                    <div
                      class="bg-cover oblique-image position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6"
                      :style="{ backgroundImage: 'url(/images/signin.jpg)' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    
      <app-footer />
      <Toast />
  </div>
  </template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { resolve_route_name } from '@/utils/route-helper.js'
import Navbar from '@/pages/Auth/Components/Navbar.vue'
import AppFooter from '@/pages/Auth/Components/Footer.vue'
import TurnstileWidget from '@/components/TurnstileWidget.vue'
import Toast from '@/components/Toast.vue'
import { useAppStore } from '@/stores/app.js'
import { useAuthStore } from '@/stores/auth.js'
import { useToastStore } from '@/stores/toast.js'
import { http } from '@/api/http-client.js'
import { useDarkMode } from "@/composables/useDarkMode"
import { useSeo, SEO_CONFIGS } from '@/composables/useSeo.js'
import { SEO_CONFIGS_EN } from '@/composables/useSeo.en.js'
import { SEO_CONFIGS_JA } from '@/composables/useSeo.ja.js'
import { useTranslation } from '@/composables/useTranslation';
// Router & Stores
const router = useRouter()
const route = useRoute()
const app_store = useAppStore()
const auth_store = useAuthStore()
const toast = useToastStore()
const { initializeDarkMode } = useDarkMode()
const { locale } = useTranslation()

// SEO Setup - Auto-detect language and apply appropriate SEO
const init_seo = () => {
  let configs
  if (locale.value === 'en') {
    configs = SEO_CONFIGS_EN
  } else if (locale.value === 'ja') {
    configs = SEO_CONFIGS_JA
  } else {
    configs = SEO_CONFIGS // Vietnamese
  }
  useSeo(configs.signin)
}
init_seo()
// State
const processing = ref(false)
const errors = ref({})
const showPassword = ref(false)
const turnstile_widget = ref(null)

// Turnstile config from environment variables
const turnstile_enabled = ref(import.meta.env.VITE_TURNSTILE_ENABLED === 'true')
const turnstile_site_key = ref(import.meta.env.VITE_TURNSTILE_SITE_KEY || '')
const turnstile_theme = ref(import.meta.env.VITE_TURNSTILE_THEME || 'auto')

const form = ref({
  email: '',
  password: '',
  remember: false
})

// Turnstile Callbacks
const onTurnstileVerified = () => {}
const onTurnstileError = () => {
  toast.error('Xác thực CAPTCHA thất bại. Vui lòng thử lại.')
}
const onTurnstileExpired = () => {}

// 🔐 Đăng nhập
const login = async () => {
  // Clear previous errors
  errors.value = {}
  auth_store.clear_error()

  // Validate form
  if (!form.value.email) {
    errors.value.email = 'Email là bắt buộc'
    return
  }
  if (!form.value.password) {
    errors.value.password = 'Mật khẩu là bắt buộc'
    return
  }

  processing.value = true

  try {
    // Get Turnstile token if enabled
    const turnstile_token = turnstile_enabled.value && turnstile_widget.value 
      ? turnstile_widget.value.getToken() 
      : null
    
    // Call auth store login
    const result = await auth_store.login({
      email: form.value.email,
      password: form.value.password,
      remember: form.value.remember,
      turnstile_token: turnstile_token
    })

    if (result.success) {
      toast.success('Đăng nhập thành công!')
      
      // Redirect to intended page or dashboard
      const redirect_to = route.query.redirect || '/dashboard'
      router.push(redirect_to)
    } else {
      // Handle validation errors
      if (result.error && typeof result.error === 'object') {
        errors.value = result.error
      } else {
        toast.error(result.error || 'Đăng nhập thất bại')
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    toast.error('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.')
  } finally {
    processing.value = false
  }
}

// Lifecycle
onMounted(() => {
  app_store.toggleEveryDisplay()
  app_store.toggleHideConfig()
  document.body.classList.remove('bg-gray-100')
  initializeDarkMode()
})

onBeforeUnmount(() => {
  app_store.toggleEveryDisplay()
  app_store.toggleHideConfig()
  document.body.classList.add('bg-gray-100')
  initializeDarkMode()
})
</script>
  <style>
    .dark .page-header {
      background-color: #90a2d1;
    }
  </style>