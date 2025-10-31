<template>
  <div class="accessibility-settings">
    <!-- Settings Toggle Button -->
    <button 
      @click="toggleSettings"
      class="accessibility-toggle"
      :class="{ 'settings-open': isOpen }"
      aria-label="Cài đặt trợ năng"
      :aria-expanded="isOpen"
      aria-controls="accessibility-panel"
    >
      <i class="fas fa-universal-access"></i>
      <span class="toggle-text">Trợ năng</span>
    </button>

    <!-- Settings Panel -->
    <Transition name="slide-in">
      <div 
        v-if="isOpen"
        id="accessibility-panel"
        class="accessibility-panel"
        role="dialog"
        aria-label="Bảng điều khiển trợ năng"
        aria-modal="false"
      >
        <div class="panel-header">
          <h2 id="accessibility-title">Cài đặt trợ năng</h2>
          <button 
            @click="toggleSettings"
            class="close-button"
            aria-label="Đóng bảng cài đặt"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="panel-content">
          <!-- Font Size Controls -->
          <section class="settings-section">
            <h3>Kích thước chữ</h3>
            <div class="setting-group">
              <div class="setting-buttons">
                <button 
                  @click="decreaseFontSize"
                  class="setting-button"
                  :disabled="fontSize === 'normal'"
                  aria-label="Giảm kích thước chữ"
                >
                  <i class="fas fa-font"></i>
                  <span class="text-small">A</span>
                </button>
                
                <div class="font-size-indicator">
                  <span class="current-size">{{ fontSizeLabel }}</span>
                </div>
                
                <button 
                  @click="increaseFontSize"
                  class="setting-button"
                  :disabled="fontSize === 'x-large'"
                  aria-label="Tăng kích thước chữ"
                >
                  <i class="fas fa-font"></i>
                  <span class="text-large">A</span>
                </button>
              </div>
              
              <button 
                @click="resetFontSize"
                class="reset-button"
                :disabled="fontSize === 'normal'"
              >
                Đặt lại
              </button>
            </div>
          </section>

          <!-- High Contrast Mode -->
          <section class="settings-section">
            <h3>Độ tương phản</h3>
            <div class="setting-group">
              <label class="toggle-switch">
                <input 
                  type="checkbox"
                  :checked="highContrastMode"
                  @change="toggleHighContrast"
                  role="switch"
                  :aria-checked="highContrastMode"
                  aria-label="Bật/tắt chế độ tương phản cao"
                >
                <span class="switch-slider"></span>
                <span class="switch-label">
                  Chế độ tương phản cao
                </span>
              </label>
              <p class="setting-description">
                Tăng độ tương phản màu sắc để dễ đọc hơn
              </p>
            </div>
          </section>

          <!-- Reduced Motion -->
          <section class="settings-section">
            <h3>Chuyển động</h3>
            <div class="setting-group">
              <label class="toggle-switch">
                <input 
                  type="checkbox"
                  :checked="reducedMotion"
                  @change="toggleReducedMotion"
                  role="switch"
                  :aria-checked="reducedMotion"
                  aria-label="Bật/tắt chế độ giảm chuyển động"
                >
                <span class="switch-slider"></span>
                <span class="switch-label">
                  Giảm thiểu chuyển động
                </span>
              </label>
              <p class="setting-description">
                Giảm hoặc loại bỏ các hiệu ứng chuyển động
              </p>
            </div>
          </section>

          <!-- Keyboard Navigation -->
          <section class="settings-section">
            <h3>Điều hướng</h3>
            <div class="setting-group">
              <label class="toggle-switch">
                <input 
                  type="checkbox"
                  :checked="keyboardMode"
                  @change="toggleKeyboardMode"
                  role="switch"
                  :aria-checked="keyboardMode"
                  aria-label="Bật/tắt chế độ điều hướng bằng bàn phím"
                >
                <span class="switch-slider"></span>
                <span class="switch-label">
                  Điều hướng bằng bàn phím
                </span>
              </label>
              <p class="setting-description">
                Hiển thị viền nét cho các phần tử đang được chọn
              </p>
            </div>
          </section>

          <!-- Screen Reader Info -->
          <section class="settings-section">
            <h3>Đầu đọc màn hình</h3>
            <div class="setting-group">
              <div class="info-badge" :class="{ 'active': screenReaderMode }">
                <i :class="screenReaderMode ? 'fas fa-check-circle' : 'fas fa-info-circle'"></i>
                <span v-if="screenReaderMode">Đã phát hiện đầu đọc màn hình</span>
                <span v-else>Không phát hiện đầu đọc màn hình</span>
              </div>
              <p class="setting-description">
                Ứng dụng hỗ trợ các đầu đọc màn hình như NVDA, JAWS, VoiceOver
              </p>
            </div>
          </section>

          <!-- Keyboard Shortcuts -->
          <section class="settings-section">
            <h3>Phím tắt</h3>
            <div class="shortcuts-list">
              <div class="shortcut-item">
                <kbd>Tab</kbd>
                <span>Di chuyển đến phần tử tiếp theo</span>
              </div>
              <div class="shortcut-item">
                <kbd>Shift + Tab</kbd>
                <span>Di chuyển đến phần tử trước đó</span>
              </div>
              <div class="shortcut-item">
                <kbd>Enter</kbd>
                <span>Kích hoạt nút hoặc liên kết</span>
              </div>
              <div class="shortcut-item">
                <kbd>Escape</kbd>
                <span>Đóng hộp thoại hoặc menu</span>
              </div>
              <div class="shortcut-item">
                <kbd>Space</kbd>
                <span>Kích hoạt nút hoặc checkbox</span>
              </div>
            </div>
          </section>

          <!-- Reset All Settings -->
          <section class="settings-section">
            <button @click="resetAllSettings" class="reset-all-button">
              <i class="fas fa-redo"></i>
              Đặt lại tất cả cài đặt
            </button>
          </section>
        </div>

        <!-- Panel Footer -->
        <div class="panel-footer">
          <p class="compliance-info">
            <i class="fas fa-check-circle"></i>
            Tuân thủ WCAG 2.1 Level AA
          </p>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <Transition name="fade">
      <div 
        v-if="isOpen"
        class="accessibility-backdrop"
        @click="toggleSettings"
        aria-hidden="true"
      ></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAccessibility } from '@/composables/useAccessibility'

const {
  fontSize,
  highContrastMode,
  reducedMotion,
  keyboardMode,
  screenReaderMode,
  increaseFontSize,
  decreaseFontSize,
  resetFontSize,
  enableHighContrast,
  disableHighContrast,
  enableKeyboardMode,
  disableKeyboardMode,
  announce,
  savePreferences
} = useAccessibility()

// Component state
const isOpen = ref(false)

// Computed properties
const fontSizeLabel = computed(() => {
  const labels = {
    'normal': 'Bình thường',
    'large': 'Lớn',
    'x-large': 'Rất lớn'
  }
  return labels[fontSize.value] || 'Bình thường'
})

// Methods
const toggleSettings = () => {
  isOpen.value = !isOpen.value
  
  if (isOpen.value) {
    announce('Đã mở bảng cài đặt trợ năng')
    // Focus the first interactive element
    setTimeout(() => {
      const firstButton = document.querySelector('#accessibility-panel button')
      if (firstButton) {
        firstButton.focus()
      }
    }, 100)
  } else {
    announce('Đã đóng bảng cài đặt trợ năng')
  }
}

const toggleHighContrast = () => {
  if (highContrastMode.value) {
    disableHighContrast()
  } else {
    enableHighContrast()
  }
}

const toggleReducedMotion = () => {
  reducedMotion.value = !reducedMotion.value
  
  if (reducedMotion.value) {
    document.body.classList.add('reduced-motion')
    announce('Đã bật chế độ giảm chuyển động')
  } else {
    document.body.classList.remove('reduced-motion')
    announce('Đã tắt chế độ giảm chuyển động')
  }
  
  savePreferences()
}

const toggleKeyboardMode = () => {
  if (keyboardMode.value) {
    disableKeyboardMode()
  } else {
    enableKeyboardMode()
  }
}

const resetAllSettings = () => {
  // Reset font size
  resetFontSize()
  
  // Disable high contrast
  if (highContrastMode.value) {
    disableHighContrast()
  }
  
  // Disable reduced motion
  if (reducedMotion.value) {
    reducedMotion.value = false
    document.body.classList.remove('reduced-motion')
  }
  
  // Disable keyboard mode
  if (keyboardMode.value) {
    disableKeyboardMode()
  }
  
  announce('Đã đặt lại tất cả cài đặt trợ năng về mặc định')
  savePreferences()
}

// Close panel on Escape key
const handleEscape = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    toggleSettings()
  }
}

watch(() => isOpen.value, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* ===== ACCESSIBILITY SETTINGS STYLES ===== */

.accessibility-settings {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 1000;
}

/* Toggle Button */
.accessibility-toggle {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-primary, #4f46e5);
  color: white;
  border: none;
  padding: 1rem 0.75rem;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  box-shadow: -2px 2px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 1001;
}

.accessibility-toggle:hover,
.accessibility-toggle:focus {
  background: var(--color-secondary, #6366f1);
  transform: translateY(-50%) translateX(-5px);
  outline: 3px solid #fbbf24;
  outline-offset: 2px;
}

.accessibility-toggle.settings-open {
  right: 350px;
}

.toggle-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Settings Panel */
.accessibility-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow-y: auto;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  background: var(--color-primary, #4f46e5);
  color: white;
}

.panel-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.close-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-button:hover,
.close-button:focus {
  background: rgba(255, 255, 255, 0.2);
  outline: 2px solid white;
}

.panel-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.settings-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.settings-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--color-text-dark, #1f2937);
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Font Size Controls */
.setting-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.setting-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f3f4f6;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.setting-button:hover:not(:disabled) {
  background: #e5e7eb;
  border-color: var(--color-primary, #4f46e5);
}

.setting-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-small {
  font-size: 0.875rem;
}

.text-large {
  font-size: 1.25rem;
}

.font-size-indicator {
  padding: 0.75rem 1rem;
  background: var(--color-primary, #4f46e5);
  color: white;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  min-width: 100px;
}

.current-size {
  font-size: 0.875rem;
}

.reset-button {
  padding: 0.5rem 1rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.reset-button:hover:not(:disabled) {
  background: #4b5563;
}

.reset-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Toggle Switch */
.toggle-switch {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.toggle-switch input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.switch-slider {
  position: relative;
  width: 48px;
  height: 24px;
  background: #d1d5db;
  border-radius: 12px;
  transition: background 0.3s ease;
}

.switch-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="checkbox"]:checked + .switch-slider {
  background: var(--color-primary, #4f46e5);
}

input[type="checkbox"]:checked + .switch-slider::before {
  transform: translateX(24px);
}

input[type="checkbox"]:focus + .switch-slider {
  outline: 3px solid #fbbf24;
  outline-offset: 2px;
}

.switch-label {
  font-weight: 500;
  color: var(--color-text-dark, #1f2937);
}

.setting-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

/* Info Badge */
.info-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.info-badge.active {
  background: #d1fae5;
  color: #047857;
}

.info-badge i {
  font-size: 1.125rem;
}

/* Shortcuts List */
.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
}

.shortcut-item kbd {
  padding: 0.25rem 0.5rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-dark, #1f2937);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  min-width: 60px;
  text-align: center;
}

.shortcut-item span {
  flex: 1;
  font-size: 0.875rem;
  color: #6b7280;
}

/* Reset All Button */
.reset-all-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.reset-all-button:hover,
.reset-all-button:focus {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Panel Footer */
.panel-footer {
  padding: 1rem 1.5rem;
  border-top: 2px solid #e5e7eb;
  background: #f9fafb;
}

.compliance-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.compliance-info i {
  color: #10b981;
}

/* Backdrop */
.accessibility-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Transitions */
.slide-in-enter-active,
.slide-in-leave-active {
  transition: transform 0.3s ease;
}

.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .accessibility-panel {
    width: 100%;
    max-width: 350px;
  }
  
  .accessibility-toggle.settings-open {
    right: 100%;
    transform: translateY(-50%) translateX(100%);
  }
}

/* High Contrast Mode */
.high-contrast .accessibility-panel {
  background: var(--color-background);
  border: 2px solid var(--color-border);
}

.high-contrast .panel-header {
  background: var(--color-primary);
  border-color: var(--color-border);
}

.high-contrast .setting-button {
  background: var(--color-background);
  border-color: var(--color-border);
  color: var(--color-text);
}

.high-contrast .setting-button:hover:not(:disabled) {
  border-color: var(--color-primary);
  outline: 2px solid var(--color-primary);
}
</style>
