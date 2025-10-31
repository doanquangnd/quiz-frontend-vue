import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { http } from '@/api/http-client.js';

/**
 * Composable for managing exam progress
 * 
 * Provides methods to:
 * - Start/resume exam attempts
 * - Save answers
 * - Complete attempts
 * - Restart exams
 * 
 * @param {string} examSlug - The exam slug
 * @returns {Object} Progress management methods and state
 */
export function useExamProgress(examSlug) {
    const router = useRouter();
    const attemptId = ref(null);
    const loading = ref(false);
    const error = ref(null);

    /**
     * Start a new attempt or resume existing one
     * 
     * @returns {Promise<Object>} The attempt data
     */
    const startAttempt = async () => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await http.post(`/api/exams/${examSlug}/start`);
            attemptId.value = response.data.attempt.id;
            
            return response.data.attempt;
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
            // Silent fail
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Save an answer for a question
     * 
     * @param {number} questionId - The question ID
     * @param {Array<number>} selectedChoiceIds - Selected choice IDs
     * @param {number} timeSpent - Time spent in seconds
     * @param {boolean} isFlagged - Whether question is flagged
     * @returns {Promise<Object>} The saved answer data
     */
    const saveAnswer = async (questionId, selectedChoiceIds, timeSpent = 0, isFlagged = false) => {
        if (!attemptId.value) {
            // No active attempt
            return null;
        }

        try {
            const response = await http.post(
                `/api/exams/attempts/${attemptId.value}/answer`,
                {
                    question_id: questionId,
                    selected_choice_ids: selectedChoiceIds,
                    time_spent_seconds: timeSpent,
                    is_flagged: isFlagged
                }
            );
            
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
            // Silent fail
            throw err;
        }
    };

    /**
     * Complete the current attempt
     * 
     * @param {number} totalTimeSpent - Total time spent in seconds
     * @returns {Promise<Object>} The completed attempt data
     */
    const completeAttempt = async (totalTimeSpent) => {
        if (!attemptId.value) {
            // No active attempt
            return null;
        }

        loading.value = true;
        try {
            const response = await http.post(
                `/api/exams/attempts/${attemptId.value}/complete`,
                { time_spent_seconds: totalTimeSpent }
            );
            
            // Redirect to results page
            const examSlugFromAttempt = response.data.attempt?.exam?.slug || examSlug;
            router.push({ 
                name: 'exams.attempt.details', 
                params: { examSlug: examSlugFromAttempt, attemptId: attemptId.value } 
            });
            
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
            // Silent fail
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Restart the exam (create new attempt, old one becomes history)
     * 
     * @returns {Promise<Object>} The new attempt data
     */
    const restartExam = async () => {
        loading.value = true;
        try {
            const response = await http.post(`/api/exams/${examSlug}/restart`);
            attemptId.value = response.data.attempt.id;
            
            return response.data.attempt;
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
            // Silent fail
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        attemptId,
        loading,
        error,
        startAttempt,
        saveAnswer,
        completeAttempt,
        restartExam
    };
}

