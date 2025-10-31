import { ref } from 'vue';

const notifications = ref([]);
const celebrations = ref([]);

export function useGamificationNotifications() {
    const showAchievementUnlock = (achievement) => {
        const id = Date.now();
        notifications.value.push({
            id,
            achievement,
            type: 'achievement',
        });

        // Auto remove after duration
        setTimeout(() => {
            removeNotification(id);
        }, 5000);

        return id;
    };

    const showLevelUp = (newLevel, rewards = {}) => {
        const id = Date.now();
        celebrations.value.push({
            id,
            newLevel,
            rewards,
            type: 'level_up',
        });

        return id;
    };

    const showPointsAwarded = (points, action) => {
        const id = Date.now();
        notifications.value.push({
            id,
            points,
            action,
            type: 'points',
        });

        setTimeout(() => {
            removeNotification(id);
        }, 3000);

        return id;
    };

    const removeNotification = (id) => {
        notifications.value = notifications.value.filter(n => n.id !== id);
    };

    const removeCelebration = (id) => {
        celebrations.value = celebrations.value.filter(c => c.id !== id);
    };

    const clearAll = () => {
        notifications.value = [];
        celebrations.value = [];
    };

    return {
        notifications,
        celebrations,
        showAchievementUnlock,
        showLevelUp,
        showPointsAwarded,
        removeNotification,
        removeCelebration,
        clearAll,
    };
}

