<template>
  <div class="achievement-gallery">
    <!-- Header -->
    <div class="gallery-header">
      <div class="header-content">
        <h2>Thư viện thành tích</h2>
        <p>{{ unlockedCount }} / {{ totalCount }} đã mở khóa</p>
      </div>
      
      <div class="progress-overview">
        <div class="progress-circle" :style="circleStyle">
          <span class="progress-value">{{ completionPercent }}%</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="gallery-filters">
      <div class="filter-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="filter-tab"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span class="tab-count">{{ tab.count }}</span>
        </button>
      </div>
      
      <div class="filter-controls">
        <select v-model="filterCategory" class="filter-select">
          <option value="">Tất cả danh mục</option>
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>
        
        <select v-model="filterTier" class="filter-select">
          <option value="">Tất cả cấp độ</option>
          <option value="bronze">Đồng</option>
          <option value="silver">Bạc</option>
          <option value="gold">Vàng</option>
          <option value="platinum">Bạch kim</option>
        </select>
        
        <select v-model="sortBy" class="filter-select">
          <option value="recent">Mới nhất</option>
          <option value="points">Điểm cao nhất</option>
          <option value="progress">Tiến độ</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="gallery-loading">
      <i class="pi pi-spin pi-spinner"></i>
      <span>Đang tải thành tích...</span>
    </div>

    <!-- Achievement Grid -->
    <div v-else-if="filteredAchievements.length > 0" class="achievement-grid">
      <AchievementCard
        v-for="achievement in filteredAchievements"
        :key="achievement.id"
        v-bind="achievement"
        @click="handleAchievementClick(achievement)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="gallery-empty">
      <i class="pi pi-trophy"></i>
      <h3>Không tìm thấy thành tích</h3>
      <p>Thử thay đổi bộ lọc để xem các thành tích khác</p>
    </div>

    <!-- Achievement Detail Modal -->
    <AchievementModal
      v-if="selectedAchievement"
      :achievement="selectedAchievement"
      @close="selectedAchievement = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import AchievementCard from './AchievementCard.vue';
import AchievementModal from './AchievementModal.vue';

const props = defineProps({
  achievements: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const activeTab = ref('all');
const filterCategory = ref('');
const filterTier = ref('');
const sortBy = ref('recent');
const selectedAchievement = ref(null);

const tabs = computed(() => [
  { label: 'Tất cả', value: 'all', count: props.achievements.length },
  { label: 'Đã mở khóa', value: 'unlocked', count: unlockedCount.value },
  { label: 'Chưa mở', value: 'locked', count: props.achievements.length - unlockedCount.value },
  { label: 'Gần đạt', value: 'almost', count: almostUnlockedCount.value },
]);

const categories = [
  { label: 'Bài thi', value: 'quiz' },
  { label: 'Chuỗi ngày', value: 'streak' },
  { label: 'Điểm số', value: 'score' },
  { label: 'Tốc độ', value: 'speed' },
  { label: 'Đặc biệt', value: 'special' },
  { label: 'Điểm thưởng', value: 'points' },
  { label: 'Cột mốc', value: 'milestone' },
];

const unlockedCount = computed(() => {
  return props.achievements.filter(a => a.unlocked).length;
});

const totalCount = computed(() => {
  return props.achievements.length;
});

const completionPercent = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((unlockedCount.value / totalCount.value) * 100);
});

const almostUnlockedCount = computed(() => {
  return props.achievements.filter(a => 
    !a.unlocked && a.progress && a.progress.progress_percent >= 50
  ).length;
});

const circleStyle = computed(() => {
  const percent = completionPercent.value;
  return {
    background: `conic-gradient(#5e72e4 0% ${percent}%, #f1f5f9 ${percent}% 100%)`,
  };
});

const filteredAchievements = computed(() => {
  let filtered = [...props.achievements];
  
  // Filter by tab
  if (activeTab.value === 'unlocked') {
    filtered = filtered.filter(a => a.unlocked);
  } else if (activeTab.value === 'locked') {
    filtered = filtered.filter(a => !a.unlocked);
  } else if (activeTab.value === 'almost') {
    filtered = filtered.filter(a => 
      !a.unlocked && a.progress && a.progress.progress_percent >= 50
    );
  }
  
  // Filter by category
  if (filterCategory.value) {
    filtered = filtered.filter(a => a.category === filterCategory.value);
  }
  
  // Filter by tier
  if (filterTier.value) {
    filtered = filtered.filter(a => a.tier === filterTier.value);
  }
  
  // Sort
  if (sortBy.value === 'points') {
    filtered.sort((a, b) => b.points - a.points);
  } else if (sortBy.value === 'progress' && activeTab.value === 'locked') {
    filtered.sort((a, b) => {
      const progressA = a.progress?.progress_percent || 0;
      const progressB = b.progress?.progress_percent || 0;
      return progressB - progressA;
    });
  } else if (sortBy.value === 'recent') {
    filtered.sort((a, b) => {
      if (a.unlocked && b.unlocked) {
        return new Date(b.unlockedAt) - new Date(a.unlockedAt);
      }
      return 0;
    });
  }
  
  return filtered;
});

const handleAchievementClick = (achievement) => {
  selectedAchievement.value = achievement;
};

// Auto-update tab counts when achievements change
watch(() => props.achievements, () => {
  // Force recompute
}, { deep: true });
</script>

<style scoped>
.achievement-gallery {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #5e72e4 0%, #4c63d2 100%);
  border-radius: 16px;
  color: white;
}

.header-content h2 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.header-content p {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
}

.progress-overview {
  flex-shrink: 0;
}

.progress-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.progress-circle::before {
  content: '';
  position: absolute;
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
}

.progress-value {
  position: relative;
  z-index: 1;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.gallery-filters {
  margin-bottom: 2rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-tab:hover {
  border-color: #5e72e4;
  color: #5e72e4;
}

.filter-tab.active {
  background: #5e72e4;
  border-color: #5e72e4;
  color: white;
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.filter-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.3);
}

.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  color: #1e293b;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #5e72e4;
}

.gallery-loading,
.gallery-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #64748b;
  text-align: center;
}

.gallery-loading i,
.gallery-empty i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.gallery-empty h3 {
  font-size: 1.5rem;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.gallery-empty p {
  margin: 0;
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .achievement-gallery {
    padding: 1rem;
  }
  
  .gallery-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .achievement-grid {
    grid-template-columns: 1fr;
  }
}
</style>

