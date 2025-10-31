<template>
    <div class="basic-line-control">
        <button
            @click="toggleControl"
            class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2"
            :title="$t('adjust_line_length')"
        >
            <i class="fas fa-text-width"></i>
            <span class="d-none d-md-inline">{{ $t('line_length') }}</span>
        </button>

        <Transition name="slide-fade">
            <div v-if="showControl" class="control-panel p-3 bg-light rounded shadow-sm">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <label class="form-label mb-0 small fw-bold">
                        <i class="fas fa-arrows-left-right me-2"></i>
                        {{ $t('line_length') }}: {{ lineLength }}{{ $t('characters') }}
                    </label>
                    <button
                        @click="resetToDefault"
                        class="btn btn-sm btn-link text-decoration-none p-0"
                        :title="$t('reset_to_default')"
                    >
                        <i class="fas fa-undo"></i>
                    </button>
                </div>
                
                <input
                    type="range"
                    class="form-range"
                    min="40"
                    max="120"
                    step="5"
                    v-model="lineLength"
                    @input="updateLineLength"
                />
                
                <div class="d-flex justify-content-between mt-2">
                    <small class="text-muted">{{ $t('compact') }} (40)</small>
                    <small class="text-muted">{{ $t('comfortable') }} (80)</small>
                    <small class="text-muted">{{ $t('wide') }} (120)</small>
                </div>

                <!-- Quick Presets -->
                <div class="d-flex gap-2 mt-3">
                    <button
                        @click="setPreset(60)"
                        class="btn btn-sm btn-outline-primary flex-fill"
                    >
                        {{ $t('compact') }}
                    </button>
                    <button
                        @click="setPreset(80)"
                        class="btn btn-sm btn-outline-primary flex-fill"
                    >
                        {{ $t('balanced') }}
                    </button>
                    <button
                        @click="setPreset(100)"
                        class="btn btn-sm btn-outline-primary flex-fill"
                    >
                        {{ $t('wide') }}
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useTranslation } from '@/composables/useTranslation';

const { t } = useTranslation();

const showControl = ref(false);
const lineLength = ref(80);
const DEFAULT_LINE_LENGTH = 80;

const toggleControl = () => {
    showControl.value = !showControl.value;
};

const updateLineLength = () => {
    // Update CSS variable directly
    document.documentElement.style.setProperty('--explanation-line-length', `${lineLength.value}ch`);
    // Also update mobile line length proportionally
    const mobileLength = Math.round(lineLength.value * 0.75);
    document.documentElement.style.setProperty('--mobile-line-length', `${mobileLength}ch`);
    
    // Save to localStorage
    localStorage.setItem('explanationLineLength', lineLength.value);
};

const resetToDefault = () => {
    lineLength.value = DEFAULT_LINE_LENGTH;
    updateLineLength();
};

const setPreset = (value) => {
    lineLength.value = value;
    updateLineLength();
};

// Click outside to close
const handleClickOutside = (event) => {
    const control = document.querySelector('.basic-line-control');
    if (control && !control.contains(event.target)) {
        showControl.value = false;
    }
};

onMounted(() => {
    // Load from localStorage
    const saved = localStorage.getItem('explanationLineLength');
    if (saved) {
        lineLength.value = parseInt(saved);
    }
    
    // Initialize CSS variables
    updateLineLength();
    
    // Add click outside listener
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    // Remove click outside listener
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.basic-line-control {
    position: relative;
}

.control-panel {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 1000;
    min-width: 320px;
    max-width: 400px;
    border: 1px solid #dee2e6;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideDown 0.3s ease-out;
}

/* Slide fade transition */
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Range input styling */
.form-range {
    cursor: pointer;
}

.form-range::-webkit-slider-thumb {
    background: #0d6efd;
}

.form-range::-moz-range-thumb {
    background: #0d6efd;
}

/* Button hover effects */
.btn-outline-secondary:hover {
    background-color: #6c757d;
    color: white;
}

.btn-outline-primary:hover {
    background-color: #0d6efd;
    color: white;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .control-panel {
        min-width: 280px;
        max-width: calc(100vw - 20px);
        right: -10px;
    }
}
</style>
