<template>
    <div>
        <PageTitle :title="exam ? ($t('history') + ' - ' + exam.title) : $t('history')" />
        <AppLayout>
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">{{ $t('loading') || 'Đang tải...' }}</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="alert alert-danger">
                <h5 class="alert-heading">Lỗi</h5>
                <p>{{ error }}</p>
            </div>

            <!-- History Content -->
            <div v-else-if="exam">
            
            <!-- Page Header -->
            <div class="container-fluid py-4">
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb bg-transparent mb-2 pb-0 pt-1 px-0">
                                        <li class="breadcrumb-item">
                                            <router-link :to="resolve_route_name('exams.index')" class="text-decoration-none">
                                                {{ $t('exam') }}
                                            </router-link>
                                        </li>
                                        <li class="breadcrumb-item">
                                            <router-link :to="resolve_route_name('exams.show', { examSlug: exam.slug })" class="text-decoration-none">
                                                {{ exam.title }}
                                            </router-link>
                                        </li>
                                        <li class="breadcrumb-item active">{{ $t('history') }}</li>
                                    </ol>
                                </nav>
                                <h3 class="mb-0">{{ $t('exam_history') }}</h3>
                            </div>
                            <router-link
                                :to="resolve_route_name('exams.show', { examSlug: exam.slug })"
                                class="btn btn-primary"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                                {{ $t('take_exam_again') }}
                            </router-link>
                        </div>
                    </div>
                </div>

                <!-- Active Attempt Card -->
                <div v-if="active_attempt" class="row mb-4">
                    <div class="col-12">
                        <div class="card border-warning border-2 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                                            <svg width="24" height="24" class="text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h5 class="mb-1 fw-bold">{{ $t('exam_in_progress') }}</h5>
                                            <p class="mb-0 text-muted small">
                                                {{ $t('answered') }} {{ active_attempt.answered_questions }}/{{ active_attempt.total_questions }} {{ $t('questions') }}
                                            </p>
                                        </div>
                                    </div>
                                    <router-link
                                        :to="resolve_route_name('exams.quiz', { examSlug: exam.slug })"
                                        class="btn btn-warning"
                                    >
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-2">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                        </svg>
                                        {{ $t('continue_exam') }}
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- History List -->
                <div class="row">
                    <div class="col-12">
                        <!-- Empty State -->
                        <div v-if="!history || history.length === 0" class="card shadow-sm">
                            <div class="card-body text-center py-5">
                                <div class="mb-4">
                                    <div class="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 100px; height: 100px;">
                                        <svg width="50" height="50" class="text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        </svg>
                                    </div>
                                </div>
                                <h4 class="mb-2">{{ $t('no_history') }}</h4>
                                <p class="text-muted mb-4">{{ $t('you_have_not_completed_this_exam_yet') }}</p>
                                <router-link
                                    :to="resolve_route_name('exams.show', { examSlug: exam.slug })"
                                    class="btn btn-primary"
                                >
                                    {{ $t('start_exam') }}
                                </router-link>
                            </div>
                        </div>

                        <!-- History Cards -->
                        <div v-else class="row g-3">
                            <div
                                v-for="(attempt, index) in history"
                                :key="attempt.id"
                                class="col-12 col-md-6 col-lg-4"
                            >
                                <div class="card h-100 shadow-sm hover-shadow">
                                    <div class="card-body">
                                        <!-- Badge -->
                                        <div class="d-flex justify-content-between align-items-start mb-3">
                                            <span class="badge" :class="attempt.is_passed ? 'bg-success' : 'bg-danger'">
                                                {{ attempt.is_passed ? $t('passed') : $t('not_passed') }}
                                            </span>
                                            <span class="text-muted small">#{{ history.length - index }}</span>
                                        </div>

                                        <!-- Score -->
                                        <div class="text-center mb-3">
                                            <div class="display-4 fw-bold" :class="attempt.is_passed ? 'text-success' : 'text-danger'">
                                                {{ attempt.score_percentage }}%
                                            </div>
                                            <p class="text-muted mb-0 small">
                                                {{ attempt.correct_answers }}/{{ attempt.total_questions }} {{ $t('correct_answers') }}
                                            </p>
                                        </div>

                                        <!-- Stats -->
                                        <div class="border-top pt-3 mb-3">
                                            <div class="d-flex justify-content-between mb-2">
                                                <span class="text-muted small">{{ $t('time') }}:</span>
                                                <span class="fw-semibold small">{{ attempt.time_spent }}</span>
                                            </div>
                                            <div class="d-flex justify-content-between">
                                                <span class="text-muted small">{{ $t('completed_at') }}:</span>
                                                <span class="fw-semibold small">{{ formatDate(attempt.completed_at) }}</span>
                                            </div>
                                        </div>

                                        <!-- Actions -->
                                        <router-link
                                            :to="resolve_route_name('exams.attempt.details', { examSlug: exam.slug, attemptId: attempt.id })"
                                            class="btn btn-sm btn-outline-primary w-100"
                                        >
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-1">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                            </svg>
                                            {{ $t('view_details') }}
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistics Summary -->
                <div v-if="history && history.length > 0" class="row mt-4">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-white">
                                <h5 class="mb-0">{{ $t('summary_statistics') }}</h5>
                            </div>
                            <div class="card-body">
                                <div class="row text-center">
                                    <div class="col-6 col-md-3 mb-3 mb-md-0">
                                        <div class="h3 fw-bold text-primary mb-1">{{ history.length }}</div>
                                        <div class="text-muted small">{{ $t('attempts') }}</div>
                                    </div>
                                    <div class="col-6 col-md-3 mb-3 mb-md-0">
                                        <div class="h3 fw-bold text-success mb-1">{{ passCount }}</div>
                                        <div class="text-muted small">{{ $t('passed') }}</div>
                                    </div>
                                    <div class="col-6 col-md-3">
                                        <div class="h3 fw-bold text-warning mb-1">{{ averageScore.toFixed(1) }}%</div>
                                        <div class="text-muted small">{{ $t('average_score') }}</div>
                                    </div>
                                    <div class="col-6 col-md-3">
                                        <div class="h3 fw-bold text-info mb-1">{{ bestScore }}%</div>
                                        <div class="text-muted small">{{ $t('highest_score') }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            <!-- No Data State -->
            <div v-else class="alert alert-warning">
                <h5>{{ $t('no_data') || 'Không có dữ liệu' }}</h5>
                <p>{{ $t('no_exam_found') || 'Không tìm thấy bài thi' }}</p>
            </div>
        </AppLayout>
    </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { resolve_route_name } from "@/utils/route-helper.js";
import { ref, computed, onMounted } from "vue";
import { useRoute } from 'vue-router';
import AppLayout from "@/layouts/AppLayout.vue";
import { http } from '@/api/http-client.js';

// Get route params
const route = useRoute();

// Data from API
const exam = ref(null);
const active_attempt = ref(null);
const history = ref([]);
const loading = ref(true);
const error = ref(null);

// Fetch history data from API
const fetchHistoryData = async () => {
    try {
        loading.value = true;
        error.value = null;
        
        const examSlug = route.params.examSlug;
        
        const response = await http.get(`/api/exams/${examSlug}/history`);
        
        if (response.data.success) {
            exam.value = response.data.exam;
            active_attempt.value = response.data.active_attempt;
            history.value = response.data.history;
        } else {
            error.value = 'Failed to load history';
        }
    } catch (err) {
        console.error('Error fetching history:', err);
        error.value = err.message || 'Failed to load history';
    } finally {
        loading.value = false;
    }
};

// Fetch data on mount
onMounted(() => {
    fetchHistoryData();
});

const passCount = computed(() => {
    return history.value.filter(attempt => attempt.is_passed).length;
});

const averageScore = computed(() => {
    if (!history.value || history.value.length === 0) return 0;
    const sum = history.value.reduce((acc, attempt) => acc + attempt.score_percentage, 0);
    return sum / history.value.length;
});

const bestScore = computed(() => {
    if (!history.value || history.value.length === 0) return 0;
    return Math.max(...history.value.map(attempt => attempt.score_percentage));
});

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};
</script>

<style scoped>
.hover-shadow {
    transition: box-shadow 0.3s ease;
}

.hover-shadow:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>

