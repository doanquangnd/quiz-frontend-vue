<template>
    <div>
        <PageTitle :title="exam ? ($t('quiz') + ' - ' + exam.title) : $t('quiz')" />
        <AppLayout>
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">{{ $t('loading') || 'Đang tải...' }}</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="alert alert-danger">
                <h5 class="alert-heading">Lỗi</h5>
                <p>{{ error }}</p>
            </div>

            <!-- Quiz Content -->
            <div v-else-if="exam && questions.length > 0">
            
            <!-- Quiz Header -->
            <QuizHeader
                :exam="exam"
                :current-question-index="currentQuestionIndex"
                :total-questions="shuffledQuestions.length"
                :quiz-mode="quizMode"
                :time-elapsed="timeElapsed"
                :time-remaining="timeRemaining"
                :answered-count="answeredCount"
                :correct-count="correctCount"
                :incorrect-count="incorrectCount"
                @pause-quiz="pauseQuiz"
            />

            <!-- Question Card -->
            <QuestionCard
                v-if="currentQuestion && quizMode"
                :quiz-mode="quizMode"
                :current-question="currentQuestion"
                :current-question-index="currentQuestionIndex"
                :shuffled-questions="shuffledQuestions"
                :shuffled-choices="shuffledChoices"
                :selected="selected"
                :show-answer="showAnswer"
                :answered-questions="answeredQuestions"
                @previous-question="previousQuestion"
                @next-question="nextQuestion"
                @check-answer="checkAnswer"
                @finish-exam="finishExam"
                @choice-change="handleChoiceChange"
                @go-to-question="goToQuestion"
                @submit-answer="checkAnswer"
                @submit-exam="finishExam"
            />

            <!-- Mode Selection Modal -->
            <ModeSelectionModal
                :show="showModeSelection"
                :exam-duration="exam.duration_minutes || 60"
                @select-mode="selectMode"
                @exit-to-detail="exitToExamDetail"
            />

            <!-- Pause Modal -->
            <PauseModal
                :show="showPauseModal"
                :time-elapsed="timeElapsed"
                @resume-quiz="resumeQuiz"
                @exit-to-detail="exitToExamDetail"
            />

            <!-- Resume Progress Modal -->
            <ResumeProgressModal
                :show="showResumeModal"
                :saved-progress="savedProgress"
                @resume-progress="resumeProgress"
                @start-fresh="startFresh"
                @exit-to-detail="exitToExamDetail"
            />

            <!-- Result Modal -->
            <ResultModal
                :show="showResult"
                :score="correctCount"
                :total-questions="shuffledQuestions.length"
                :correct-count="correctCount"
                :incorrect-count="incorrectCount"
                :exam-slug="exam.slug"
                :pass-percent="exam.passing_score || 70"
                :quiz-mode="quizMode"
                @close="handleResultModalClose"
            />
            </div>

            <!-- No Data State -->
            <div v-else class="alert alert-warning">
                <h5>{{ $t('no_data') || 'Không có dữ liệu' }}</h5>
                <p>{{ $t('no_questions_found') || 'Không tìm thấy câu hỏi' }}</p>
            </div>
        </AppLayout>
    </div>
</template>

<script setup>
import PageTitle from '@/components/PageTitle.vue'
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue"
import { useRoute } from 'vue-router'
import AppLayout from "@/layouts/AppLayout.vue"
import QuizHeader from "@/components/Quiz/QuizHeader.vue"
import QuestionCard from "@/components/Quiz/QuestionCard.vue"
import ModeSelectionModal from "@/components/Quiz/ModeSelectionModal.vue"
import PauseModal from "@/components/Quiz/PauseModal.vue"
import ResumeProgressModal from "@/components/Quiz/ResumeProgressModal.vue"
import ResultModal from "@/components/Quiz/ResultModal.vue"
import { debouncedHighlightCodeBlocks, processContentForHighlight } from "@/utils/highlight.js"
import { useTranslation } from '@/composables/useTranslation'
import { http } from '@/api/http-client'
import { useAuthStore } from '@/stores/auth'

// Get route params
const route = useRoute()
const authStore = useAuthStore()

// Composables
const { t } = useTranslation()

// Data from API
const exam = ref(null)
const questions = ref([])
const loading = ref(true)
const error = ref(null)

// Fetch quiz data from API
const fetchQuizData = async () => {
    try {
        loading.value = true
        error.value = null
        
        const examSlug = route.params.examSlug
        
        // Get quiz data (exam + questions)
        const response = await http.get(`/api/exams/${examSlug}/quiz`)
        
        if (response.data.success) {
            exam.value = response.data.data.exam
            questions.value = response.data.data.questions
        } else {
            error.value = 'Failed to load quiz data'
        }
    } catch (err) {
        console.error('Error fetching quiz data:', err)
        error.value = err.message || 'Failed to load quiz data'
    } finally {
        loading.value = false
    }
}

// Lấy user từ auth store
const currentUser = computed(() => authStore.user)

// Tạo unique identifier cho localStorage (tránh conflict giữa users)
const getUserIdentifier = () => {
  // Nếu có user, dùng user_id
  if (currentUser.value?.id) {
    return `user_${currentUser.value.id}`
  }
  
  // Nếu guest, dùng session_id từ cookie hoặc tạo mới
  let sessionId = localStorage.getItem('quiz_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('quiz_session_id', sessionId)
  }
  return sessionId
}

const userIdentifier = getUserIdentifier()

// Reactive data
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
const currentQuestionIndex = ref(0)
const showAnswer = ref(false)
const selected = ref([])
const correctCount = ref(0)
const answeredCount = ref(0)
const showResult = ref(false)
const shuffledChoices = ref([])
const shuffledQuestions = ref([])
const showResumeModal = ref(false)
const savedProgress = ref(null)
const answeredQuestions = ref([]) // Danh sách index các câu đã trả lời
const answeredDetails = ref({}) // Object lưu chi tiết từng câu: {questionId: {selected, isCorrect, timeSpent}}
const questionStartTime = ref(null) // Thời điểm bắt đầu câu hỏi hiện tại

// Chế độ làm bài
const quizMode = ref(null) // 'practice' hoặc 'exam'
const showModeSelection = ref(false)
const isPaused = ref(false)
const showPauseModal = ref(false)

// Timer
const timeElapsed = ref(0)
const timeRemaining = ref(0)
const timerInterval = ref(null)

// Computed
const currentQuestion = computed(() => {
    return shuffledQuestions.value[currentQuestionIndex.value] || null
})

const incorrectCount = computed(() => {
    return answeredCount.value - correctCount.value
})

const isCurrentAnswerCorrect = computed(() => {
    const correctIds =
        currentQuestion.value?.choices
            ?.filter((c) => c.is_correct)
            .map((c) => String(c.id)) || [];
    const selectedIds = selected.value.map(String);
    return (
        correctIds.length === selectedIds.length &&
        correctIds.every((id) => selectedIds.includes(id))
    );
})

const correctLettersDisplay = computed(() => {
    const correctIds =
        currentQuestion.value?.choices
            ?.filter((c) => c.is_correct)
            .map((c) => c.id) || [];
    return correctIds
        .map((id) => {
            const idx = shuffledChoices.value.findIndex(
                (c) => String(c.id) === String(id)
            );
            return letters[idx];
        })
        .join(", ");
})

// Methods
const handleChoiceChange = (choiceId) => {
    if (showAnswer.value) return
    
    if (currentQuestion.value?.choices?.filter(c => c.is_correct).length > 1) {
        // Multiple choice
        const index = selected.value.indexOf(choiceId)
        if (index > -1) {
            selected.value.splice(index, 1)
        } else {
            selected.value.push(choiceId)
        }
    } else {
        // Single choice
        selected.value = [choiceId]
    }
}

const checkAnswer = () => {
    if (selected.value.length === 0) return
    
    // Practice mode: hiển thị đáp án ngay
    if (quizMode.value === 'practice') {
        showAnswer.value = true
        answeredCount.value++
        if (isCurrentAnswerCorrect.value) correctCount.value++
        
        // Scroll xuống phần kết quả sau khi hiển thị đáp án
        nextTick(() => {
            scrollToResult()
        })
    } 
    // Exam mode: chỉ đánh dấu đã trả lời, không hiện đáp án
    else if (quizMode.value === 'exam') {
        if (!answeredQuestions.value.includes(currentQuestionIndex.value)) {
            answeredQuestions.value.push(currentQuestionIndex.value)
        }
        
        // Lưu chi tiết câu trả lời
        const questionId = currentQuestion.value.id
        
        // Tính thời gian làm câu này
        let timeSpent = 0
        if (questionStartTime.value) {
            timeSpent = Math.floor((Date.now() - questionStartTime.value) / 1000)
        }
        
        answeredDetails.value[questionId] = {
            question_id: questionId,
            selected_choice_ids: selected.value,
            is_correct: isCurrentAnswerCorrect.value,
            time_spent_seconds: timeSpent
        }
        
        // Reset timer cho câu tiếp theo
        questionStartTime.value = Date.now()
        
        // Tính điểm nhưng không hiển thị
        if (isCurrentAnswerCorrect.value) correctCount.value++
        answeredCount.value++
    }
    
    // Lưu progress sau khi submit
    saveProgress()
}

// Function để scroll xuống phần kết quả
const scrollToResult = () => {
    const resultSection = document.getElementById('quiz-result-section')
    if (resultSection) {
        // Scroll với offset để không bị che bởi header
        const offset = 100
        const elementPosition = resultSection.offsetTop - offset
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        })
    }
}

// Function để scroll lên top khi chuyển câu
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

const nextQuestion = () => {
    if (currentQuestionIndex.value < shuffledQuestions.value.length - 1) {
        // Scroll to top with smooth animation
        scrollToTop()
        
        currentQuestionIndex.value++
        selected.value = []
        showAnswer.value = false
        
        // Reset timer cho câu mới (exam mode)
        if (quizMode.value === 'exam') {
            questionStartTime.value = Date.now()
        }
        
        // Shuffle choices for new question
        if (currentQuestion.value?.choices) {
            shuffledChoices.value = [...currentQuestion.value.choices].sort(() => Math.random() - 0.5)
        }
        
        // Save progress
        saveProgress()
        
        // Re-apply highlight
        nextTick(() => {
            debouncedHighlightCodeBlocks(document, nextTick, 150)
        })
    } else {
        // Practice mode: hiển thị kết quả ngay
        if (quizMode.value === 'practice') {
            showResult.value = true
            stopTimer()
            clearProgress()
        }
        // Exam mode: cần nhấn nút nộp bài
    }
}

const previousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
        // Scroll to top with smooth animation
        scrollToTop()
        
        currentQuestionIndex.value--
        selected.value = []
        showAnswer.value = false
        
        // Shuffle choices for previous question
        if (currentQuestion.value?.choices) {
            shuffledChoices.value = [...currentQuestion.value.choices].sort(() => Math.random() - 0.5)
        }
        
        // Re-apply highlight
        nextTick(() => {
            debouncedHighlightCodeBlocks(document, nextTick, 150)
        })
    }
}

const finishExam = async () => {
    // PRACTICE MODE: Chỉ lưu localStorage, không call API
    if (quizMode.value === 'practice') {
        // Đánh dấu đã hoàn thành trong localStorage (giữ lại kết quả thi thử)
        localStorage.setItem(`exam_completed_${userIdentifier}_${exam.value.id}_practice`, JSON.stringify({
            completed_at: new Date().toISOString(),
            score: correctCount.value,
            total: shuffledQuestions.value.length,
            mode: 'practice'
        }))
        
        showResult.value = true
        // KHÔNG clear progress cho practice mode - user có thể review
        return
    }
    
    // EXAM MODE: Lưu vào database
    try {
        // Chuẩn bị data chi tiết từng câu trả lời
        const answers = Object.values(answeredDetails.value)
        
        // Gọi API để hoàn thành exam với chi tiết answers
        const response = await http.post(`/api/exams/${exam.value.slug}/complete`, {
            time_spent_seconds: exam.value.duration_minutes * 60 - timeRemaining.value,
            score: correctCount.value,
            total_questions: shuffledQuestions.value.length,
            answers: answers // Gửi chi tiết từng câu
        })
        
        if (response.data.success) {
            // Lưu thông tin để redirect sau khi đóng modal
            localStorage.setItem(`exam_just_completed_${userIdentifier}_${exam.value.id}`, JSON.stringify({
                completed_at: new Date().toISOString(),
                attempt_id: response.data.attempt?.id,
            }))
            
            // CLEAR HOÀN TOÀN localStorage cho exam mode
            clearProgress()
            localStorage.removeItem(`exam_completed_${userIdentifier}_${exam.value.id}`)
            localStorage.removeItem(`exam_completed_${userIdentifier}_${exam.value.id}_practice`)
            
            showResult.value = true
        }
    } catch (error) {
        console.error('Lỗi khi hoàn thành exam:', error)
        // Vẫn hiển thị result modal nếu API fail
        showResult.value = true
        clearProgress()
    }
}

// Jump to question (cho exam mode)
const goToQuestion = (index) => {
    if (quizMode.value !== 'exam') return
    
    // Scroll to top with smooth animation
    scrollToTop()
    
    currentQuestionIndex.value = index
    selected.value = []
    showAnswer.value = false
    
    // Shuffle choices for the new question
    if (currentQuestion.value?.choices) {
        shuffledChoices.value = [...currentQuestion.value.choices].sort(() => Math.random() - 0.5)
    }
    
    // Lưu progress khi chuyển câu
    saveProgress()
    
    // Re-apply highlight
    nextTick(() => {
        debouncedHighlightCodeBlocks(document, nextTick, 150)
    })
}

// Timer functions
const startTimer = () => {
    stopTimer()
    
    timerInterval.value = setInterval(() => {
        if (isPaused.value) return
        
        if (quizMode.value === 'practice') {
            timeElapsed.value++
        } else if (quizMode.value === 'exam') {
            timeRemaining.value--
            
            // Hết thời gian tự động nộp bài
            if (timeRemaining.value <= 0) {
                stopTimer()
                finishExam()
            }
        }
    }, 1000)
}

const stopTimer = () => {
    if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
    }
}

const pauseQuiz = () => {
    isPaused.value = true
    showPauseModal.value = true
}

const resumeQuiz = () => {
    isPaused.value = false
    showPauseModal.value = false
}

// Mode selection
const selectMode = (mode, shuffleOptions = {}) => {
    quizMode.value = mode
    showModeSelection.value = false
    
    if (mode === 'exam') {
        const duration = exam.value.duration_minutes || 60
        timeRemaining.value = duration * 60
    } else {
        timeElapsed.value = 0
    }
    
    // Shuffle questions nếu được chọn
    if (questions.value && questions.value.length > 0) {
        if (shuffleOptions.shuffleQuestions !== false) { // Mặc định true
            shuffledQuestions.value = [...questions.value].sort(() => Math.random() - 0.5)
        } else {
            shuffledQuestions.value = [...questions.value] // Giữ nguyên thứ tự
        }
    }
    
    // Shuffle choices nếu được chọn
    if (currentQuestion.value?.choices) {
        if (shuffleOptions.shuffleChoices !== false) { // Mặc định true
            shuffledChoices.value = [...currentQuestion.value.choices].sort(() => Math.random() - 0.5)
        } else {
            shuffledChoices.value = [...currentQuestion.value.choices] // Giữ nguyên thứ tự
        }
    }
    
    // Bắt đầu track time cho câu đầu tiên (exam mode)
    if (mode === 'exam') {
        questionStartTime.value = Date.now()
    }
    
    saveProgress()
    startTimer()
    
    nextTick(() => {
        debouncedHighlightCodeBlocks(document, nextTick, 150)
    })
}

// Progress management
const saveProgress = () => {
    const progress = {
        quiz_mode: quizMode.value,
        current_question_index: currentQuestionIndex.value,
        correct_count: correctCount.value,
        answered_count: answeredCount.value,
        selected: [...selected.value],
        show_answer: showAnswer.value,
        time_elapsed: timeElapsed.value,
        time_remaining: timeRemaining.value,
        shuffled_questions: shuffledQuestions.value,
        shuffled_choices: shuffledChoices.value,
        answered_questions: answeredQuestions.value,
        answered_details: answeredDetails.value // Lưu chi tiết answers
    }
    
    try {
        // Key bao gồm user/session identifier
        localStorage.setItem(`quiz_progress_${userIdentifier}_${exam.value.id}`, JSON.stringify(progress))
    } catch (error) {
        // Silent fail
    }
}

const loadProgress = () => {
    try {
        // Load với user/session identifier
        const saved = localStorage.getItem(`quiz_progress_${userIdentifier}_${exam.value.id}`)
        return saved ? JSON.parse(saved) : null
    } catch (error) {
        return null
    }
}

const clearProgress = () => {
    try {
        // Clear với user/session identifier
        localStorage.removeItem(`quiz_progress_${userIdentifier}_${exam.value.id}`)
    } catch (error) {
        // Silent fail
    }
}

const restoreProgress = (progress) => {
    if (!progress) return
    
    currentQuestionIndex.value = progress.current_question_index || 0
    correctCount.value = progress.correct_count || 0
    answeredCount.value = progress.answered_count || 0
    selected.value = progress.selected || []
    showAnswer.value = progress.show_answer || false
    quizMode.value = progress.quiz_mode || 'practice'
    timeElapsed.value = progress.time_elapsed || 0
    const duration = exam.value.duration_minutes || 60
    timeRemaining.value = progress.time_remaining || (duration * 60)
    answeredQuestions.value = progress.answered_questions || []
    answeredDetails.value = progress.answered_details || {} // Restore chi tiết answers
    
    if (progress.shuffled_questions && progress.shuffled_questions.length > 0) {
        shuffledQuestions.value = progress.shuffled_questions
    }
    
    if (progress.shuffled_choices && progress.shuffled_choices.length > 0) {
        shuffledChoices.value = progress.shuffled_choices
    }
}

const resumeProgress = () => {
    const progress = savedProgress.value
    if (progress) {
        restoreProgress(progress)
        showResumeModal.value = false
        startTimer()
    }
}

const startFresh = () => {
    clearProgress()
    // Xóa thông tin exam đã hoàn thành để cho phép làm lại
    localStorage.removeItem(`exam_completed_${userIdentifier}_${exam.value.id}`)
    showResumeModal.value = false
    currentQuestionIndex.value = 0
    correctCount.value = 0
    answeredCount.value = 0
    selected.value = []
    showAnswer.value = false
    showResult.value = false
    timeElapsed.value = 0
    timeRemaining.value = 0
    answeredQuestions.value = []
    answeredDetails.value = {} // Reset chi tiết answers
    showModeSelection.value = true
}

// Exit function
const exitToExamDetail = () => {
    showResumeModal.value = false
    showModeSelection.value = false
    showPauseModal.value = false
    
    stopTimer()
    clearProgress()
    
    window.location.href = `/exams/${exam.value.slug}`
}

// Handle khi đóng result modal
const handleResultModalClose = () => {
    // Nếu là exam mode, đảm bảo localStorage đã clear
    if (quizMode.value === 'exam') {
        clearProgress()
        localStorage.removeItem(`exam_completed_${userIdentifier}_${exam.value.id}`)
        localStorage.removeItem(`exam_completed_${userIdentifier}_${exam.value.id}_practice`)
    }
    
    showResult.value = false
}

// Lifecycle
onMounted(async () => {
    // Fetch quiz data first
    await fetchQuizData()
    
    // Wait for data to be loaded
    if (!exam.value) return
    
    // Kiểm tra xem vừa hoàn thành exam mode chưa
    const justCompleted = localStorage.getItem(`exam_just_completed_${userIdentifier}_${exam.value.id}`)
    if (justCompleted) {
        // Vừa hoàn thành exam mode → Clear và cho chọn mode mới
        localStorage.removeItem(`exam_just_completed_${userIdentifier}_${exam.value.id}`)
        showModeSelection.value = true
        
        nextTick(() => {
            debouncedHighlightCodeBlocks(document, nextTick, 150)
        })
        return
    }
    
    // Kiểm tra progress đang làm dở
    const saved = loadProgress()
    
    if (saved && (saved.quiz_mode || saved.answered_count > 0 || saved.time_elapsed > 0 || saved.time_remaining > 0)) {
        // Có progress đang làm dở
        savedProgress.value = saved
        showResumeModal.value = true
        
        if (saved.shuffled_questions && saved.shuffled_questions.length > 0) {
            shuffledQuestions.value = saved.shuffled_questions
        }
        
        quizMode.value = saved.quiz_mode || null
        timeElapsed.value = saved.time_elapsed || 0
        const duration = exam.value.duration_minutes || 60
        timeRemaining.value = saved.time_remaining || (duration * 60)
        answeredQuestions.value = saved.answered_questions || []
        answeredDetails.value = saved.answered_details || {}
        currentQuestionIndex.value = saved.current_question_index || 0
        correctCount.value = saved.correct_count || 0
        answeredCount.value = saved.answered_count || 0
        selected.value = saved.selected || []
        showAnswer.value = saved.show_answer || false
        
        if (saved.shuffled_choices && saved.shuffled_choices.length > 0) {
            shuffledChoices.value = saved.shuffled_choices
        }
    } else {
        // Không có progress → Chọn mode mới
        showModeSelection.value = true
    }
    
    nextTick(() => {
        debouncedHighlightCodeBlocks(document, nextTick, 150)
    })
})

onBeforeUnmount(() => {
    stopTimer()
    
    if (beforeUnloadHandler) {
        window.removeEventListener('beforeunload', beforeUnloadHandler)
    }
    
    if (visibilityChangeHandler) {
        document.removeEventListener('visibilitychange', visibilityChangeHandler)
    }
})

// Event listeners
let beforeUnloadHandler = null
let visibilityChangeHandler = null

// Setup event listeners
onMounted(() => {
    beforeUnloadHandler = () => {
        saveProgress()
    }
    
    visibilityChangeHandler = () => {
        if (document.hidden) {
            saveProgress()
        }
    }
    
    window.addEventListener('beforeunload', beforeUnloadHandler)
    document.addEventListener('visibilitychange', visibilityChangeHandler)
})
</script>

<style>
#navbarBlur,
#sidenav-main {
    display: none !important;
}

.quiz-header-fixed {
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: white;
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    margin-bottom: 1rem !important;
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* Dark mode for quiz header */
.dark .quiz-header-fixed {
    background-color: var(--dm-bg-card) !important;
    border-bottom-color: var(--dm-border-color) !important;
}
</style>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}

.transition-all {
    transition: all 0.3s ease;
}

.choice-letter {
    width: 32px;
    height: 32px;
    font-weight: 600;
    font-size: 0.9rem;
    border: 2px solid #e9ecef;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.choice-letter.bg-light {
    border: 2px solid #dee2e6;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.choice-letter.bg-info {
    border: 2px solid #0dcaf0;
    box-shadow: 0 3px 8px rgba(13, 202, 240, 0.3);
}

.choice-letter.bg-success {
    border: 2px solid #198754;
    box-shadow: 0 3px 8px rgba(25, 135, 84, 0.3);
}

.choice-letter.bg-warning {
    border: 2px solid #ffc107;
    box-shadow: 0 3px 8px rgba(255, 193, 7, 0.3);
}

.hover-shadow:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.modal.show {
    display: block;
}

.prose pre {
    background-color: #1e1e1e;
    color: #f8f8f2;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 1rem;
    overflow-x: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.prose pre code {
    background: transparent;
    color: inherit;
    font-family: "Fira Code", monospace;
    font-size: 0.9rem;
    line-height: 1.5;
}

.hljs-ln-numbers {
    text-align: right;
    color: #888;
    border-right: 1px solid #444;
    padding-right: 10px;
    user-select: none;
    width: 3rem;
}

.hljs-ln-code {
    padding-left: 10px;
}

.prose pre::-webkit-scrollbar {
    height: 8px;
}

.prose pre::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
}

.prose pre::-webkit-scrollbar-thumb:hover {
    background: #777;
}

.prose pre code .hljs-keyword {
    color: #4fc3f7;
    font-weight: 600;
}

.prose pre code .hljs-string {
    color: #a5d6a7;
}

.prose pre code .hljs-comment {
    color: #9ca3af;
    font-style: italic;
}

.prose pre code .hljs-number {
    color: #fbbf24;
}

.prose pre code .hljs-class {
    color: #c084fc;
    font-weight: 600;
}

.prose pre code .hljs-function {
    color: #f87171;
}

.prose pre code .hljs-variable {
    color: #f8f8f2;
}

.prose {
    max-width: var(--explanation-line-length, 80ch);
    line-height: var(--explanation-line-height, 1.6);
}

.prose p {
    margin: 0.5rem 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

/* Đặc biệt cho phần giải thích trong quiz */
.quiz-explanation-section .prose {
    max-width: var(--explanation-line-length, 80ch);
    font-size: var(--explanation-font-size, 0.95rem);
    line-height: var(--explanation-line-height, 1.7);
}

/* Responsive cho mobile */
@media (max-width: 768px) {
    .prose {
        max-width: var(--mobile-line-length, 50ch);
    }
    
    .quiz-explanation-section .prose {
        max-width: var(--mobile-line-length, 45ch);
    }
}
</style>
