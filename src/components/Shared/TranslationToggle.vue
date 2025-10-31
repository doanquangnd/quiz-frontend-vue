<template>
  <div class="translation-toggle" v-if="hasTranslation">
    <button
      @click="toggleTranslation"
      class="btn btn-outline-secondary btn-sm translation-toggle-btn"
      :class="{ 'active': showTranslation }"
    >
      <i class="fas fa-language me-1"></i>
      {{ showTranslation ? 'Ẩn bản dịch' : 'Xem bản dịch' }}
      <i 
        class="fas ms-1 transition-transform"
        :class="showTranslation ? 'fa-chevron-up' : 'fa-chevron-down'"
      ></i>
    </button>
    
    <div 
      v-if="showTranslation" 
      class="translation-content mt-3"
    >
      <div class="card border-info">
        <div class="card-header bg-info text-white">
          <i class="fas fa-language me-2"></i>
          Bản dịch tiếng Việt
        </div>
        <div class="card-body">
          <div v-if="translation.explanation" class="translation-explanation">
            <h6 class="text-muted mb-2">Giải thích:</h6>
            <div class="explanation-content">
              <FormattedText 
                :content="translation.explanation" 
                :preserve-formatting="true"
                text-class="translation-text"
                font-family="monospace"
              />
            </div>
          </div>
          <div v-if="translation.content" class="translation-content-text mt-3">
            <h6 class="text-muted mb-2">Nội dung:</h6>
            <div class="content-text">
              <FormattedText 
                :content="translation.content" 
                :preserve-formatting="true"
                text-class="translation-text"
                font-family="monospace"
              />
            </div>
          </div>
          <div v-if="!translation.explanation && !translation.content" class="text-muted">
            <i class="fas fa-info-circle me-1"></i>
            Không có bản dịch cho câu hỏi này
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FormattedText from './FormattedText.vue'

const props = defineProps({
  translation: {
    type: Object,
    default: null
  }
})

const showTranslation = ref(false)

const hasTranslation = computed(() => {
  return props.translation && (
    props.translation.explanation || 
    props.translation.content
  )
})

const toggleTranslation = () => {
  showTranslation.value = !showTranslation.value
}
</script>

<style scoped>
.translation-toggle {
  margin-top: 1rem;
}

.translation-toggle-btn {
  border-radius: 20px;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.translation-toggle-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.translation-toggle-btn.active {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

.translation-content {
  animation: slideDown 0.3s ease-out;
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

.translation-explanation,
.translation-content-text {
  line-height: 1.6;
}

.explanation-content,
.content-text {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.375rem;
  border-left: 4px solid #0dcaf0;
}

.translation-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
  font-size: 0.9rem;
}

.card-header {
  font-weight: 600;
  font-size: 0.9rem;
}

/* Dark theme support */
.dark .explanation-content,
.dark .content-text {
  background-color: #2d3748;
  color: #e2e8f0;
}

.dark .translation-text {
  color: #e2e8f0;
}

.dark .translation-toggle-btn {
  border-color: #4a5568;
  color: #e2e8f0;
}

.dark .translation-toggle-btn:hover {
  background-color: #4a5568;
  border-color: #4a5568;
}

.dark .translation-toggle-btn.active {
  background-color: #3182ce;
  border-color: #3182ce;
}
</style>
