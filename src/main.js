import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'

// Import AOS (Animate On Scroll)
import AOS from 'aos'
import 'aos/dist/aos.css'

// Import Soft UI Dashboard Styles
import "./styles/nucleo-icons.css";
import "./styles/nucleo-svg.css";
import "./styles/scss/soft-ui-dashboard.scss";
// Import Mobile-First CSS
// import "./styles/mobile-first.css";

// Import Animation System
import "./styles/animations.css";

// Import Accessibility System
import "./styles/accessibility.css";

// Import Dark Mode System
import "./styles/dark-mode.css";

import i18nPlugin from '@/plugins/i18n.js'
import en from '@/translations/en.js'
import ja from '@/translations/ja.js'
import vi from '@/translations/vi.js'

// Setup production logger để remove console logs trong production
import { setupProductionLogger } from '@/composables/useSecurity.js'
setupProductionLogger()

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Initialize i18n
app.use(i18nPlugin, {
  locale: localStorage.getItem('locale') || 'vi',
  messages: { en, ja, vi },
  availableLocales: ['en', 'ja', 'vi'],
})

// Initialize AOS globally
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  mirror: false,
})

app.mount('#app')


