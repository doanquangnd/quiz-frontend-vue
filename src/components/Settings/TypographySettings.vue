<template>
    <div class="typography-settings">
        <div class="card border-0 shadow-soft">
            <div class="card-header">
                <div class="d-flex align-items-center gap-2">
                    <i class="fas fa-font"></i>
                    <h5 class="mb-0">{{ $t('typography_settings') }}</h5>
                </div>
            </div>
            <div class="card-body">
                <!-- Preset Selection -->
                <div class="mb-4">
                    <label class="form-label fw-bold">{{ $t('preset_options') }}</label>
                    <div class="row g-2">
                        <div 
                            v-for="preset in presets" 
                            :key="preset.name"
                            class="col-md-6 col-lg-3"
                        >
                            <button
                                @click="selectPreset(preset)"
                                class="btn w-100 text-start"
                                :class="{
                                    'btn-primary': selectedPreset === preset.name,
                                    'btn-outline-primary': selectedPreset !== preset.name
                                }"
                            >
                                <div class="fw-bold">{{ preset.name }}</div>
                                <small class="text-muted">{{ preset.description }}</small>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Custom Settings -->
                <div v-if="selectedPreset === 'Custom'" class="custom-settings">
                    <h6 class="fw-bold mb-3">{{ $t('custom_settings') }}</h6>
                    
                    <!-- Desktop Line Length -->
                    <div class="mb-3">
                        <label class="form-label">
                            {{ $t('desktop_line_length') }}: 
                            <span class="badge bg-info">{{ settings.explanationLineLength }} {{ $t('characters') }}</span>
                        </label>
                        <input
                            v-model.number="settings.explanationLineLength"
                            type="range"
                            class="form-range"
                            min="40"
                            max="120"
                            step="5"
                            @input="updateCustomSettings"
                        >
                        <div class="d-flex justify-content-between small text-muted">
                            <span>40 {{ $t('characters') }}</span>
                            <span>120 {{ $t('characters') }}</span>
                        </div>
                    </div>

                    <!-- Mobile Line Length -->
                    <div class="mb-3">
                        <label class="form-label">
                            {{ $t('mobile_line_length') }}: 
                            <span class="badge bg-info">{{ settings.mobileLineLength }} {{ $t('characters') }}</span>
                        </label>
                        <input
                            v-model.number="settings.mobileLineLength"
                            type="range"
                            class="form-range"
                            min="30"
                            max="90"
                            step="5"
                            @input="updateCustomSettings"
                        >
                        <div class="d-flex justify-content-between small text-muted">
                            <span>30 {{ $t('characters') }}</span>
                            <span>90 {{ $t('characters') }}</span>
                        </div>
                    </div>

                    <!-- Line Height -->
                    <div class="mb-3">
                        <label class="form-label">
                            {{ $t('line_height') }}: 
                            <span class="badge bg-info">{{ settings.lineHeight }}</span>
                        </label>
                        <input
                            v-model.number="settings.lineHeight"
                            type="range"
                            class="form-range"
                            min="1.2"
                            max="2.0"
                            step="0.1"
                            @input="updateCustomSettings"
                        >
                        <div class="d-flex justify-content-between small text-muted">
                            <span>1.2</span>
                            <span>2.0</span>
                        </div>
                    </div>

                    <!-- Font Size -->
                    <div class="mb-3">
                        <label class="form-label">
                            {{ $t('font_size') }}: 
                            <span class="badge bg-info">{{ settings.fontSize }}rem</span>
                        </label>
                        <input
                            v-model.number="settings.fontSize"
                            type="range"
                            class="form-range"
                            min="0.8"
                            max="1.2"
                            step="0.05"
                            @input="updateCustomSettings"
                        >
                        <div class="d-flex justify-content-between small text-muted">
                            <span>0.8rem</span>
                            <span>1.2rem</span>
                        </div>
                    </div>
                </div>

                <!-- Preview -->
                <div class="preview-section">
                    <h6 class="fw-bold mb-3">{{ $t('preview') }}</h6>
                    <div class="preview-content">
                        <div class="explanation-preview">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <i class="fas fa-lightbulb text-warning"></i>
                                <span class="fw-bold">{{ $t('detailed_explanation') }}</span>
                            </div>
                            <div class="preview-text">
                                {{ $t('preview_explanation_text') }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="d-flex gap-2 mt-4">
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
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTypographySettings } from '@/composables/useTypographySettings'

const { settings, updateSettings, resetToDefault, presets } = useTypographySettings()

const selectedPreset = ref('Balanced')

// Watch for preset changes
watch(selectedPreset, (newPreset) => {
    const preset = presets.find(p => p.name === newPreset)
    if (preset && preset.settings) {
        updateSettings(preset.settings)
    }
})

const selectPreset = (preset) => {
    selectedPreset.value = preset.name
    if (preset.settings) {
        updateSettings(preset.settings)
    }
}

const updateCustomSettings = () => {
    updateSettings(settings.value)
}

const applySettings = () => {
    updateSettings(settings.value)
    // Show success message
    // You can add toast notification here
}
</script>

<style scoped>
.typography-settings {
    max-width: 800px;
}

.preview-content {
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1rem;
    background-color: #f8f9fa;
}

.explanation-preview {
    max-width: var(--explanation-line-length, 80ch);
    line-height: var(--explanation-line-height, 1.7);
    font-size: var(--explanation-font-size, 0.95rem);
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.preview-text {
    color: #1e293b;
    margin: 0;
}

@media (max-width: 768px) {
    .explanation-preview {
        max-width: var(--mobile-line-length, 60ch);
    }
}

.form-range {
    height: 8px;
}

.form-range::-webkit-slider-thumb {
    background: #0d6efd;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-range::-moz-range-thumb {
    background: #0d6efd;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
