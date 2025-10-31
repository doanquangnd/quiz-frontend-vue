/**
 * Progress Sync Composable
 * Handles progress synchronization between localStorage and database
 */
import { ref, computed } from 'vue';
import { http } from '@/api/http-client.js';

export function useProgressSync(categoryId) {
    const isSaving = ref(false);
    const lastSaveTime = ref(null);
    const lastSaveDataHash = ref(null); // Track last saved data hash
    const saveQueue = ref([]);
    const saveErrors = ref([]);
    const isOnline = ref(navigator.onLine);

    // Computed properties
    const hasUnsavedChanges = computed(() => {
        return saveQueue.value.length > 0;
    });

    const lastSaveTimeFormatted = computed(() => {
        if (!lastSaveTime.value) return null;
        return new Date(lastSaveTime.value).toLocaleString('vi-VN');
    });

    /**
     * Smart save progress - only when data actually changes
     */
    const saveProgress = async (progressData, retryCount = 0) => {
        // Check if data actually changed
        const dataHash = JSON.stringify(progressData);
        if (lastSaveDataHash.value === dataHash) {
            console.log('No changes detected, skipping save');
            return true;
        }

        // Check if online
        if (!isOnline.value) {
            console.log('Offline: Queueing progress for later sync');
            saveQueue.value.push({ progressData, retryCount, timestamp: Date.now() });
            return false;
        }

        // Prevent concurrent saves
        if (isSaving.value) {
            console.log('Save in progress: Queueing request');
            saveQueue.value.push({ progressData, retryCount, timestamp: Date.now() });
            return false;
        }

        isSaving.value = true;

        try {
            await http.post(`/api/documents/category/${categoryId}/progress`, progressData);
            
            console.log('Progress saved successfully');
            lastSaveTime.value = Date.now();
            lastSaveDataHash.value = dataHash; // Update hash after successful save
            saveErrors.value = []; // Clear errors on success

            return true;
        } catch (error) {
            console.error('Failed to save progress:', error);
            saveErrors.value.push({
                error: error.response?.data || error.message,
                timestamp: Date.now(),
                data: progressData
            });

            // Retry if server error and retry count < 3
            if (error.response?.status >= 500 && retryCount < 3) {
                console.log(`Retrying save (${retryCount + 1}/3)...`);
                setTimeout(() => {
                    isSaving.value = false;
                    saveProgress(progressData, retryCount + 1);
                }, 1000 * (retryCount + 1)); // Exponential backoff
                return false;
            }

            // If max retries reached, queue for later
            if (retryCount >= 3) {
                console.log('Max retries reached, queueing for later');
                saveQueue.value.push({ progressData, retryCount: 0, timestamp: Date.now() });
            }

            return false;
        } finally {
            isSaving.value = false;

            // Process queued requests
            if (saveQueue.value.length > 0) {
                const next = saveQueue.value.shift();
                setTimeout(() => {
                    saveProgress(next.progressData, next.retryCount);
                }, 1000);
            }
        }
    };

    /**
     * Save progress to localStorage as backup
     */
    const saveToLocalStorage = (progressData, storageKey) => {
        try {
            const data = {
                ...progressData,
                timestamp: Date.now(),
                synced: false
            };
            localStorage.setItem(storageKey, JSON.stringify(data));
            console.log('Progress saved to localStorage');
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    };

    /**
     * Load progress from localStorage
     */
    const loadFromLocalStorage = (storageKey) => {
        try {
            const data = localStorage.getItem(storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return null;
        }
    };

    /**
     * Sync queued progress when back online
     */
    const syncQueuedProgress = async () => {
        if (!isOnline.value || saveQueue.value.length === 0) return;

        console.log(`Syncing ${saveQueue.value.length} queued progress items...`);

        const queue = [...saveQueue.value];
        saveQueue.value = [];

        for (const item of queue) {
            await saveProgress(item.progressData, item.retryCount);
        }
    };

    /**
     * Start auto-save mechanism
     */
    const startAutoSave = (getProgressData, intervalSeconds = 30) => {
        const autoSaveInterval = setInterval(async () => {
            if (getProgressData && !isSaving.value) {
                const progressData = getProgressData();
                if (progressData) {
                    await saveProgress(progressData);
                }
            }
        }, intervalSeconds * 1000);

        return autoSaveInterval;
    };

    /**
     * Handle online/offline events
     */
    const handleOnlineStatus = () => {
        isOnline.value = navigator.onLine;
        
        if (isOnline.value) {
            console.log('Back online: Syncing queued progress');
            syncQueuedProgress();
        } else {
            console.log('Gone offline: Progress will be queued');
        }
    };

    /**
     * Get sync status
     */
    const getSyncStatus = () => {
        return {
            isSaving: isSaving.value,
            lastSaveTime: lastSaveTime.value,
            queuedItems: saveQueue.value.length,
            errors: saveErrors.value.length,
            isOnline: isOnline.value
        };
    };

    /**
     * Clear all errors
     */
    const clearErrors = () => {
        saveErrors.value = [];
    };

    /**
     * Force sync all queued items
     */
    const forceSync = async () => {
        if (saveQueue.value.length === 0) return;

        console.log('Force syncing all queued items...');
        await syncQueuedProgress();
    };

    return {
        // State
        isSaving,
        lastSaveTime,
        saveQueue,
        saveErrors,
        isOnline,
        
        // Computed
        hasUnsavedChanges,
        lastSaveTimeFormatted,
        
        // Methods
        saveProgress,
        saveToLocalStorage,
        loadFromLocalStorage,
        syncQueuedProgress,
        startAutoSave,
        handleOnlineStatus,
        getSyncStatus,
        clearErrors,
        forceSync
    };
}
