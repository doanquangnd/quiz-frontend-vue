/**
 * useLanguage Composable
 * 
 * Quản lý ngôn ngữ của application với auto-detect theo geolocation
 */

import { ref, computed, watch } from 'vue'
import { currentLocale } from '@/plugins/i18n.js'

// Current language state
const current_language = ref(get_initial_language())

// Sync current_language with i18n locale
watch(current_language, (new_lang) => {
  currentLocale.value = new_lang
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
    // Try to get country from backend API (which has Cloudflare headers)
    const response = await fetch('/api/geolocation', {
      method: 'GET',
      credentials: 'include',
    })
    
    if (response.ok) {
      const data = await response.json()
      const country_code = data.country_code
      
      if (country_code && COUNTRY_TO_LANGUAGE[country_code]) {
        return COUNTRY_TO_LANGUAGE[country_code]
      }
    }
  } catch (error) {
    console.log('Geolocation detection failed, using fallback')
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
  
  // Priority 2: Geolocation (will be detected async later)
  // Priority 3: Browser language
  const browser_lang = navigator.language || navigator.userLanguage
  if (browser_lang) {
    if (browser_lang.startsWith('vi')) return 'vi'
    if (browser_lang.startsWith('ja')) return 'ja'
    if (browser_lang.startsWith('en')) return 'en'
  }
  
  // Priority 4: Default to Vietnamese
  return 'vi'
}

/**
 * Detect and set language on first visit
 */
async function detect_and_set_initial_language() {
  // If user already has preference, respect it
  if (localStorage.getItem('language')) {
    return
  }
  
  // Try geolocation detection
  const geo_lang = await get_language_from_geolocation()
  
  if (geo_lang && ['vi', 'en', 'ja'].includes(geo_lang)) {
    // Use set_language to properly update everything (current_language + i18n + HTML)
    set_language(geo_lang, false) // false = don't save to localStorage yet
  }
}

/**
 * Set language
 */
function set_language(lang, save_preference = true) {
  if (!['vi', 'en', 'ja'].includes(lang)) {
    console.warn(`Invalid language: ${lang}. Using 'vi' instead.`)
    lang = 'vi'
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
  document.documentElement.lang = html_lang_map[lang] || 'vi'
}

/**
 * Toggle language
 */
function toggle_language() {
  const new_lang = current_language.value === 'vi' ? 'en' : 'vi'
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
    return locale_map[current_language.value] || 'vi_VN'
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
  }
  return names[lang] || names.vi
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
  return lang ? lang.name : 'Tiếng Việt'
}

