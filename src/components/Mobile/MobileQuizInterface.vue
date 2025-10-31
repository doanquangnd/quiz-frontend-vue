<template>
  <div class="mobile-quiz-interface">
    <!-- Quiz Header -->
    <div class="quiz-header">
      <div class="quiz-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="progress-text">
          <span class="current-question">{{ currentQuestionIndex + 1 }}</span>
          <span class="separator">/</span>
          <span class="total-questions">{{ totalQuestions }}</span>
        </div>
      </div>
      
      <div class="quiz-timer" v-if="showTimer">
        <i class="fas fa-clock timer-icon"></i>
        <span class="timer-text">{{ formatTime(timeRemaining) }}</span>
      </div>
    </div>

    <!-- Question Card -->
    <div class="question-card">
      <div class="question-content">
        <h2 class="question-title">{{ question.content }}</h2>
        
        <!-- Question Image -->
        <div v-if="fixedImageUrl" class="question-image">
          <img 
            :src="fixedImageUrl" 
            :alt="'Question image'"
            class="question-img"
            @load="onImageLoad"
            @error="onImageError"
          />
        </div>
      </div>
    </div>

    <!-- Answer Options -->
    <div class="answer-options">
      <TouchInteractions @swipe-left="nextQuestion" @swipe-right="previousQuestion">
        <div 
          v-for="(choice, index) in question.choices" 
          :key="choice.id"
          class="answer-option"
          :class="{ 
            selected: selectedAnswer === choice.id,
            correct: showCorrectAnswer && choice.is_correct,
            incorrect: showCorrectAnswer && selectedAnswer === choice.id && !choice.is_correct
          }"
          @click="selectAnswer(choice.id)"
        >
          <div class="option-indicator">
            <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
          </div>
          
          <div class="option-content">
            <FormattedText
              :content="choice.content"
              :preserve-formatting="true"
              text-class="option-text"
              font-family="monospace"
            />
          </div>
          
          <div class="option-status" v-if="showCorrectAnswer">
            <i 
              v-if="choice.is_correct" 
              class="fas fa-check option-icon correct"
            ></i>
            <i 
              v-else-if="selectedAnswer === choice.id" 
              class="fas fa-times option-icon incorrect"
            ></i>
          </div>
        </div>
      </TouchInteractions>
    </div>

    <!-- Quiz Actions -->
    <div class="quiz-actions">
      <button 
        class="action-btn secondary"
        @click="previousQuestion"
        :disabled="currentQuestionIndex === 0"
      >
        <i class="fas fa-arrow-left"></i>
        <span>Trước</span>
      </button>
      
      <button 
        v-if="!selectedAnswer"
        class="action-btn primary"
        :disabled="!canSubmit"
        @click="submitAnswer"
      >
        <span>Bỏ qua</span>
        <i class="fas fa-forward"></i>
      </button>
      
      <button 
        v-else-if="!showCorrectAnswer"
        class="action-btn primary"
        @click="checkAnswer"
      >
        <span>Kiểm tra</span>
        <i class="fas fa-check"></i>
      </button>
      
      <button 
        v-else
        class="action-btn primary"
        @click="nextQuestion"
        :disabled="currentQuestionIndex === totalQuestions - 1"
      >
        <span>{{ isLastQuestion ? 'Kết thúc' : 'Tiếp theo' }}</span>
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>

    <!-- Quiz Footer -->
    <div class="quiz-footer">
      <div class="quiz-stats">
        <div class="stat-item">
          <i class="fas fa-check-circle stat-icon correct"></i>
          <span class="stat-text">{{ correctAnswers }}</span>
        </div>
        
        <div class="stat-item">
          <i class="fas fa-times-circle stat-icon incorrect"></i>
          <span class="stat-text">{{ incorrectAnswers }}</span>
        </div>
        
        <div class="stat-item">
          <i class="fas fa-question-circle stat-icon skipped"></i>
          <span class="stat-text">{{ skippedAnswers }}</span>
        </div>
      </div>
      
      <div class="quiz-controls">
        <button 
          class="control-btn"
          @click="pauseQuiz"
          :title="$t('quiz.pause')"
        >
          <i class="fas fa-pause"></i>
        </button>
        
        <button 
          class="control-btn"
          @click="showHint"
          :disabled="!question.hint || hintShown"
          :title="$t('quiz.hint')"
        >
          <i class="fas fa-lightbulb"></i>
        </button>
        
        <button 
          class="control-btn"
          @click="flagQuestion"
          :class="{ flagged: isQuestionFlagged }"
          :title="$t('quiz.flag')"
        >
          <i class="fas fa-flag"></i>
        </button>
      </div>
    </div>

    <!-- Hint Modal -->
    <div v-if="showHintModal" class="hint-modal-overlay" @click="hideHint">
      <div class="hint-modal" @click.stop>
        <div class="hint-header">
          <h3>{{ $t('quiz.hint') }}</h3>
          <button class="hint-close" @click="hideHint">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="hint-content">
          <p>{{ question.hint }}</p>
        </div>
      </div>
    </div>

    <!-- Swipe Instructions -->
    <div v-if="showSwipeInstructions" class="swipe-instructions">
      <div class="swipe-content">
        <i class="fas fa-hand-point-left swipe-icon"></i>
        <span class="swipe-text">Vuốt trái/phải để chuyển câu hỏi</span>
        <button class="swipe-close" @click="hideSwipeInstructions">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import TouchInteractions from './TouchInteractions.vue'
import FormattedText from '@/components/Shared/FormattedText.vue'
import { fixImageUrl } from '@/utils/highlight.js'

// Props
const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  currentQuestionIndex: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  timeRemaining: {
    type: Number,
    default: 0
  },
  showTimer: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits([
  'answer-selected',
  'answer-submitted',
  'next-question',
  'previous-question',
  'quiz-paused',
  'question-flagged'
])

// State
const selectedAnswer = ref(null)
const showCorrectAnswer = ref(false)
const hintShown = ref(false)
const showHintModal = ref(false)
const showSwipeInstructions = ref(true)
const isQuestionFlagged = ref(false)
const correctAnswers = ref(0)
const incorrectAnswers = ref(0)
const skippedAnswers = ref(0)

// Computed
const progressPercentage = computed(() => {
  return ((props.currentQuestionIndex + 1) / props.totalQuestions) * 100
})

const fixedImageUrl = computed(() => {
  return props.question.image_url ? fixImageUrl(props.question.image_url) : null
})

const isLastQuestion = computed(() => {
  return props.currentQuestionIndex === props.totalQuestions - 1
})

const canSubmit = computed(() => {
  return selectedAnswer.value !== null
})

// Methods
const selectAnswer = (answerId) => {
  if (!showCorrectAnswer.value) {
    selectedAnswer.value = answerId
    emit('answer-selected', answerId)
  }
}

const submitAnswer = () => {
  emit('answer-submitted', {
    questionId: props.question.id,
    answerId: selectedAnswer.value,
    isSkipped: selectedAnswer.value === null
  })
}

const checkAnswer = () => {
  showCorrectAnswer.value = true
  
  // Update stats
  if (selectedAnswer.value) {
    const isCorrect = props.question.choices.find(c => c.id === selectedAnswer.value)?.is_correct
    if (isCorrect) {
      correctAnswers.value++
    } else {
      incorrectAnswers.value++
    }
  } else {
    skippedAnswers.value++
  }
}

const nextQuestion = () => {
  emit('next-question')
  resetQuestionState()
}

const previousQuestion = () => {
  emit('previous-question')
  resetQuestionState()
}

const pauseQuiz = () => {
  emit('quiz-paused')
}

const showHint = () => {
  if (props.question.hint && !hintShown.value) {
    showHintModal.value = true
    hintShown.value = true
  }
}

const hideHint = () => {
  showHintModal.value = false
}

const flagQuestion = () => {
  isQuestionFlagged.value = !isQuestionFlagged.value
  emit('question-flagged', {
    questionId: props.question.id,
    flagged: isQuestionFlagged.value
  })
}

const hideSwipeInstructions = () => {
  showSwipeInstructions.value = false
  localStorage.setItem('swipe-instructions-shown', 'true')
}

const resetQuestionState = () => {
  selectedAnswer.value = null
  showCorrectAnswer.value = false
  hintShown.value = false
  showHintModal.value = false
  isQuestionFlagged.value = false
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const onImageLoad = () => {
  // Image loaded successfully
}

const onImageError = () => {
  // Handle image load error
}

// Watch for question changes
watch(() => props.question, () => {
  resetQuestionState()
})

// Initialize
onMounted(() => {
  // Check if swipe instructions were already shown
  if (localStorage.getItem('swipe-instructions-shown')) {
    showSwipeInstructions.value = false
  }
  
  // Auto-hide swipe instructions after 5 seconds
  setTimeout(() => {
    showSwipeInstructions.value = false
  }, 5000)
})
</script>

<style scoped>
/* Mobile Quiz Interface Styles */
.mobile-quiz-interface {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-primary);
  overflow: hidden;
}

/* Quiz Header */
.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.quiz-progress {
  flex: 1;
  margin-right: var(--space-md);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--space-xs);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.current-question {
  font-weight: 600;
  color: var(--primary-color);
}

.quiz-timer {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.timer-icon {
  color: var(--warning-color);
}

.timer-text {
  font-weight: 600;
  color: var(--warning-color);
}

/* Question Card */
.question-card {
  flex: 1;
  padding: var(--space-lg);
  overflow-y: auto;
}

.question-content {
  max-width: 100%;
}

.question-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  line-height: var(--line-height-tight);
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
}

.question-image {
  margin-bottom: var(--space-lg);
}

.question-img {
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

/* Answer Options */
.answer-options {
  padding: 0 var(--space-lg) var(--space-lg);
  flex: 1;
  overflow-y: auto;
}

.answer-option {
  display: flex;
  align-items: center;
  padding: var(--space-lg);
  margin-bottom: var(--space-md);
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 60px;
}

.answer-option:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.answer-option.selected {
  border-color: var(--primary-color);
  background: rgba(79, 70, 229, 0.05);
}

.answer-option.correct {
  border-color: var(--success-color);
  background: rgba(16, 185, 129, 0.05);
}

.answer-option.incorrect {
  border-color: var(--error-color);
  background: rgba(239, 68, 68, 0.05);
}

.option-indicator {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 50%;
  margin-right: var(--space-md);
  flex-shrink: 0;
}

.answer-option.selected .option-indicator {
  background: var(--primary-color);
  color: white;
}

.answer-option.correct .option-indicator {
  background: var(--success-color);
  color: white;
}

.answer-option.incorrect .option-indicator {
  background: var(--error-color);
  color: white;
}

.option-letter {
  font-weight: 600;
  font-size: var(--font-size-lg);
}

.option-content {
  flex: 1;
}

.option-text {
  margin: 0;
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--text-primary);
}

.option-status {
  margin-left: var(--space-md);
  flex-shrink: 0;
}

.option-icon {
  font-size: var(--font-size-lg);
}

.option-icon.correct {
  color: var(--success-color);
}

.option-icon.incorrect {
  color: var(--error-color);
}

/* Quiz Actions */
.quiz-actions {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 48px;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.primary {
  background: var(--primary-color);
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.action-btn.secondary:hover:not(:disabled) {
  background: var(--border-color);
}

/* Quiz Footer */
.quiz-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.quiz-stats {
  display: flex;
  gap: var(--space-lg);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.stat-icon {
  font-size: var(--font-size-base);
}

.stat-icon.correct {
  color: var(--success-color);
}

.stat-icon.incorrect {
  color: var(--error-color);
}

.stat-icon.skipped {
  color: var(--text-secondary);
}

.stat-text {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.quiz-controls {
  display: flex;
  gap: var(--space-sm);
}

.control-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.control-btn:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.control-btn.flagged {
  background: var(--warning-color);
  color: white;
  border-color: var(--warning-color);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Hint Modal */
.hint-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-lg);
}

.hint-modal {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 400px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
}

.hint-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--border-color);
}

.hint-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.hint-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.hint-close:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.hint-content {
  padding: var(--space-lg);
}

.hint-content p {
  margin: 0;
  color: var(--text-primary);
  line-height: var(--line-height-normal);
}

/* Swipe Instructions */
.swipe-instructions {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  z-index: 1001;
  animation: fadeIn 0.3s ease;
}

.swipe-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  position: relative;
}

.swipe-icon {
  font-size: var(--font-size-xl);
  color: var(--primary-color);
  animation: swipeAnimation 2s infinite;
}

@keyframes swipeAnimation {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
}

.swipe-text {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  font-weight: 500;
}

.swipe-close {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.swipe-close:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .quiz-header {
    padding: var(--space-sm);
  }
  
  .question-card {
    padding: var(--space-md);
  }
  
  .answer-options {
    padding: 0 var(--space-md) var(--space-md);
  }
  
  .quiz-actions {
    padding: var(--space-md);
  }
  
  .quiz-footer {
    padding: var(--space-sm) var(--space-md);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .quiz-footer {
    background: var(--bg-primary);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .progress-fill,
  .action-btn,
  .swipe-icon {
    transition: none;
    animation: none;
  }
}
</style>
