<template>
  <div class="notification-manager">
    <!-- Achievement Notifications -->
    <AchievementNotification
      v-for="notification in achievementNotifications"
      :key="notification.id"
      :achievement="notification.achievement"
      @close="removeNotification(notification.id)"
      :style="{ top: `${2 + notifications.indexOf(notification) * 8}rem` }"
    />

    <!-- Points Notifications -->
    <transition-group name="points-list" tag="div" class="points-notifications">
      <div
        v-for="notification in pointsNotifications"
        :key="notification.id"
        class="points-notification"
      >
        <i class="pi pi-star-fill"></i>
        <span>+{{ notification.points }} điểm</span>
      </div>
    </transition-group>

    <!-- Level Up Celebrations -->
    <LevelUpCelebration
      v-for="celebration in celebrations"
      :key="celebration.id"
      :new-level="celebration.newLevel"
      :rewards="celebration.rewards"
      @close="removeCelebration(celebration.id)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGamificationNotifications } from '@/composables/useGamificationNotifications';
import AchievementNotification from './AchievementNotification.vue';
import LevelUpCelebration from './LevelUpCelebration.vue';

const { 
  notifications, 
  celebrations, 
  removeNotification, 
  removeCelebration 
} = useGamificationNotifications();

const achievementNotifications = computed(() => {
  return notifications.value.filter(n => n.type === 'achievement');
});

const pointsNotifications = computed(() => {
  return notifications.value.filter(n => n.type === 'points');
});
</script>

<style scoped>
.notification-manager {
  position: fixed;
  z-index: 9999;
}

.points-notifications {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  pointer-events: none;
  z-index: 9999;
}

.points-notification {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(255, 165, 0, 0.95));
  backdrop-filter: blur(10px);
  border-radius: 50px;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.4);
  animation: points-float 2s ease-out forwards;
}

.points-notification i {
  font-size: 2rem;
  animation: star-spin 1s ease-in-out;
}

@keyframes points-float {
  0% {
    transform: translateY(0) scale(0.8);
    opacity: 0;
  }
  20% {
    transform: translateY(-20px) scale(1);
    opacity: 1;
  }
  80% {
    transform: translateY(-60px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(0.8);
    opacity: 0;
  }
}

@keyframes star-spin {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.3);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.points-list-enter-active,
.points-list-leave-active {
  transition: all 0.5s ease;
}

.points-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.points-list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>

