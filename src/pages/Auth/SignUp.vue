<template>
  <div>
    <navbar btn-background="bg-gradient-primary" :dark-mode="true" />
    <div
      class="pt-5 m-3 page-header align-items-start min-vh-50 pb-11 border-radius-lg"
      :style="{
        backgroundImage: 'url(/images/signup.jpg)',
      }"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="mx-auto text-center col-lg-5">
            <h1 class="mt-5 mb-2 text-white">{{ $t('welcome') }}</h1>
            <p class="text-white text-lead">
              {{ $t('welcome_to') }} {{ $t('quiz_system') }}
               
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n12 mt-md-n11 mt-n10 justify-content-center">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7">
          <div class="card z-index-0">
            <div class="pt-4 text-center card-header">
              <h5>{{ $t('register_with') }}</h5>
            </div>
            <div class="px-3 row px-xl-5 px-sm-4">
              <div class="px-1 col-3 ms-auto">
                <a class="btn btn-outline-light w-100" href="javascript:;">
                  <svg
                    width="24px"
                    height="32px"
                    viewBox="0 0 64 64"
                    version="1.1"
                  >
                    <g
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                    >
                      <g
                        transform="translate(3.000000, 3.000000)"
                        fill-rule="nonzero"
                      >
                        <circle
                          fill="#3C5A9A"
                          cx="29.5091719"
                          cy="29.4927506"
                          r="29.4882047"
                        />
                        <path
                          d="M39.0974944,9.05587273 L32.5651312,9.05587273 C28.6886088,9.05587273 24.3768224,10.6862851 24.3768224,16.3054653 C24.395747,18.2634019 24.3768224,20.1385313 24.3768224,22.2488655 L19.8922122,22.2488655 L19.8922122,29.3852113 L24.5156022,29.3852113 L24.5156022,49.9295284 L33.0113092,49.9295284 L33.0113092,29.2496356 L38.6187742,29.2496356 L39.1261316,22.2288395 L32.8649196,22.2288395 C32.8649196,22.2288395 32.8789377,19.1056932 32.8649196,18.1987181 C32.8649196,15.9781412 35.1755132,16.1053059 35.3144932,16.1053059 C36.4140178,16.1053059 38.5518876,16.1085101 39.1006986,16.1053059 L39.1006986,9.05587273 L39.0974944,9.05587273 L39.0974944,9.05587273 Z"
                          fill="#FFFFFF"
                        />
                      </g>
                    </g>
                  </svg>
                </a>
              </div>
              <div class="px-1 col-3">
                <a class="btn btn-outline-light w-100" href="javascript:;">
                  <svg
                    width="24px"
                    height="32px"
                    viewBox="0 0 64 64"
                    version="1.1"
                  >
                    <g
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                    >
                      <g
                        transform="translate(7.000000, 0.564551)"
                        fill="#000000"
                        fill-rule="nonzero"
                      >
                        <path
                          d="M40.9233048,32.8428307 C41.0078713,42.0741676 48.9124247,45.146088 49,45.1851909 C48.9331634,45.4017274 47.7369821,49.5628653 44.835501,53.8610269 C42.3271952,57.5771105 39.7241148,61.2793611 35.6233362,61.356042 C31.5939073,61.431307 30.2982233,58.9340578 25.6914424,58.9340578 C21.0860585,58.9340578 19.6464932,61.27947 15.8321878,61.4314159 C11.8738936,61.5833617 8.85958554,57.4131833 6.33064852,53.7107148 C1.16284874,46.1373849 -2.78641926,32.3103122 2.51645059,22.9768066 C5.15080028,18.3417501 9.85858819,15.4066355 14.9684701,15.3313705 C18.8554146,15.2562145 22.5241194,17.9820905 24.9003639,17.9820905 C27.275104,17.9820905 31.733383,14.7039812 36.4203248,15.1854154 C38.3824403,15.2681959 43.8902255,15.9888223 47.4267616,21.2362369 C47.1417927,21.4153043 40.8549638,25.1251794 40.9233048,32.8428307 M33.3504628,10.1750144 C35.4519466,7.59650964 36.8663676,4.00699306 36.4804992,0.435448578 C33.4513624,0.558856931 29.7884601,2.48154382 27.6157341,5.05863265 C25.6685547,7.34076135 23.9632549,10.9934525 24.4233742,14.4943068 C27.7996959,14.7590956 31.2488715,12.7551531 33.3504628,10.1750144"
                        />
                      </g>
                    </g>
                  </svg>
                </a>
              </div>
              <div class="px-1 col-3 me-auto">
                <a class="btn btn-outline-light w-100" href="javascript:;">
                  <svg
                    width="24px"
                    height="32px"
                    viewBox="0 0 64 64"
                    version="1.1"
                  >
                    <g
                      stroke="none"
                      stroke-width="1"
                      fill="none"
                      fill-rule="evenodd"
                    >
                      <g
                        transform="translate(3.000000, 2.000000)"
                        fill-rule="nonzero"
                      >
                        <path
                          d="M57.8123233,30.1515267 C57.8123233,27.7263183 57.6155321,25.9565533 57.1896408,24.1212666 L29.4960833,24.1212666 L29.4960833,35.0674653 L45.7515771,35.0674653 C45.4239683,37.7877475 43.6542033,41.8844383 39.7213169,44.6372555 L39.6661883,45.0037254 L48.4223791,51.7870338 L49.0290201,51.8475849 C54.6004021,46.7020943 57.8123233,39.1313952 57.8123233,30.1515267"
                          fill="#4285F4"
                        />
                        <path
                          d="M29.4960833,58.9921667 C37.4599129,58.9921667 44.1456164,56.3701671 49.0290201,51.8475849 L39.7213169,44.6372555 C37.2305867,46.3742596 33.887622,47.5868638 29.4960833,47.5868638 C21.6960582,47.5868638 15.0758763,42.4415991 12.7159637,35.3297782 L12.3700541,35.3591501 L3.26524241,42.4054492 L3.14617358,42.736447 C7.9965904,52.3717589 17.959737,58.9921667 29.4960833,58.9921667"
                          fill="#34A853"
                        />
                        <path
                          d="M12.7159637,35.3297782 C12.0932812,33.4944915 11.7329116,31.5279353 11.7329116,29.4960833 C11.7329116,27.4640054 12.0932812,25.4976752 12.6832029,23.6623884 L12.6667095,23.2715173 L3.44779955,16.1120237 L3.14617358,16.2554937 C1.14708246,20.2539019 0,24.7439491 0,29.4960833 C0,34.2482175 1.14708246,38.7380388 3.14617358,42.736447 L12.7159637,35.3297782"
                          fill="#FBBC05"
                        />
                        <path
                          d="M29.4960833,11.4050769 C35.0347044,11.4050769 38.7707997,13.7975244 40.9011602,15.7968415 L49.2255853,7.66898166 C44.1130815,2.91684746 37.4599129,0 29.4960833,0 C17.959737,0 7.9965904,6.62018183 3.14617358,16.2554937 L12.6832029,23.6623884 C15.0758763,16.5505675 21.6960582,11.4050769 29.4960833,11.4050769"
                          fill="#EB4335"
                        />
                      </g>
                    </g>
                  </svg>
                </a>
              </div>
              <div class="mt-2 position-relative text-center">
                <p
                  class="text-sm font-weight-bold mb-2 text-secondary text-border d-inline z-index-2 bg-white px-3"
                >
                  or
                </p>
              </div>
            </div>
            <div class="card-body">
              <form role="form" @submit.prevent="register">
                <div class="mb-3">
                  <input
                    id="name"
                    type="text"
                    class="form-control"
                    placeholder="Name"
                    aria-label="Name"
                    name="name"
                    required
                    v-model="form.name"
                  />
                  <div v-if="errors.name" class="text-danger text-sm mt-1">{{ errors.name }}</div>
                </div>
                <div class="mb-3">
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    placeholder="Email"
                    aria-label="Email"
                    name="email"
                    required
                    v-model="form.email"
                  />
                  <div v-if="errors.email" class="text-danger text-sm mt-1">{{ errors.email }}</div>
                </div>
                <div class="mb-3">
                  <div class="position-relative">
                    <input
                      id="password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control pe-5"
                      placeholder="Password"
                      aria-label="Password"
                      name="password"
                      required
                      v-model="form.password"
                    />
                    <i 
                      :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                      class="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer text-muted"
                      @click="showPassword = !showPassword"
                      style="cursor: pointer; user-select: none;"
                    ></i>
                  </div>
                  <div v-if="errors.password" class="text-danger text-sm mt-1">{{ errors.password }}</div>
                </div>
                <div class="mb-3">
                  <div class="position-relative">
                    <input
                      id="password_confirmation"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="form-control pe-5"
                      placeholder="Confirm Password"
                      aria-label="Confirm Password"
                      name="password_confirmation"
                      required
                      v-model="form.password_confirmation"
                    />
                    <i 
                      :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                      class="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer text-muted"
                      @click="showConfirmPassword = !showConfirmPassword"
                      style="cursor: pointer; user-select: none;"
                    ></i>
                  </div>
                  <div v-if="errors.password_confirmation" class="text-danger text-sm mt-1">{{ errors.password_confirmation }}</div>
                </div>
                <div class="form-check">
                  <input
                    id="flexCheckDefault"
                    type="checkbox"
                    class="form-check-input"
                    v-model="form.agree"
                  />
                  <label class="form-check-label" for="flexCheckDefault">
                    {{ $t('agree_to_terms') }}
                    <a href="javascript:;" class="text-dark font-weight-bolder"
                      >{{ $t('terms_and_conditions') }}</a
                    >
                  </label>
                </div>
                <div v-if="errors.agree" class="text-danger text-sm mt-1">{{ errors.agree }}</div>
                
                <!-- Turnstile -->
                <TurnstileWidget
                  v-if="turnstileEnabled && turnstileSiteKey"
                  :key="`turnstile-${turnstileSiteKey}`"
                  ref="turnstileWidget"
                  :site-key="turnstileSiteKey"
                  :theme="turnstileTheme"
                  @verified="onTurnstileVerified"
                  @error="onTurnstileError"
                  @expired="onTurnstileExpired"
                />
                <div v-if="errors.turnstile" class="text-danger text-sm mt-1">{{ errors.turnstile }}</div>

                <div class="text-center">
                  <button
                    type="submit"
                    class="btn btn-dark btn-lg w-100 my-4 mb-2"
                    :disabled="processing"
                  >
                    <span v-if="processing">
                      <i class="fas fa-spinner fa-spin mr-2"></i>
                      {{ $t('signing_up') }}
                    </span>
                    <span v-else>{{ $t('sign_up') }}</span>
                  </button>
                </div>
                 <p class="text-sm mt-3 mb-0">
                   {{ $t('already_have_account') }}
                   <router-link
                     :to="resolve_route_name('signin')"
                     class="text-dark font-weight-bolder"
                   >
                     {{ $t('sign_in') }}
                   </router-link>
                 </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-footer />
    
    <!-- Toast Container for Auth Pages -->
    <Toast />
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
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

// SEO Setup - Auto-detect language
const { locale } = useTranslation()
const init_seo = () => {
  let configs
  if (locale.value === 'en') {
    configs = SEO_CONFIGS_EN
  } else if (locale.value === 'ja') {
    configs = SEO_CONFIGS_JA
  } else {
    configs = SEO_CONFIGS
  }
  useSeo(configs.signup)
}
init_seo()
const app_store = useAppStore()
const auth_store = useAuthStore()
const toast = useToastStore()
const { initializeDarkMode } = useDarkMode()
// State
const processing = ref(false)
const errors = ref({})
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const turnstile_widget = ref(null)

// Turnstile config from environment variables
const turnstileEnabled = ref(import.meta.env.VITE_TURNSTILE_ENABLED === 'true')
const turnstileSiteKey = ref(import.meta.env.VITE_TURNSTILE_SITE_KEY || '')
const turnstileTheme = ref(import.meta.env.VITE_TURNSTILE_THEME || 'auto')

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  agree: false
})

// Turnstile Callbacks
const onTurnstileVerified = () => {}
const onTurnstileError = () => {
  toast.error('CAPTCHA verification failed. Please try again.')
}
const onTurnstileExpired = () => {}

// Đăng ký
const register = async () => {
  // Clear previous errors
  errors.value = {}
  auth_store.clear_error()

  // Validate form
  if (!form.value.name) {
    errors.value.name = 'Tên là bắt buộc'
    return
  }
  if (!form.value.email) {
    errors.value.email = 'Email là bắt buộc'
    return
  }
  if (!form.value.password) {
    errors.value.password = 'Mật khẩu là bắt buộc'
    return
  }
  if (form.value.password.length < 8) {
    errors.value.password = 'Mật khẩu phải có ít nhất 8 ký tự'
    return
  }
  if (form.value.password !== form.value.password_confirmation) {
    errors.value.password_confirmation = 'Mật khẩu xác nhận không khớp'
    return
  }
  if (!form.value.agree) {
    errors.value.agree = 'Bạn phải đồng ý với điều khoản'
    return
  }

  processing.value = true

  try {
    // Get Turnstile token if enabled
    const turnstile_token = turnstileEnabled.value && turnstile_widget.value 
      ? turnstile_widget.value.getToken() 
      : null
    
    // Call auth store register
    const result = await auth_store.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      turnstile_token: turnstile_token
    })

    if (result.success) {
      toast.success('Đăng ký thành công!')
      
      // Redirect based on email type
      if (result.is_internal) {
        // Internal email - redirect to dashboard
        router.push('/dashboard')
      } else {
        // External email - redirect to thank you page
        router.push('/thank-you')
      }
    } else {
      // Handle validation errors
      if (result.error && typeof result.error === 'object') {
        errors.value = result.error
      } else {
        toast.error(result.error || 'Đăng ký thất bại')
      }
    }
  } catch (error) {
    console.error('Register error:', error)
    toast.error('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.')
  } finally {
    processing.value = false
  }
}

// Lifecycle
onMounted(() => {
  initializeDarkMode()
  app_store.toggleEveryDisplay()
  app_store.toggleHideConfig()
  
})

onBeforeUnmount(() => {
  initializeDarkMode()
  app_store.toggleEveryDisplay()
  app_store.toggleHideConfig()
})
</script>
  