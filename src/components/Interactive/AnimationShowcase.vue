<template>
  <div class="animation-showcase">
    <div class="showcase-header">
      <h1>Interactive Animations Showcase</h1>
      <p>Demonstration of all animation features</p>
    </div>

    <!-- Micro-interactions Section -->
    <section class="showcase-section">
      <h2>Micro-interactions</h2>
      
      <div class="demo-grid">
        <!-- Button Animations -->
        <div class="demo-item">
          <h3>Button Animations</h3>
          <div class="demo-buttons">
            <MicroInteractions type="button" variant="primary" ripple>
              <i class="fas fa-save"></i>
              Primary Button
            </MicroInteractions>
            
            <MicroInteractions type="button" variant="success" bounce>
              <i class="fas fa-check"></i>
              Success Button
            </MicroInteractions>
            
            <MicroInteractions type="button" variant="danger" shake>
              <i class="fas fa-trash"></i>
              Danger Button
            </MicroInteractions>
            
            <MicroInteractions type="button" variant="warning" pulse>
              <i class="fas fa-exclamation"></i>
              Warning Button
            </MicroInteractions>
          </div>
        </div>

        <!-- Card Animations -->
        <div class="demo-item">
          <h3>Card Hover Effects</h3>
          <div class="demo-cards">
            <MicroInteractions type="card" hover>
              <div class="card-content">
                <h4>Interactive Card</h4>
                <p>Hover to see the effect</p>
              </div>
            </MicroInteractions>
            
            <MicroInteractions type="card" hover bounce>
              <div class="card-content">
                <h4>Bouncy Card</h4>
                <p>Click for bounce effect</p>
              </div>
            </MicroInteractions>
          </div>
        </div>

        <!-- Link Animations -->
        <div class="demo-item">
          <h3>Link Underline Effects</h3>
          <div class="demo-links">
            <MicroInteractions type="link" href="#">
              Hover Link Effect
            </MicroInteractions>
            <MicroInteractions type="link" href="#" variant="success">
              Success Link
            </MicroInteractions>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading Animations Section -->
    <section class="showcase-section">
      <h2>Loading Animations</h2>
      
      <div class="demo-grid">
        <!-- Spinner Loading -->
        <div class="demo-item">
          <h3>Spinner Loading</h3>
          <div class="demo-loading">
            <LoadingAnimations type="spinner" text="Loading..." size="small" />
            <LoadingAnimations type="spinner" text="Loading..." size="medium" />
            <LoadingAnimations type="spinner" text="Loading..." size="large" />
          </div>
        </div>

        <!-- Dots Loading -->
        <div class="demo-item">
          <h3>Dots Loading</h3>
          <div class="demo-loading">
            <LoadingAnimations type="dots" text="Processing..." />
          </div>
        </div>

        <!-- Bars Loading -->
        <div class="demo-item">
          <h3>Bars Loading</h3>
          <div class="demo-loading">
            <LoadingAnimations type="bars" text="Analyzing..." />
          </div>
        </div>

        <!-- Pulse Loading -->
        <div class="demo-item">
          <h3>Pulse Loading</h3>
          <div class="demo-loading">
            <LoadingAnimations type="pulse" text="Syncing..." />
          </div>
        </div>

        <!-- Skeleton Loading -->
        <div class="demo-item">
          <h3>Skeleton Loading</h3>
          <LoadingAnimations type="skeleton" :lines="4" />
        </div>

        <!-- Card Skeleton -->
        <div class="demo-item">
          <h3>Card Skeleton</h3>
          <LoadingAnimations type="card" />
        </div>

        <!-- Progress Loading -->
        <div class="demo-item">
          <h3>Progress Loading</h3>
          <LoadingAnimations 
            type="progress" 
            :progress="progressValue" 
            text="Uploading files..."
          />
          <button @click="startProgress" class="btn btn-primary mt-3">
            Start Progress
          </button>
        </div>
      </div>
    </section>

    <!-- Quiz Animations Section -->
    <section class="showcase-section">
      <h2>Quiz Animations</h2>
      
      <div class="demo-quiz">
        <QuizAnimations
          :currentQuestion="demoQuestion"
          :currentQuestionIndex="currentDemoIndex"
          :totalQuestions="3"
          :selectedChoices="selectedDemoChoices"
          :showAnswer="showDemoAnswer"
          :isCorrect="demoIsCorrect"
          animationType="slide"
          :enableParticles="true"
          @choice-selected="handleDemoChoice"
          @submit-answer="handleDemoSubmit"
          @next-question="nextDemoQuestion"
          @previous-question="prevDemoQuestion"
        />
        
        <div class="quiz-controls-demo">
          <button @click="showDemoAnswer = !showDemoAnswer" class="btn btn-secondary">
            Toggle Answer
          </button>
          <button @click="resetDemoQuiz" class="btn btn-outline">
            Reset Demo
          </button>
        </div>
      </div>
    </section>

    <!-- CSS Animation Classes Section -->
    <section class="showcase-section">
      <h2>CSS Animation Classes</h2>
      
      <div class="demo-grid">
        <!-- Fade Animations -->
        <div class="demo-item">
          <h3>Fade Animations</h3>
          <div class="demo-animations">
            <div class="animate animate-fade-in">Fade In</div>
            <div class="animate animate-fade-in-up">Fade In Up</div>
            <div class="animate animate-fade-in-left">Fade In Left</div>
            <div class="animate animate-fade-in-right">Fade In Right</div>
          </div>
        </div>

        <!-- Scale Animations -->
        <div class="demo-item">
          <h3>Scale Animations</h3>
          <div class="demo-animations">
            <div class="animate animate-scale-in">Scale In</div>
            <div class="animate animate-bounce-in">Bounce In</div>
          </div>
        </div>

        <!-- Slide Animations -->
        <div class="demo-item">
          <h3>Slide Animations</h3>
          <div class="demo-animations">
            <div class="animate animate-slide-in-up">Slide In Up</div>
            <div class="animate animate-slide-in-left">Slide In Left</div>
            <div class="animate animate-slide-in-right">Slide In Right</div>
          </div>
        </div>

        <!-- Special Effects -->
        <div class="demo-item">
          <h3>Special Effects</h3>
          <div class="demo-animations">
            <div class="animate animate-shake" @click="triggerShake">Shake</div>
            <div class="animate animate-wiggle" @click="triggerWiggle">Wiggle</div>
            <div class="animate animate-pulse">Pulse</div>
            <div class="animate animate-heartbeat">Heartbeat</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Animation Controls -->
    <section class="showcase-section">
      <h2>Animation Controls</h2>
      
      <div class="controls-panel">
        <div class="control-group">
          <label>Animation Speed:</label>
          <select v-model="animationSpeed" @change="updateAnimationSpeed">
            <option value="fast">Fast (0.15s)</option>
            <option value="normal">Normal (0.3s)</option>
            <option value="slow">Slow (0.5s)</option>
            <option value="slower">Slower (0.8s)</option>
          </select>
        </div>
        
        <div class="control-group">
          <label>Animation Type:</label>
          <select v-model="animationType" @change="updateAnimationType">
            <option value="fade">Fade</option>
            <option value="slide">Slide</option>
            <option value="scale">Scale</option>
            <option value="flip">Flip</option>
          </select>
        </div>
        
        <div class="control-group">
          <label>
            <input type="checkbox" v-model="enableAnimations" @change="toggleAnimations">
            Enable Animations
          </label>
        </div>
        
        <div class="control-group">
          <label>
            <input type="checkbox" v-model="reduceMotion" @change="toggleReducedMotion">
            Reduce Motion (Accessibility)
          </label>
        </div>
      </div>
    </section>

    <!-- Performance Metrics -->
    <section class="showcase-section">
      <h2>Performance Metrics</h2>
      
      <div class="metrics-panel">
        <div class="metric-item">
          <span class="metric-label">Frame Rate:</span>
          <span class="metric-value">{{ performanceMetrics.frameRate }} FPS</span>
        </div>
        
        <div class="metric-item">
          <span class="metric-label">Animation Count:</span>
          <span class="metric-value">{{ performanceMetrics.animationCount }}</span>
        </div>
        
        <div class="metric-item">
          <span class="metric-label">Memory Usage:</span>
          <span class="metric-value">{{ performanceMetrics.memoryUsage }} KB</span>
        </div>
        
        <div class="metric-item">
          <span class="metric-label">Should Animate:</span>
          <span class="metric-value">{{ shouldAnimate ? 'Yes' : 'No' }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAnimations } from '@/composables/useAnimations'
import MicroInteractions from './MicroInteractions.vue'
import LoadingAnimations from './LoadingAnimations.vue'
import QuizAnimations from './QuizAnimations.vue'

// Animation system
const { 
  performanceMetrics, 
  shouldAnimate, 
  updatePreferences,
  fadeIn,
  shake,
  wiggle
} = useAnimations()

// Demo state
const progressValue = ref(0)
const currentDemoIndex = ref(0)
const selectedDemoChoices = ref([])
const showDemoAnswer = ref(false)
const demoIsCorrect = ref(false)

// Controls
const animationSpeed = ref('normal')
const animationType = ref('fade')
const enableAnimations = ref(true)
const reduceMotion = ref(false)

// Demo quiz data
const demoQuestion = ref({
  id: 1,
  content: 'What is the output of the following Java code?<br><code>System.out.println(5 + 3 * 2);</code>',
  choices: [
    { id: 1, content: 'A. 16', is_correct: false },
    { id: 2, content: 'B. 11', is_correct: true },
    { id: 3, content: 'C. 13', is_correct: false },
    { id: 4, content: 'D. 10', is_correct: false }
  ],
  explanation: 'The multiplication operator has higher precedence than addition, so 3 * 2 = 6, then 5 + 6 = 11.'
})

// Methods
const startProgress = () => {
  progressValue.value = 0
  const interval = setInterval(() => {
    progressValue.value += Math.random() * 10
    if (progressValue.value >= 100) {
      progressValue.value = 100
      clearInterval(interval)
    }
  }, 200)
}

const handleDemoChoice = (choiceId) => {
  const index = selectedDemoChoices.value.indexOf(choiceId)
  if (index > -1) {
    selectedDemoChoices.value.splice(index, 1)
  } else {
    selectedDemoChoices.value = [choiceId]
  }
}

const handleDemoSubmit = () => {
  const correctChoice = demoQuestion.value.choices.find(c => c.is_correct)
  demoIsCorrect.value = selectedDemoChoices.value.includes(correctChoice.id)
  showDemoAnswer.value = true
}

const nextDemoQuestion = () => {
  if (currentDemoIndex.value < 2) {
    currentDemoIndex.value++
    resetDemoState()
  }
}

const prevDemoQuestion = () => {
  if (currentDemoIndex.value > 0) {
    currentDemoIndex.value--
    resetDemoState()
  }
}

const resetDemoQuiz = () => {
  currentDemoIndex.value = 0
  resetDemoState()
}

const resetDemoState = () => {
  selectedDemoChoices.value = []
  showDemoAnswer.value = false
  demoIsCorrect.value = false
}

const triggerShake = () => {
  shake(document.querySelector('.animate-shake'))
}

const triggerWiggle = () => {
  wiggle(document.querySelector('.animate-wiggle'))
}

const updateAnimationSpeed = () => {
  const speeds = {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 800
  }
  updatePreferences({ animationDuration: speeds[animationSpeed.value] })
}

const updateAnimationType = () => {
  // Update global animation type preference
  updatePreferences({ animationType: animationType.value })
}

const toggleAnimations = () => {
  updatePreferences({ reducedMotion: !enableAnimations.value })
}

const toggleReducedMotion = () => {
  updatePreferences({ reducedMotion: reduceMotion.value })
}

// Initialize
onMounted(() => {
  fadeIn(document.querySelector('.animation-showcase'))
})
</script>

<style scoped>
.animation-showcase {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.showcase-header {
  text-align: center;
  margin-bottom: 3rem;
}

.showcase-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.showcase-header p {
  font-size: 1.125rem;
  color: #6b7280;
}

.showcase-section {
  margin-bottom: 4rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.showcase-section h2 {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--color-text-dark);
  margin-bottom: 2rem;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 1rem;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.demo-item {
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.demo-item h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-dark);
  margin-bottom: 1rem;
}

.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.demo-cards {
  display: flex;
  gap: 1rem;
}

.demo-cards .card-content {
  padding: 1.5rem;
  text-align: center;
}

.demo-cards h4 {
  margin-bottom: 0.5rem;
  color: var(--color-text-dark);
}

.demo-cards p {
  color: #6b7280;
  font-size: 0.875rem;
}

.demo-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.demo-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.demo-animations {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.demo-animations > div {
  padding: 1rem;
  background: var(--color-primary);
  color: white;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.demo-animations > div:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
}

.demo-quiz {
  max-width: 800px;
  margin: 0 auto;
}

.quiz-controls-demo {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.controls-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 500;
  color: var(--color-text-dark);
}

.control-group select,
.control-group input[type="checkbox"] {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.control-group input[type="checkbox"] {
  width: auto;
  margin-right: 0.5rem;
}

.metrics-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.metric-label {
  font-weight: 500;
  color: var(--color-text-dark);
}

.metric-value {
  font-weight: 600;
  color: var(--color-primary);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-outline:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}

.mt-3 {
  margin-top: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .animation-showcase {
    padding: 1rem;
  }
  
  .showcase-section {
    padding: 1.5rem;
  }
  
  .demo-grid {
    grid-template-columns: 1fr;
  }
  
  .demo-buttons {
    flex-direction: column;
  }
  
  .demo-cards {
    flex-direction: column;
  }
  
  .controls-panel,
  .metrics-panel {
    grid-template-columns: 1fr;
  }
}
</style>
