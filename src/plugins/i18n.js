// Simple i18n plugin for Vue with reactive locale support
import { ref } from 'vue'

// Shared reactive locale state
const currentLocale = ref(localStorage.getItem('locale') || 'vi')

export default {
    install(app, options) {
        // Setup initial locale
        currentLocale.value = options.locale
        
        // Store messages and options
        app._i18nMessages = options.messages
        app._i18nAvailableLocales = options.availableLocales
        
        // Translation function - reads from reactive currentLocale
        app.config.globalProperties.$t = (key, params = {}) => {
            const keys = key.split('.');
            let value = options.messages[currentLocale.value];
            
            // Navigate through nested keys
            for (const k of keys) {
                if (value && typeof value === 'object' && k in value) {
                    value = value[k];
                } else {
                    return key; // Return key if translation not found
                }
            }
            
            // Replace parameters if any
            if (typeof value === 'string') {
                Object.keys(params).forEach(param => {
                    value = value.replace(`:${param}`, params[param]);
                });
            }
            
            return value || key;
        };
        
        // Current locale getter
        Object.defineProperty(app.config.globalProperties, '$locale', {
            get() {
                return currentLocale.value
            }
        });
        
        // Set locale method
        app.config.globalProperties.$setLocale = (locale) => {
            if (options.availableLocales.includes(locale)) {
                currentLocale.value = locale
                localStorage.setItem('locale', locale)
            }
        };
        
        // Available locales
        app.config.globalProperties.$availableLocales = options.availableLocales;
    }
};

// Export currentLocale for use in composables
export { currentLocale }
