import { getCurrentInstance, computed } from 'vue'
import { currentLocale } from '@/plugins/i18n.js'

/**
 * Custom composable for translation in Composition API
 * Works with the existing custom i18n plugin
 */
export function useTranslation() {
    const instance = getCurrentInstance()
    
    if (!instance) {
        console.warn('useTranslation must be called within a component setup function')
        return {
            t: (key) => key, // Fallback to key if no instance
            locale: computed(() => currentLocale.value),
            setLocale: () => {},
            availableLocales: ['vi', 'en', 'ja']
        }
    }
    
    return {
        // Translation function
        t: (key, params = {}) => {
            return instance.proxy.$t(key, params)
        },
        
        // Current locale from reactive ref - computed để reactive
        locale: computed(() => currentLocale.value),
        
        // Set locale
        setLocale: (locale) => {
            instance.proxy.$setLocale(locale)
        },
        
        // Available locales
        availableLocales: instance.proxy.$availableLocales,
        
        // Helper to check if translation exists
        hasTranslation: (key) => {
            const result = instance.proxy.$t(key)
            return result !== key // If result equals key, translation doesn't exist
        }
    }
}
