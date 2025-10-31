import { ref, computed, watch } from 'vue'

/**
 * Composable để quản lý typography settings
 * Cho phép user tùy chỉnh độ dài dòng cho phần explanation
 */
export function useTypographySettings() {
    // Default settings
    const defaultSettings = {
        explanationLineLength: 80, // characters per line
        mobileLineLength: 60,      // characters per line on mobile
        lineHeight: 1.7,
        fontSize: 0.95
    }

    // Load settings from localStorage
    const loadSettings = () => {
        try {
            const saved = localStorage.getItem('typography_settings')
            if (saved) {
                const parsed = JSON.parse(saved)
                return { ...defaultSettings, ...parsed }
            }
        } catch (error) {
            console.error('Error loading typography settings:', error)
        }
        return defaultSettings
    }

    // Save settings to localStorage
    const saveSettings = (settings) => {
        try {
            localStorage.setItem('typography_settings', JSON.stringify(settings))
        } catch (error) {
            console.error('Error saving typography settings:', error)
        }
    }

    // Reactive settings
    const settings = ref(loadSettings())

    // Computed CSS variables
    const cssVariables = computed(() => ({
        '--explanation-line-length': `${settings.value.explanationLineLength}ch`,
        '--mobile-line-length': `${settings.value.mobileLineLength}ch`,
        '--explanation-line-height': settings.value.lineHeight,
        '--explanation-font-size': `${settings.value.fontSize}rem`
    }))

    // Update settings
    const updateSettings = (newSettings) => {
        settings.value = { ...settings.value, ...newSettings }
        saveSettings(settings.value)
    }

    // Reset to default
    const resetToDefault = () => {
        settings.value = { ...defaultSettings }
        saveSettings(settings.value)
    }

    // Watch for changes and apply CSS variables
    watch(settings, (newSettings) => {
        // Apply CSS variables to document root
        const root = document.documentElement
        Object.entries(cssVariables.value).forEach(([key, value]) => {
            root.style.setProperty(key, value)
        })
    }, { immediate: true })

    // Preset options
    const presets = [
        {
            name: 'Compact',
            description: 'Dòng ngắn, dễ đọc',
            settings: { explanationLineLength: 60, mobileLineLength: 45 }
        },
        {
            name: 'Balanced',
            description: 'Cân bằng giữa đọc và hiển thị',
            settings: { explanationLineLength: 80, mobileLineLength: 60 }
        },
        {
            name: 'Wide',
            description: 'Dòng dài, tiết kiệm không gian',
            settings: { explanationLineLength: 100, mobileLineLength: 75 }
        },
        {
            name: 'Custom',
            description: 'Tùy chỉnh theo ý muốn',
            settings: null
        }
    ]

    return {
        settings,
        cssVariables,
        updateSettings,
        resetToDefault,
        presets,
        defaultSettings,
        // Individual reactive properties for components
        explanationLineLength: computed({
            get: () => settings.value.explanationLineLength,
            set: (value) => updateSettings({ explanationLineLength: value })
        }),
        mobileLineLength: computed({
            get: () => settings.value.mobileLineLength,
            set: (value) => updateSettings({ mobileLineLength: value })
        }),
        explanationLineHeight: computed({
            get: () => settings.value.lineHeight,
            set: (value) => updateSettings({ lineHeight: value })
        }),
        explanationFontSize: computed({
            get: () => settings.value.fontSize,
            set: (value) => updateSettings({ fontSize: value })
        }),
        // Default values
        DEFAULT_LINE_LENGTH: defaultSettings.explanationLineLength,
        DEFAULT_MOBILE_LINE_LENGTH: defaultSettings.mobileLineLength,
        DEFAULT_LINE_HEIGHT: defaultSettings.lineHeight,
        DEFAULT_FONT_SIZE: defaultSettings.fontSize
    }
}
