<template>
  <div>
    <PageTitle :title="$t('leaderboard')" />
    <AppLayout>
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="row">
        <div class="col-12">
          <div class="card border-0 shadow-soft mb-4">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="d-flex align-items-center">
                  <div class="icon icon-shape icon-sm bg-gradient-success text-center rounded-3 me-3">
                    <i class="ni ni-chart-bar-32 text-white opacity-10"></i>
                  </div>
                  <div>
                    <h5 class="mb-0 text-dark">{{ $t('leaderboard') }}</h5>
                    <p class="text-sm text-muted mb-0">{{ $t('compete_with_other_players') }}</p>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                  <div class="d-flex align-items-center">
                    <span class="text-sm text-muted me-2">{{ $t('your_rank') }}:</span>
                    <span class="badge bg-gradient-primary font-weight-bold">
                      {{ userRank?.rank || 'N/A' }}
                    </span>
                  </div>
                  <div class="d-flex align-items-center">
                    <span class="text-sm text-muted me-2">{{ $t('your_points') }}:</span>
                    <span class="font-weight-bold text-primary">
                      {{ formatNumber(userRank?.total_points || 0) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Leaderboard Component -->
      <div class="row">
        <div class="col-12">
          <Leaderboard 
            :current-user-id="currentUserId"
          />
        </div>
      </div>

      <!-- Additional Stats -->
      <div class="row mt-4">
        <div class="col-md-4 mb-4">
          <div class="card border-0 shadow-soft">
            <div class="card-body p-4 text-center">
              <div class="icon icon-shape icon-sm bg-gradient-info text-center rounded-3 mx-auto mb-3">
                <i class="ni ni-trophy text-white opacity-10"></i>
              </div>
              <h6 class="font-weight-bold mb-1">{{ $t('top_performers') }}</h6>
              <p class="text-sm text-muted mb-3">{{ $t('best_players_this_month') }}</p>
              <div class="d-flex justify-content-center gap-2">
                <div class="text-center">
                  <div class="font-weight-bold text-warning">🥇</div>
                  <div class="text-xs">{{ topPerformers[0]?.name || '-' }}</div>
                </div>
                <div class="text-center">
                  <div class="font-weight-bold text-secondary">🥈</div>
                  <div class="text-xs">{{ topPerformers[1]?.name || '-' }}</div>
                </div>
                <div class="text-center">
                  <div class="font-weight-bold text-warning" style="color: #cd7f32;">🥉</div>
                  <div class="text-xs">{{ topPerformers[2]?.name || '-' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card border-0 shadow-soft">
            <div class="card-body p-4 text-center">
              <div class="icon icon-shape icon-sm bg-gradient-success text-center rounded-3 mx-auto mb-3">
                <i class="ni ni-fire text-white opacity-10"></i>
              </div>
              <h6 class="font-weight-bold mb-1">{{ $t('streak_leader') }}</h6>
              <p class="text-sm text-muted mb-3">{{ $t('longest_streak_this_month') }}</p>
              <div v-if="streakLeader" class="text-center">
                <div class="font-weight-bold text-success text-lg">{{ streakLeader.current_streak }}</div>
                <div class="text-xs text-muted">{{ streakLeader.name }}</div>
              </div>
              <div v-else class="text-muted">-</div>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card border-0 shadow-soft">
            <div class="card-body p-4 text-center">
              <div class="icon icon-shape icon-sm bg-gradient-warning text-center rounded-3 mx-auto mb-3">
                <i class="ni ni-bullet-list-67 text-white opacity-10"></i>
              </div>
              <h6 class="font-weight-bold mb-1">{{ $t('total_players') }}</h6>
              <p class="text-sm text-muted mb-3">{{ $t('active_players_this_month') }}</p>
              <div class="font-weight-bold text-primary text-lg">{{ totalPlayers || 0 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  </div>
</template>

<script setup>
import PageTitle from '@/components/PageTitle.vue';
import { ref, onMounted } from 'vue';
import { http } from '@/api/http-client.js';
import AppLayout from "@/layouts/AppLayout.vue";
import Leaderboard from "@/components/Gamification/Leaderboard.vue";

// State
const currentUserId = ref(null);
const userRank = ref(null);
const topPerformers = ref([]);
const streakLeader = ref(null);
const totalPlayers = ref(0);

// Methods
const fetchLeaderboardStats = async () => {
  try {
    // Fetch user rank
    const userRankResponse = await http.get('/api/leaderboard/user-ranks');
    if (userRankResponse.data.success) {
      userRank.value = userRankResponse.data.user_rank;
      currentUserId.value = userRankResponse.data.user_id;
    }

    // Fetch top performers
    const topPerformersResponse = await http.get('/api/leaderboard/global', {
      params: { limit: 3, period: 'month' }
    });
    if (topPerformersResponse.data.success) {
      topPerformers.value = topPerformersResponse.data.leaderboard.slice(0, 3);
    }

    // Fetch streak leader
    const streakResponse = await http.get('/api/leaderboard/streak', {
      params: { limit: 1 }
    });
    if (streakResponse.data.success && streakResponse.data.leaderboard.length > 0) {
      streakLeader.value = streakResponse.data.leaderboard[0];
    }

    // Fetch total players
    const totalResponse = await http.get('/api/leaderboard/global', {
      params: { limit: 1 }
    });
    if (totalResponse.data.success) {
      totalPlayers.value = totalResponse.data.total_players || 0;
    }
  } catch (error) {
    console.error('Failed to fetch leaderboard stats:', error);
  }
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

// Lifecycle
onMounted(() => {
  fetchLeaderboardStats();
});
</script>

<style scoped>
.icon-shape {
  width: 48px;
  height: 48px;
}

.text-lg {
  font-size: 1.5rem;
}
</style>
