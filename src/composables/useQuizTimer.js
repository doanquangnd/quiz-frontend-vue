import { ref, computed } from 'vue';

/**
 * Composable for managing quiz timer
 * Supports both count-up (practice) and count-down (exam) modes
 * 
 * @param {number} durationMinutes - Duration for exam mode
 * @returns {Object} Timer state and controls
 */
export function useQuizTimer(durationMinutes = 60) {
    // State
    const time_elapsed = ref(0);  // Seconds elapsed (practice mode)
    const time_remaining = ref(0); // Seconds remaining (exam mode)
    const timer_interval = ref(null);
    const is_paused = ref(false);
    const mode = ref(null); // 'practice' or 'exam'

    /**
     * Initialize timer
     * 
     * @param {string} timerMode - 'practice' or 'exam'
     */
    const initialize = (timerMode) => {
        mode.value = timerMode;
        
        if (timerMode === 'practice') {
            time_elapsed.value = 0;
        } else if (timerMode === 'exam') {
            time_remaining.value = durationMinutes * 60; // Convert to seconds
        }
        
        is_paused.value = false;
    };

    /**
     * Start the timer
     */
    const start = () => {
        stop(); // Clear any existing interval
        
        timer_interval.value = setInterval(() => {
            if (is_paused.value) return;
            
            if (mode.value === 'practice') {
                time_elapsed.value++;
            } else if (mode.value === 'exam') {
                time_remaining.value--;
                
                // Auto-stop at 0
                if (time_remaining.value <= 0) {
                    stop();
                }
            }
        }, 1000);
    };

    /**
     * Stop the timer
     */
    const stop = () => {
        if (timer_interval.value) {
            clearInterval(timer_interval.value);
            timer_interval.value = null;
        }
    };

    /**
     * Pause the timer
     */
    const pause = () => {
        is_paused.value = true;
    };

    /**
     * Resume the timer
     */
    const resume = () => {
        is_paused.value = false;
    };

    /**
     * Reset timer to initial state
     */
    const reset = () => {
        stop();
        time_elapsed.value = 0;
        time_remaining.value = durationMinutes * 60;
        is_paused.value = false;
    };

    /**
     * Get total time spent (for completing exam/practice)
     */
    const total_time_spent = computed(() => {
        if (mode.value === 'practice') {
            return time_elapsed.value;
        } else if (mode.value === 'exam') {
            return (durationMinutes * 60) - time_remaining.value;
        }
        return 0;
    });

    /**
     * Check if time is running out (exam mode)
     */
    const is_running_out = computed(() => {
        return mode.value === 'exam' && time_remaining.value <= 300; // 5 minutes
    });

    /**
     * Check if time is critical (exam mode)
     */
    const is_critical = computed(() => {
        return mode.value === 'exam' && time_remaining.value <= 60; // 1 minute
    });

    /**
     * Format time for display
     * 
     * @param {number} seconds
     * @returns {string}
     */
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours} giờ ${minutes} phút ${secs} giây`;
        } else if (minutes > 0) {
            return `${minutes} phút ${secs} giây`;
        } else {
            return `${secs} giây`;
        }
    };

    /**
     * Get formatted time for current mode
     */
    const formatted_time = computed(() => {
        const seconds = mode.value === 'practice' ? time_elapsed.value : time_remaining.value;
        return formatTime(seconds);
    });

    return {
        // State
        time_elapsed,
        time_remaining,
        is_paused,
        mode,
        
        // Computed
        total_time_spent,
        is_running_out,
        is_critical,
        formatted_time,
        
        // Methods
        initialize,
        start,
        stop,
        pause,
        resume,
        reset,
        formatTime
    };
}

