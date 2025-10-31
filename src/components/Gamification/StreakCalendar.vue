<template>
  <div class="streak-calendar">
    <div class="calendar-header">
      <div class="header-info">
        <h3>Lịch hoạt động</h3>
        <p>{{ totalActivities }} hoạt động trong năm {{ currentYear }}</p>
      </div>
      
      <div class="calendar-controls">
        <button @click="previousYear" class="btn-nav">
          <i class="pi pi-chevron-left"></i>
        </button>
        <span class="year-label">{{ currentYear }}</span>
        <button @click="nextYear" class="btn-nav" :disabled="isCurrentYear">
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>
    </div>

    <div class="calendar-body">
      <HeatmapChart
        :data="yearData"
        :year="currentYear"
      />
    </div>

    <div class="calendar-legend">
      <div class="legend-items">
        <span class="legend-label">Ít</span>
        <div v-for="level in 5" :key="level" class="legend-cell" :class="`level-${level - 1}`"></div>
        <span class="legend-label">Nhiều</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import HeatmapChart from '../Analytics/Charts/HeatmapChart.vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
    // [{ date: '2025-01-01', value: 5 }, ...]
  },
  initialYear: {
    type: Number,
    default: () => new Date().getFullYear(),
  },
});

const currentYear = ref(props.initialYear);

const isCurrentYear = computed(() => {
  return currentYear.value >= new Date().getFullYear();
});

const yearData = computed(() => {
  return props.data.filter(item => {
    const year = new Date(item.date).getFullYear();
    return year === currentYear.value;
  });
});

const totalActivities = computed(() => {
  return yearData.value.reduce((sum, item) => sum + item.value, 0);
});

const previousYear = () => {
  currentYear.value--;
};

const nextYear = () => {
  if (!isCurrentYear.value) {
    currentYear.value++;
  }
};

watch(() => props.initialYear, (newYear) => {
  currentYear.value = newYear;
});
</script>

<style scoped>
.streak-calendar {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.header-info p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-nav {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-nav:hover:not(:disabled) {
  border-color: #5e72e4;
  color: #5e72e4;
  background: #f8fafc;
}

.btn-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.year-label {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  min-width: 60px;
  text-align: center;
}

.calendar-body {
  margin-bottom: 1rem;
}

.calendar-legend {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.legend-items {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-label {
  font-size: 0.75rem;
  color: #64748b;
}

.legend-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-cell.level-0 {
  background: #f1f5f9;
}

.legend-cell.level-1 {
  background: #c7d2fe;
}

.legend-cell.level-2 {
  background: #a5b4fc;
}

.legend-cell.level-3 {
  background: #818cf8;
}

.legend-cell.level-4 {
  background: #5e72e4;
}

@media (max-width: 768px) {
  .calendar-header {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>

