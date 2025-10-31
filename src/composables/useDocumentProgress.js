import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { http } from '@/api/http-client.js';

/**
 * Composable for managing document learning progress
 * 
 * Provides methods to:
 * - Start/resume document learning
 * - Update category progress
 * - Complete document
 * - Restart learning
 * 
 * @param {string} documentSlug - The document slug
 * @returns {Object} Progress management methods and state
 */
export function useDocumentProgress(documentSlug) {
    const router = useRouter();
    const progressId = ref(null);
    const loading = ref(false);
    const error = ref(null);

    /**
     * Start learning a document or resume existing progress
     * 
     * @returns {Promise<Object>} The progress data
     */
    const startProgress = async () => {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await http.post(`/api/documents/${documentSlug}/start`);
            progressId.value = response.data.progress.id;
            
            return response.data.progress;
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
            // Silent fail
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Update progress for a category
     * 
     * @param {number} categoryId - The category ID
     * @param {Object} data - Progress data
     * @param {number} data.currentIndex - Current question index
     * @param {number} data.correctCount - Number of correct answers
     * @param {number} data.answeredCount - Number of answered questions
     * @param {number} data.timeSpent - Time spent in seconds
     * @param {boolean} data.completed - Whether category is completed
     * @returns {Promise<Object>} The updated progress data
     */
    const updateCategoryProgress = async (categoryId, data) => {
        try {
            const response = await http.post(
                `/api/documents/category/${categoryId}/progress`,
                {
                    current_question_index: data.currentIndex,
                    correct_count: data.correctCount,
                    answered_count: data.answeredCount,
                    time_spent_seconds: data.timeSpent,
                    completed: data.completed || false
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
     * Complete the entire document
     * 
     * @returns {Promise<Object>} The completed progress data
     */
    const completeDocument = async () => {
        if (!progressId.value) {
            // No active progress
            return null;
        }

        loading.value = true;
        try {
            const response = await http.post(
                `/api/documents/${documentSlug}/complete`
            );
            
            // Redirect to progress details page
            router.push({ 
                name: 'documents.progress.details', 
                params: { progressId: progressId.value } 
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
     * Restart learning the document
     * Creates new progress, old one becomes history
     * 
     * @returns {Promise<Object>} The new progress data
     */
    const restartDocument = async () => {
        loading.value = true;
        try {
            const response = await http.post(`/api/documents/${documentSlug}/restart`);
            progressId.value = response.data.progress.id;
            
            return response.data.progress;
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
            // Silent fail
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return {
        progressId,
        loading,
        error,
        startProgress,
        updateCategoryProgress,
        completeDocument,
        restartDocument
    };
}

