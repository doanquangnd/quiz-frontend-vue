<template>
  <div class="demo-gamification">
    <div class="card border-0 shadow-soft">
      <div class="card-header bg-gradient-primary text-white">
        <h6 class="mb-0">
          <i class="ni ni-trophy me-2"></i>
          Demo Gamification Components
        </h6>
      </div>
      <div class="card-body p-4">
        <div class="row">
          <div class="col-12 mb-4">
            <h6>Test Achievement Notification</h6>
            <button @click="testAchievement" class="btn btn-sm bg-gradient-success">
              Trigger Achievement
            </button>
          </div>
          
          <div class="col-12 mb-4">
            <h6>Test Level Up</h6>
            <button @click="testLevelUp" class="btn btn-sm bg-gradient-info">
              Trigger Level Up
            </button>
          </div>
          
          <div class="col-12 mb-4">
            <h6>Test Points Awarded</h6>
            <button @click="testPoints" class="btn btn-sm bg-gradient-warning">
              Award 100 Points
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGamificationNotifications } from '@/composables/useGamificationNotifications';

const { showAchievementUnlock, showLevelUp, showPointsAwarded } = useGamificationNotifications();

const testAchievement = () => {
  showAchievementUnlock({
    id: 1,
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: 'pi pi-star',
    tier: 'bronze',
    points: 100,
  });
};

const testLevelUp = () => {
  showLevelUp(2, {
    points: 50,
    achievements: 1,
  });
};

const testPoints = () => {
  showPointsAwarded(100, 'Quiz Completion');
};
</script>

<style scoped>
.demo-gamification {
  margin: 1rem 0;
}
</style>
