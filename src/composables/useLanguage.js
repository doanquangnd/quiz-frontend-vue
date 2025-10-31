/**
 * useLanguage Composable
 * 
 * Quản lý ngôn ngữ của application
 */

import { ref, computed, watch } from 'vue'

// Current language state
const current_language = ref(get_initial_language())

/**
 * Get initial language from localStorage or browser
 */
function get_initial_language() {
  // Try localStorage first
  const stored = localStorage.getItem('language')
  if (stored && ['vi', 'en'].includes(stored)) {
    return stored
  }
  
  // Try browser language
  const browser_lang = navigator.language || navigator.userLanguage
  if (browser_lang) {
    if (browser_lang.startsWith('vi')) return 'vi'
    if (browser_lang.startsWith('en')) return 'en'
  }
  
  // Default to Vietnamese
  return 'vi'
}

/**
 * Set language
 */
function set_language(lang) {
  if (!['vi', 'en'].includes(lang)) {
    console.warn(`Invalid language: ${lang}. Using 'vi' instead.`)
    lang = 'vi'
  }
  
  current_language.value = lang
  localStorage.setItem('language', lang)
  
  // Update HTML lang attribute
  document.documentElement.lang = lang === 'vi' ? 'vi' : 'en'
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
  const locale = computed(() => current_language.value === 'vi' ? 'vi_VN' : 'en_US')
  
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
    locale,
    
    // Methods
    set_language,
    toggle_language,
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
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]

