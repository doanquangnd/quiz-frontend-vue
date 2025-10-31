<template>
  <div>
    <PageTitle :title="$t('achievements')" />
    <AppLayout>
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="row">
        <div class="col-12">
          <div class="card border-0 shadow-soft mb-4">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="d-flex align-items-center">
                  <div class="icon icon-shape icon-sm bg-gradient-info text-center rounded-3 me-3">
                    <i class="ni ni-trophy text-white opacity-10"></i>
                  </div>
                  <div>
                    <h5 class="mb-0 text-dark">{{ $t('achievements') }}</h5>
                    <p class="text-sm text-muted mb-0">{{ $t('unlock_achievements_and_earn_rewards') }}</p>
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <button 
                    :class="['btn btn-sm', activeFilter === 'all' ? 'bg-gradient-primary' : 'btn-outline-primary']"
                    @click="setFilter('all')"
                  >
                    {{ $t('all') }}
                  </button>
                  <button 
                    :class="['btn btn-sm', activeFilter === 'unlocked' ? 'bg-gradient-success' : 'btn-outline-success']"
                    @click="setFilter('unlocked')"
                  >
                    {{ $t('unlocked') }}
                  </button>
                  <button 
                    :class="['btn btn-sm', activeFilter === 'locked' ? 'bg-gradient-secondary' : 'btn-outline-secondary']"
                    @click="setFilter('locked')"
                  >
                    {{ $t('locked') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievement Stats -->
      <div class="row mb-4">
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card border-0 shadow-soft">
            <div class="card-body p-3 text-center">
              <div class="icon icon-shape icon-sm bg-gradient-success text-center rounded-3 mx-auto mb-2">
                <i class="ni ni-trophy text-white opacity-10"></i>
              </div>
              <h6 class="font-weight-bold mb-0">{{ achievementStats.unlocked || 0 }}</h6>
              <p class="text-sm text-muted mb-0">{{ $t('unlocked') }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card border-0 shadow-soft">
            <div class="card-body p-3 text-center">
              <div class="icon icon-shape icon-sm bg-gradient-secondary text-center rounded-3 mx-auto mb-2">
                <i class="ni ni-lock-circle-open text-white opacity-10"></i>
              </div>
              <h6 class="font-weight-bold mb-0">{{ achievementStats.locked || 0 }}</h6>
              <p class="text-sm text-muted mb-0">{{ $t('locked') }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card border-0 shadow-soft">
            <div class="card-body p-3 text-center">
              <div class="icon icon-shape icon-sm bg-gradient-info text-center rounded-3 mx-auto mb-2">
                <i class="ni ni-star text-white opacity-10"></i>
              </div>
              <h6 class="font-weight-bold mb-0">{{ achievementStats.total_points || 0 }}</h6>
              <p class="text-sm text-muted mb-0">{{ $t('total_points') }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card border-0 shadow-soft">
            <div class="card-body p-3 text-center">
              <div class="icon icon-shape icon-sm bg-gradient-warning text-center rounded-3 mx-auto mb-2">
                <i class="ni ni-chart-bar-32 text-white opacity-10"></i>
              </div>
              <h6 class="font-weight-bold mb-0">{{ achievementStats.completion_rate || 0 }}%</h6>
              <p class="text-sm text-muted mb-0">{{ $t('completion_rate') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievement Gallery -->
      <div class="row">
        <div class="col-12">
          <div class="card border-0 shadow-soft">
            <div class="card-body p-4">
              <h6 class="mb-4 font-weight-bold">{{ $t('achievement_gallery') }}</h6>
              
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="sr-only">{{ $t('loading') }}...</span>
                </div>
                <p class="mt-2 text-muted">{{ $t('loading_achievements') }}...</p>
              </div>

              <div v-else-if="filteredAchievements.length === 0" class="text-center py-5">
                <div class="icon icon-shape icon-lg bg-gradient-secondary text-center rounded-3 mb-3 mx-auto" style="width: 80px;">
                  <i class="ni ni-trophy text-white opacity-10"></i>
                </div>
                <h6 class="text-muted">{{ $t('no_achievements_found') }}</h6>
                <p class="text-sm text-muted mb-3">{{ $t('try_different_filter') }}</p>
              </div>

              <div v-else class="row">
                <div 
                  v-for="achievement in filteredAchievements" 
                  :key="achievement.id"
                  class="col-lg-4 col-md-6 mb-4"
                >
                  <AchievementCard
                    :id="achievement.id"
                    :name="achievement.name"
                    :description="achievement.description"
                    :icon="achievement.icon"
                    :tier="achievement.tier"
                    :category="achievement.category"
                    :points="achievement.points"
                    :unlocked="achievement.unlocked"
                    :unlocked-at="achievement.unlocked_at"
                    :progress="achievement.progress"
                    @click="openAchievementModal(achievement)"
                  />
                </div>
              </div>

              <!-- Load More Button -->
              <div v-if="hasMore && !loading" class="text-center mt-4">
                <button @click="loadMore" class="btn bg-gradient-primary">
                  <i class="ni ni-bold-down me-1"></i>
                  {{ $t('load_more') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievement Modal -->
      <AchievementModal
        :achievement="selectedAchievement"
        :show="showModal"
        @close="closeModal"
      />
    </div>
    </AppLayout>
  </div>
</template>

<script setup>
import PageTitle from '@/components/PageTitle.vue';
import { ref, computed, onMounted } from 'vue';
import { http } from '@/api/http-client.js';
import AppLayout from "@/layouts/AppLayout.vue";
import AchievementCard from "@/components/Gamification/AchievementCard.vue";
import AchievementModal from "@/components/Gamification/AchievementModal.vue";
import { useSeo, SEO_CONFIGS } from '@/composables/useSeo.js'
import { SEO_CONFIGS_EN } from '@/composables/useSeo.en.js'
import { useTranslation } from '@/composables/useTranslation'

// SEO Setup
const { locale } = useTranslation()
const init_seo = () => {
  const configs = locale.value === 'en' ? SEO_CONFIGS_EN : SEO_CONFIGS
  useSeo({
    ...configs.achievements,
    robots: 'noindex, nofollow',
  })
}
init_seo()

// State
const achievements = ref([]);
const achievementStats = ref({});
const loading = ref(false);
const activeFilter = ref('all');
const selectedAchievement = ref(null);
const showModal = ref(false);
const page = ref(1);
const hasMore = ref(false);

// Computed
const filteredAchievements = computed(() => {
  if (activeFilter.value === 'all') {
    return achievements.value;
  } else if (activeFilter.value === 'unlocked') {
    return achievements.value.filter(a => a.unlocked);
  } else if (activeFilter.value === 'locked') {
    return achievements.value.filter(a => !a.unlocked);
  }
  return achievements.value;
});

// Methods
const fetchAchievements = async (pageNum = 1, append = false) => {
  loading.value = true;
  
  try {
    const response = await http.get('/api/achievements/user', {
      params: { page: pageNum, per_page: 12 }
    });
    
    if (response.data.success) {
      if (append) {
        achievements.value.push(...response.data.achievements);
      } else {
        achievements.value = response.data.achievements;
      }
      
      achievementStats.value = response.data.stats || {};
      hasMore.value = response.data.has_more || false;
      page.value = pageNum;
    }
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
  } finally {
    loading.value = false;
  }
};

const setFilter = (filter) => {
  activeFilter.value = filter;
};

const loadMore = () => {
  if (!loading.value && hasMore.value) {
    fetchAchievements(page.value + 1, true);
  }
};

const openAchievementModal = (achievement) => {
  selectedAchievement.value = achievement;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedAchievement.value = null;
};

// Lifecycle
onMounted(() => {
  fetchAchievements();
});
</script>

<style scoped>
.spinner-border {
  width: 3rem;
  height: 3rem;
}

.icon-shape {
  width: 48px;
  height: 48px;
}
</style>
