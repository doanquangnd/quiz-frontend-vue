<template>
    <div>
        <PageTitle :title="$t('typography_settings')" />
        <AppLayout>
        <div class="container-fluid">
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 class="h3 mb-0">{{ $t('typography_settings') }}</h1>
                    <p class="text-muted mb-0">{{ $t('customize_reading_experience') }}</p>
                </div>
                <div class="d-flex gap-2">
                    <button 
                        @click="resetToDefault"
                        class="btn btn-outline-secondary"
                    >
                        <i class="fas fa-undo me-2"></i>{{ $t('reset_to_default') }}
                    </button>
                    <button 
                        @click="applySettings"
                        class="btn btn-primary"
                    >
                        <i class="fas fa-check me-2"></i>{{ $t('apply_settings') }}
                    </button>
                </div>
            </div>

            <!-- Typography Settings Component -->
            <TypographySettings />
        </div>
        </AppLayout>
    </div>
</template>

<script setup>
import PageTitle from '@/components/PageTitle.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import TypographySettings from '@/components/Settings/TypographySettings.vue'
import { useTypographySettings } from '@/composables/useTypographySettings'

const { resetToDefault, updateSettings } = useTypographySettings()

const applySettings = () => {
    // Settings are automatically applied via the composable
}
</script>
