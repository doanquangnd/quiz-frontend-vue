/**
 * useLanguage Composable
 * 
 * Quản lý ngôn ngữ của application với auto-detect theo geolocation
 */

import { ref, computed, watch } from 'vue'
import { currentLocale } from '@/plugins/i18n.js'
import { http } from '@/api/http-client.js'

// Current language state
const current_language = ref(get_initial_language())

// Sync current_language with i18n locale AND HTML lang attribute
watch(current_language, (new_lang) => {
  // 1. Update i18n locale
  currentLocale.value = new_lang
  
  // 2. Update HTML lang attribute
  const lang_map = { 'vi': 'vi', 'en': 'en', 'ja': 'ja' }
  document.documentElement.lang = lang_map[new_lang] || 'en'
  
  // 3. Update localStorage locale for i18n plugin
  localStorage.setItem('locale', new_lang)
}, { immediate: true })

/**
 * Map country code to language
 */
const COUNTRY_TO_LANGUAGE = {
  'VN': 'vi',  // Vietnam → Vietnamese
  'JP': 'ja',  // Japan → Japanese
  // English-speaking countries
  'US': 'en',  // United States
  'GB': 'en',  // United Kingdom
  'AU': 'en',  // Australia
  'CA': 'en',  // Canada
  'NZ': 'en',  // New Zealand
  'SG': 'en',  // Singapore
  'MY': 'en',  // Malaysia
  'PH': 'en',  // Philippines
  'IN': 'en',  // India
  // Add more as needed
}

/**
 * Get language from geolocation (Cloudflare header)
 */
async function get_language_from_geolocation() {
  try {
    // Use http client để gọi đúng backend URL (không phải frontend URL)
    const response = await http.get('/api/geolocation')
    
    if (response.data?.success) {
      const country_code = response.data.data?.country_code
      
      if (country_code && COUNTRY_TO_LANGUAGE[country_code]) {
        return COUNTRY_TO_LANGUAGE[country_code]
      }
    }
  } catch (error) {
    // Silent fail - fallback to browser language
  }
  
  return null
}

/**
 * Get initial language from localStorage or browser
 */
function get_initial_language() {
  // Priority 1: User's saved preference (highest priority)
  const stored = localStorage.getItem('language')
  if (stored && ['vi', 'en', 'ja'].includes(stored)) {
    return stored
  }
  
  // Priority 2: Geolocation (will be detected async later in App.vue)
  
  // Priority 3: Browser language (used immediately while waiting for geolocation)
  const browser_lang = navigator.language || navigator.userLanguage
  
  if (browser_lang) {
    const lang_code = browser_lang.toLowerCase().split('-')[0]
    
    if (lang_code === 'vi') return 'vi'
    if (lang_code === 'ja') return 'ja'
    if (lang_code === 'en') return 'en'
  }
  
  // Priority 4: Default to English (international default)
  return 'en'
}

/**
 * Detect and set language on first visit
 */
async function detect_and_set_initial_language() {
  // If user already has preference, respect it
  const saved_lang = localStorage.getItem('language')
  if (saved_lang && ['vi', 'en', 'ja'].includes(saved_lang)) {
    return // Already set in get_initial_language()
  }
  
  // Try geolocation detection
  const geo_lang = await get_language_from_geolocation()
  
  if (geo_lang && ['vi', 'en', 'ja'].includes(geo_lang)) {
    // Geolocation detected - use it (may override browser language)
    set_language(geo_lang, false) // Don't save yet - let user confirm
  }
  // Else: Keep browser language (already set in get_initial_language)
}

/**
 * Set language
 */
function set_language(lang, save_preference = true) {
  if (!['vi', 'en', 'ja'].includes(lang)) {
    lang = 'en'
  }
  
  current_language.value = lang
  
  // Save to localStorage only if user explicitly chose it
  if (save_preference) {
    localStorage.setItem('language', lang)
  }
  
  // Update HTML lang attribute
  const html_lang_map = {
    'vi': 'vi',
    'en': 'en',
    'ja': 'ja',
  }
  document.documentElement.lang = html_lang_map[lang] || 'en'
}

/**
 * Toggle language
 */
function toggle_language() {
  const new_lang = current_language.value === 'en' ? 'vi' : 'en'
  set_language(new_lang)
}

/**
 * Main composable
 */
export function useLanguage() {
  // Computed properties
  const is_vietnamese = computed(() => current_language.value === 'vi')
  const is_english = computed(() => current_language.value === 'en')
  const is_japanese = computed(() => current_language.value === 'ja')
  const locale = computed(() => {
    const locale_map = {
      'vi': 'vi_VN',
      'en': 'en_US',
      'ja': 'ja_JP',
    }
    return locale_map[current_language.value] || 'en_US'
  })
  
  // Watch language changes
  watch(current_language, (new_lang) => {
    // Trigger any side effects when language changes
    // For example: reload i18n, update SEO, etc.
  })
  
  return {
    // State
    current_language,
    
    // Computed
    is_vietnamese,
    is_english,
    is_japanese,
    locale,
    
    // Methods
    set_language,
    toggle_language,
    detect_and_set_initial_language,
  }
}

/**
 * Get language name
 */
export function get_language_name(lang) {
  const names = {
    vi: 'Tiếng Việt',
    en: 'English',
    ja: '日本語',
  }
  return names[lang] || names.en
}

/**
 * Available languages
 */
export const AVAILABLE_LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', locale: 'vi_VN' },
  { code: 'en', name: 'English', flag: '🇺🇸', locale: 'en_US' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', locale: 'ja_JP' },
]

/**
 * Get language name from code
 */
export function get_language_display_name(lang_code) {
  const lang = AVAILABLE_LANGUAGES.find(l => l.code === lang_code)
  return lang ? lang.name : 'English'
}

