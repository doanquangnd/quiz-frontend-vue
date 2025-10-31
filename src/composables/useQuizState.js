import { ref, computed } from 'vue';

/**
 * Composable for managing quiz state
 * Handles question navigation, answer selection, scoring
 * 
 * @param {Array} questions - Array of questions
 * @returns {Object} State and methods
 */
export function useQuizState(questions) {
    // State
    const current_question_index = ref(0);
    const selected = ref([]);
    const show_answer = ref(false);
    const correct_count = ref(0);
    const answered_count = ref(0);
    const shuffled_questions = ref([]);
    const shuffled_choices = ref([]);
    const answered_questions = ref([]); // For exam mode

    /**
     * Initialize with shuffled questions
     */
    const initializeQuestions = (shouldShuffle = true) => {
        if (shouldShuffle && questions && questions.length > 0) {
            shuffled_questions.value = [...questions].sort(() => Math.random() - 0.5);
        } else {
            shuffled_questions.value = [...questions];
        }
    };

    /**
     * Shuffle choices for current question
     */
    const shuffleCurrentChoices = (currentQuestion) => {
        if (currentQuestion?.choices) {
            shuffled_choices.value = [...currentQuestion.choices].sort(() => Math.random() - 0.5);
        }
    };

    /**
     * Get current question
     */
    const current_question = computed(() => {
        return shuffled_questions.value[current_question_index.value] || null;
    });

    /**
     * Toggle choice selection
     * 
     * @param {number} choiceId
     */
    const toggleChoice = (choiceId) => {
        if (show_answer.value) return;
        
        const index = selected.value.indexOf(choiceId);
        if (index >= 0) {
            selected.value.splice(index, 1);
        } else {
            selected.value.push(choiceId);
        }
    };

    /**
     * Check if choice is correct
     * 
     * @param {number} choiceId
     * @returns {boolean}
     */
    const isChoiceCorrect = (choiceId) => {
        return current_question.value?.choices?.some(
            c => c.is_correct && String(c.id) === String(choiceId)
        );
    };

    /**
     * Check if current answer is correct
     */
    const isCurrentAnswerCorrect = computed(() => {
        const correctIds = current_question.value?.choices
            ?.filter(c => c.is_correct)
            .map(c => String(c.id)) || [];
        const selectedIds = selected.value.map(String);
        
        return correctIds.length === selectedIds.length &&
            correctIds.every(id => selectedIds.includes(id));
    });

    /**
     * Get correct letters display
     * 
     * @param {Array} letters - ['A', 'B', 'C', ...]
     * @returns {string}
     */
    const getCorrectLettersDisplay = (letters) => {
        const correctIds = current_question.value?.choices
            ?.filter(c => c.is_correct)
            .map(c => c.id) || [];
            
        return correctIds
            .map(id => {
                const idx = shuffled_choices.value.findIndex(
                    c => String(c.id) === String(id)
                );
                return letters[idx];
            })
            .join(' và ');
    };

    /**
     * Submit current answer
     * 
     * @param {string} mode - 'practice' or 'exam'
     */
    const submitAnswer = (mode = 'practice') => {
        if (selected.value.length === 0) return false;
        
        if (mode === 'practice') {
            // Practice: show answer immediately
            show_answer.value = true;
            answered_count.value++;
            if (isCurrentAnswerCorrect.value) {
                correct_count.value++;
            }
        } else {
            // Exam: just mark as answered
            if (!answered_questions.value.includes(current_question_index.value)) {
                answered_questions.value.push(current_question_index.value);
            }
            if (isCurrentAnswerCorrect.value) {
                correct_count.value++;
            }
            answered_count.value++;
        }
        
        return true;
    };

    /**
     * Move to next question
     * 
     * @returns {boolean} - true if moved, false if at end
     */
    const nextQuestion = () => {
        if (current_question_index.value < shuffled_questions.value.length - 1) {
            current_question_index.value++;
            selected.value = [];
            show_answer.value = false;
            return true;
        }
        return false;
    };

    /**
     * Go to specific question
     * 
     * @param {number} index
     */
    const goToQuestion = (index) => {
        if (index >= 0 && index < shuffled_questions.value.length) {
            current_question_index.value = index;
            selected.value = [];
            show_answer.value = false;
        }
    };

    /**
     * Reset state
     */
    const reset = () => {
        current_question_index.value = 0;
        selected.value = [];
        show_answer.value = false;
        correct_count.value = 0;
        answered_count.value = 0;
        answered_questions.value = [];
    };

    /**
     * Calculate score percentage
     */
    const score_percentage = computed(() => {
        if (shuffled_questions.value.length === 0) return 0;
        return Math.round((correct_count.value / shuffled_questions.value.length) * 100);
    });

    return {
        // State
        current_question_index,
        selected,
        show_answer,
        correct_count,
        answered_count,
        shuffled_questions,
        shuffled_choices,
        answered_questions,
        
        // Computed
        current_question,
        isCurrentAnswerCorrect,
        score_percentage,
        
        // Methods
        initializeQuestions,
        shuffleCurrentChoices,
        toggleChoice,
        isChoiceCorrect,
        getCorrectLettersDisplay,
        submitAnswer,
        nextQuestion,
        goToQuestion,
        reset
    };
}

