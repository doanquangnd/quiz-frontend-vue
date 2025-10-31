import { ref, watch, onMounted } from 'vue'

// Shared dark mode state
const isDarkMode = ref(false)
const darkModePreference = ref('system') // 'dark' | 'light' | 'system'

export function useDarkMode() {
  // Initialize dark mode from localStorage or system preference
  const initializeDarkMode = () => {
    const stored = localStorage.getItem('darkModePreference')
    
    if (stored && ['dark', 'light', 'system'].includes(stored)) {
      darkModePreference.value = stored
    } else {
      darkModePreference.value = 'system'
    }
    
    applyDarkModePreference()
  }

  // Apply dark mode based on preference
  const applyDarkModePreference = () => {
    let shouldBeDark = false
    
    if (darkModePreference.value === 'dark') {
      shouldBeDark = true
    } else if (darkModePreference.value === 'light') {
      shouldBeDark = false
    } else {
      // system
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    isDarkMode.value = shouldBeDark
    applyDarkMode()
  }

  // Apply dark mode to document
  const applyDarkMode = () => {
    const html = document.documentElement
    const body = document.body
    
    // Add transition class to disable transitions
    html.classList.add('theme-transitioning')
    body.classList.add('theme-transitioning')
    
    if (isDarkMode.value) {
      html.classList.add('dark')
      html.setAttribute('data-bs-theme', 'dark')
      html.style.backgroundColor = '#16213e'
      body.style.backgroundColor = '#16213e'
    } else {
      html.classList.remove('dark')
      html.setAttribute('data-bs-theme', 'light')
      html.style.backgroundColor = '#F8F9FA'
      body.style.backgroundColor = '#F8F9FA'
    }
    
    // Force re-render for components that might not react to class changes
    html.style.setProperty('--dark-mode', isDarkMode.value ? '1' : '0')
    
    // Force reflow to ensure changes are applied
    html.offsetHeight
    
    // Remove transition class after changes are applied
    requestAnimationFrame(() => {
      html.classList.remove('theme-transitioning')
      body.classList.remove('theme-transitioning')
    })
  }

  // Toggle dark mode (deprecated, use setDarkModePreference instead)
  const toggleDarkMode = () => {
    if (darkModePreference.value === 'light') {
      setDarkModePreference('dark')
    } else {
      setDarkModePreference('light')
    }
  }

  // Set dark mode preference
  const setDarkModePreference = (preference) => {
    if (!['dark', 'light', 'system'].includes(preference)) {
      console.warn('Invalid dark mode preference:', preference)
      return
    }
    
    darkModePreference.value = preference
    localStorage.setItem('darkModePreference', preference)
    applyDarkModePreference()
  }

  // Set dark mode explicitly (for backward compatibility)
  const setDarkMode = (value) => {
    setDarkModePreference(value ? 'dark' : 'light')
  }

  // Watch for preference changes
  watch(darkModePreference, () => {
    applyDarkModePreference()
  })

  // Listen for system theme changes
  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      // Only update if user is using system preference
      if (darkModePreference.value === 'system') {
        isDarkMode.value = e.matches
        applyDarkMode()
      }
    })
  })

  return {
    isDarkMode,
    darkModePreference,
    toggleDarkMode,
    setDarkMode,
    setDarkModePreference,
    initializeDarkMode
  }
}
