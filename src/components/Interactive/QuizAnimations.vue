<template>
  <div class="quiz-animations-wrapper">
    <!-- Question transition animation -->
    <Transition 
      :name="questionTransition" 
      mode="out-in"
      @before-enter="onQuestionBeforeEnter"
      @enter="onQuestionEnter"
      @after-enter="onQuestionAfterEnter"
      @before-leave="onQuestionBeforeLeave"
      @leave="onQuestionLeave"
      @after-leave="onQuestionAfterLeave"
    >
      <div 
        :key="currentQuestionIndex" 
        class="question-container"
        :class="questionClasses"
      >
        <!-- Question header with progress animation -->
        <div class="question-header">
          <div class="question-counter">
            <span class="counter-number" :class="{ 'counter-animated': isCounterAnimating }">
              {{ currentQuestionIndex + 1 }}
            </span>
            <span class="counter-separator">/</span>
            <span class="counter-total">{{ totalQuestions }}</span>
          </div>
          
          <!-- Animated progress bar -->
          <div class="progress-container">
            <div class="progress-background">
              <div 
                class="progress-fill"
                :style="{ width: progressPercentage + '%' }"
                :class="{ 'progress-animated': isProgressAnimating }"
              ></div>
            </div>
            <div class="progress-text">{{ Math.round(progressPercentage) }}%</div>
          </div>
        </div>

        <!-- Question content -->
        <div class="question-content" ref="questionContentRef">
          <div class="question-text" v-html="currentQuestion.content"></div>
          
          <!-- Choices with staggered animation -->
          <div class="choices-container">
            <div 
              v-for="(choice, index) in currentQuestion.choices"
              :key="choice.id"
              class="choice-item"
              :class="getChoiceClasses(choice)"
              :style="{ animationDelay: index * 100 + 'ms' }"
              @click="selectChoice(choice)"
              ref="choiceRefs"
            >
              <div class="choice-indicator">
                <span class="choice-letter">{{ String.fromCharCode(65 + index) }}</span>
                <div class="choice-check" v-if="isChoiceSelected(choice.id)">
                  <i class="fas fa-check"></i>
                </div>
              </div>
              <div class="choice-content">
                <FormattedText
                  :content="choice.content"
                  :preserve-formatting="true"
                  font-family="monospace"
                />
              </div>
              
              <!-- Answer feedback -->
              <div 
                v-if="showAnswer && choice.is_correct" 
                class="answer-feedback correct"
              >
                <i class="fas fa-check-circle"></i>
                <span>Đúng!</span>
              </div>
              <div 
                v-else-if="showAnswer && isChoiceSelected(choice.id) && !choice.is_correct" 
                class="answer-feedback incorrect"
              >
                <i class="fas fa-times-circle"></i>
                <span>Sai!</span>
              </div>
            </div>
          </div>

          <!-- Explanation with reveal animation -->
          <Transition name="explanation">
            <div v-if="showAnswer && currentQuestion.explanation" class="explanation-container">
              <div class="explanation-header">
                <i class="fas fa-lightbulb"></i>
                <span>Giải thích</span>
              </div>
              <div class="explanation-content" v-html="currentQuestion.explanation"></div>
              
              <!-- Translation Toggle -->
              <TranslationToggle 
                v-if="currentQuestion?.vietnamese_translation"
                :translation="currentQuestion.vietnamese_translation"
              />
            </div>
          </Transition>
        </div>

        <!-- Quiz controls with animations -->
        <div class="quiz-controls">
          <button 
            class="control-button prev-button"
            :class="{ 'button-disabled': currentQuestionIndex === 0 }"
            @click="previousQuestion"
            :disabled="currentQuestionIndex === 0"
          >
            <i class="fas fa-chevron-left"></i>
            <span>Trước</span>
          </button>

          <button 
            class="control-button submit-button"
            :class="{ 'button-animated': canSubmit }"
            @click="submitAnswer"
            :disabled="!canSubmit"
          >
            <span v-if="!isSubmitting">Kiểm tra</span>
            <span v-else class="button-loading">
              <div class="spinner spinner-small"></div>
              Đang xử lý...
            </span>
          </button>

          <button 
            class="control-button next-button"
            :class="{ 'button-disabled': currentQuestionIndex === totalQuestions - 1 }"
            @click="nextQuestion"
            :disabled="currentQuestionIndex === totalQuestions - 1"
          >
            <span>Tiếp</span>
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Score animation overlay -->
    <Transition name="score-overlay">
      <div v-if="showScoreAnimation" class="score-overlay">
        <div class="score-container">
          <div class="score-icon">
            <i :class="scoreIconClass"></i>
          </div>
          <div class="score-text">
            <div class="score-title">{{ scoreTitle }}</div>
            <div class="score-message">{{ scoreMessage }}</div>
          </div>
          <div class="score-actions">
            <button @click="closeScoreAnimation" class="score-button">
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Particle effects -->
    <div v-if="showParticles" class="particles-container">
      <div 
        v-for="particle in particles" 
        :key="particle.id"
        class="particle"
        :style="particle.style"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import FormattedText from '@/components/Shared/FormattedText.vue'
import TranslationToggle from '@/components/Shared/TranslationToggle.vue'

const props = defineProps({
  currentQuestion: {
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
  selectedChoices: {
    type: Array,
    default: () => []
  },
  showAnswer: {
    type: Boolean,
    default: false
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  quizMode: {
    type: String,
    default: 'practice'
  },
  animationType: {
    type: String,
    default: 'slide',
    validator: (value) => ['slide', 'fade', 'scale', 'flip'].includes(value)
  },
  enableParticles: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['choice-selected', 'submit-answer', 'next-question', 'previous-question'])

// Reactive state
const questionContentRef = ref(null)
const choiceRefs = ref([])
const isCounterAnimating = ref(false)
const isProgressAnimating = ref(false)
const isSubmitting = ref(false)
const showScoreAnimation = ref(false)
const showParticles = ref(false)
const particles = ref([])
const canSubmit = ref(false)

// Computed properties
const progressPercentage = computed(() => {
  return ((props.currentQuestionIndex + 1) / props.totalQuestions) * 100
})

const questionTransition = computed(() => {
  return `question-${props.animationType}`
})

const questionClasses = computed(() => [
  'question-wrapper',
  `question-${props.quizMode}`,
  {
    'question-showing-answer': props.showAnswer,
    'question-correct': props.isCorrect,
    'question-incorrect': !props.isCorrect && props.showAnswer
  }
])

const scoreIconClass = computed(() => {
  return props.isCorrect ? 'fas fa-check-circle text-success' : 'fas fa-times-circle text-danger'
})

const scoreTitle = computed(() => {
  return props.isCorrect ? 'Chính xác!' : 'Không đúng!'
})

const scoreMessage = computed(() => {
  return props.isCorrect 
    ? 'Bạn đã trả lời đúng câu hỏi này!' 
    : 'Hãy xem giải thích để hiểu rõ hơn.'
})

// Methods
const selectChoice = (choice) => {
  if (props.showAnswer) return
  
  emit('choice-selected', choice.id)
  triggerChoiceAnimation(choice.id)
}

const isChoiceSelected = (choiceId) => {
  return props.selectedChoices.includes(choiceId)
}

const getChoiceClasses = (choice) => {
  return [
    'choice-item-base',
    {
      'choice-selected': isChoiceSelected(choice.id),
      'choice-correct': props.showAnswer && choice.is_correct,
      'choice-incorrect': props.showAnswer && isChoiceSelected(choice.id) && !choice.is_correct
    }
  ]
}

const submitAnswer = async () => {
  if (!canSubmit.value || isSubmitting.value) return
  
  isSubmitting.value = true
  
  // Trigger submit animation
  await triggerSubmitAnimation()
  
  emit('submit-answer')
  
  // Show score animation
  showScoreAnimation.value = true
  
  // Hide after delay
  setTimeout(() => {
    showScoreAnimation.value = false
    isSubmitting.value = false
  }, 2000)
}

const previousQuestion = () => {
  if (props.currentQuestionIndex === 0) return
  emit('previous-question')
}

const nextQuestion = () => {
  if (props.currentQuestionIndex === props.totalQuestions - 1) return
  emit('next-question')
}

const closeScoreAnimation = () => {
  showScoreAnimation.value = false
}

// Animation methods
const triggerChoiceAnimation = (choiceId) => {
  const choiceElement = choiceRefs.value.find(el => 
    el.querySelector(`[data-choice-id="${choiceId}"]`)
  )
  
  if (choiceElement) {
    choiceElement.classList.add('choice-animated')
    setTimeout(() => {
      choiceElement.classList.remove('choice-animated')
    }, 300)
  }
}

const triggerSubmitAnimation = () => {
  return new Promise((resolve) => {
    // Animate progress bar
    isProgressAnimating.value = true
    setTimeout(() => {
      isProgressAnimating.value = false
    }, 500)
    
    // Create particles if enabled
    if (props.enableParticles) {
      createParticles()
    }
    
    setTimeout(resolve, 500)
  })
}

const createParticles = () => {
  showParticles.value = true
  particles.value = []
  
  for (let i = 0; i < 20; i++) {
    particles.value.push({
      id: Date.now() + i,
      style: {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 2 + 's',
        animationDuration: (Math.random() * 3 + 2) + 's'
      }
    })
  }
  
  setTimeout(() => {
    showParticles.value = false
    particles.value = []
  }, 5000)
}

// Question transition handlers
const onQuestionBeforeEnter = (el) => {
  el.style.opacity = '0'
  el.style.transform = getQuestionInitialTransform()
}

const onQuestionEnter = (el, done) => {
  nextTick(() => {
    el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    el.style.opacity = '1'
    el.style.transform = 'translateX(0) translateY(0) scale(1)'
    
    // Animate counter
    isCounterAnimating.value = true
    setTimeout(() => {
      isCounterAnimating.value = false
    }, 300)
    
    setTimeout(done, 500)
  })
}

const onQuestionAfterEnter = (el) => {
  el.style.transition = ''
  
  // Stagger choice animations
  nextTick(() => {
    choiceRefs.value.forEach((choice, index) => {
      if (choice) {
        choice.style.animationDelay = (index * 100) + 'ms'
        choice.classList.add('choice-stagger-in')
      }
    })
  })
}

const onQuestionBeforeLeave = (el) => {
  // Remove choice animations
  choiceRefs.value.forEach(choice => {
    if (choice) {
      choice.classList.remove('choice-stagger-in')
    }
  })
}

const onQuestionLeave = (el, done) => {
  el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  el.style.opacity = '0'
  el.style.transform = getQuestionExitTransform()
  
  setTimeout(done, 300)
}

const onQuestionAfterLeave = (el) => {
  el.style.transition = ''
}

// Helper functions
const getQuestionInitialTransform = () => {
  switch (props.animationType) {
    case 'slide':
      return 'translateX(50px)'
    case 'scale':
      return 'scale(0.9)'
    case 'flip':
      return 'rotateY(90deg)'
    default:
      return 'translateY(20px)'
  }
}

const getQuestionExitTransform = () => {
  switch (props.animationType) {
    case 'slide':
      return 'translateX(-50px)'
    case 'scale':
      return 'scale(1.1)'
    case 'flip':
      return 'rotateY(-90deg)'
    default:
      return 'translateY(-20px)'
  }
}

// Watch for changes
watch(() => props.selectedChoices, (newChoices) => {
  canSubmit.value = newChoices.length > 0
}, { immediate: true })

watch(() => props.currentQuestionIndex, () => {
  // Reset animations when question changes
  isCounterAnimating.value = false
  isProgressAnimating.value = false
})
</script>

<style scoped>
/* ===== QUIZ ANIMATIONS STYLES ===== */

.quiz-animations-wrapper {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

/* ===== QUESTION CONTAINER ===== */
.question-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.question-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  transform: scaleX(0);
  transition: transform 0.5s ease;
}

.question-container.question-showing-answer::before {
  transform: scaleX(1);
}

/* ===== QUESTION HEADER ===== */
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.question-counter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-dark);
}

.counter-number {
  background: var(--color-primary);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.counter-animated {
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.counter-separator {
  color: #9ca3af;
}

.counter-total {
  color: #6b7280;
}

/* ===== PROGRESS BAR ===== */
.progress-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  max-width: 300px;
  margin-left: 2rem;
}

.progress-background {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  border-radius: 4px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-animated {
  animation: progressPulse 0.8s ease-in-out;
}

@keyframes progressPulse {
  0%, 100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(1.05);
  }
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  min-width: 40px;
  text-align: right;
}

/* ===== QUESTION CONTENT ===== */
.question-content {
  margin-bottom: 2rem;
}

.question-text {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--color-text-dark);
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid var(--color-primary);
}

/* ===== CHOICES ===== */
.choices-container {
  display: grid;
  gap: 1rem;
}

.choice-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(20px);
}

.choice-item.choice-stagger-in {
  animation: fadeInUp 0.5s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.choice-item:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
}

.choice-item.choice-selected {
  border-color: var(--color-primary);
  background: rgba(79, 70, 229, 0.05);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.choice-item.choice-correct {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.choice-item.choice-incorrect {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.choice-item.choice-animated {
  animation: choiceBounce 0.3s ease;
}

@keyframes choiceBounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.choice-indicator {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.choice-item.choice-selected .choice-indicator {
  background: var(--color-primary);
  color: white;
}

.choice-item.choice-correct .choice-indicator {
  background: #10b981;
  color: white;
}

.choice-item.choice-incorrect .choice-indicator {
  background: #ef4444;
  color: white;
}

.choice-letter {
  font-size: 1rem;
}

.choice-check {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  animation: checkBounce 0.3s ease;
}

@keyframes checkBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.choice-content {
  flex: 1;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-text-dark);
}

/* ===== ANSWER FEEDBACK ===== */
.answer-feedback {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  animation: feedbackSlide 0.3s ease;
}

@keyframes feedbackSlide {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

.answer-feedback.correct {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.answer-feedback.incorrect {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* ===== EXPLANATION ===== */
.explanation-container {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border-left: 4px solid #f59e0b;
}

.explanation-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #92400e;
}

.explanation-content {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-dark);
}

.explanation-enter-active,
.explanation-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.explanation-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.explanation-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* ===== QUIZ CONTROLS ===== */
.quiz-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 2px solid #f3f4f6;
}

.control-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.prev-button {
  background: #f3f4f6;
  color: #6b7280;
}

.next-button {
  background: #f3f4f6;
  color: #6b7280;
}

.submit-button {
  background: var(--color-primary);
  color: white;
  flex: 1;
  max-width: 200px;
  margin: 0 auto;
}

.control-button:hover:not(.button-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.control-button.button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-button.button-animated {
  animation: pulse 2s infinite;
}

.button-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ===== SCORE ANIMATION ===== */
.score-overlay {
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
}

.score-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  margin: 1rem;
  animation: scoreBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes scoreBounce {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.score-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.score-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.score-message {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.score-button {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.score-button:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
}

/* ===== PARTICLE EFFECTS ===== */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--color-primary);
  border-radius: 50%;
  animation: particleFloat linear;
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) scale(0);
    opacity: 0;
  }
}

/* ===== QUESTION TRANSITIONS ===== */
.question-slide-enter-active,
.question-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.question-slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.question-slide-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.question-fade-enter-active,
.question-fade-leave-active {
  transition: opacity 0.4s ease;
}

.question-fade-enter-from,
.question-fade-leave-to {
  opacity: 0;
}

.question-scale-enter-active,
.question-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.question-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.question-scale-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.question-flip-enter-active,
.question-flip-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.question-flip-enter-from {
  opacity: 0;
  transform: rotateY(90deg);
}

.question-flip-leave-to {
  opacity: 0;
  transform: rotateY(-90deg);
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 768px) {
  .quiz-animations-wrapper {
    padding: 1rem;
  }
  
  .question-container {
    padding: 1.5rem;
  }
  
  .question-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .progress-container {
    margin-left: 0;
  }
  
  .quiz-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .control-button {
    width: 100%;
    justify-content: center;
  }
  
  .choice-item {
    padding: 1rem;
  }
  
  .choice-indicator {
    width: 36px;
    height: 36px;
  }
  
  /* Reduce animations on mobile */
  .choice-item:hover {
    transform: none;
  }
  
  .control-button:hover {
    transform: none;
  }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
  .question-container,
  .choice-item,
  .control-button,
  .score-container,
  .particle {
    animation: none !important;
    transition: none !important;
  }
  
  .choice-item.choice-stagger-in {
    opacity: 1;
    transform: none;
  }
}
</style>
