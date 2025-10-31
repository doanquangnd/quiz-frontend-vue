<template>
    <div>
        <PageTitle :title="progress ? ($t('details') + ' - ' + progress.document.title) : $t('details')" />
        <AppLayout>
            <!-- Loading State -->
            <div v-if="loading" class="container-fluid py-4">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3">{{ $t('loading') }}...</p>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="container-fluid py-4">
                <div class="alert alert-danger">
                    <h4>{{ $t('error') }}</h4>
                    <p>{{ error }}</p>
                </div>
            </div>

            <!-- Progress Content -->
            <div v-else-if="progress" class="container-fluid py-4">
                <!-- Page Header -->
                <div class="row mb-4">
                    <div class="col-12">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb bg-transparent mb-2 pb-0 pt-1 px-0">
                                <li class="breadcrumb-item">
                                    <router-link :to="resolve_route_name('documents.index')" class="text-decoration-none">
                                        {{ $t('documents') }}
                                    </router-link>
                                </li>
                                <li class="breadcrumb-item">
                                    <router-link :to="resolve_route_name('documents.show', { documentSlug: progress.document.slug })" class="text-decoration-none">
                                        {{ progress.document.title }}
                                    </router-link>
                                </li>
                                <li class="breadcrumb-item">
                                    <router-link :to="resolve_route_name('documents.history')" class="text-decoration-none">
                                        {{ $t('history') }}
                                    </router-link>
                                </li>
                                <li class="breadcrumb-item active">{{ $t('details') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <!-- Progress Summary Card -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-lg border-0">
                            <div class="card-body p-4">
                                <div class="row align-items-center">
                                    <!-- Progress Circle -->
                                    <div class="col-md-4 text-center mb-4 mb-md-0">
                                        <div class="position-relative d-inline-block">
                                            <svg width="180" height="180" viewBox="0 0 180 180">
                                                <!-- Background circle -->
                                                <circle
                                                    cx="90"
                                                    cy="90"
                                                    r="70"
                                                    fill="none"
                                                    stroke="#e9ecef"
                                                    stroke-width="15"
                                                />
                                                <!-- Progress circle -->
                                                <circle
                                                    cx="90"
                                                    cy="90"
                                                    r="70"
                                                    fill="none"
                                                    stroke="#198754"
                                                    stroke-width="15"
                                                    :stroke-dasharray="circumference"
                                                    :stroke-dashoffset="circumference - (circumference * progress.completion_percentage) / 100"
                                                    stroke-linecap="round"
                                                    transform="rotate(-90 90 90)"
                                                />
                                            </svg>
                                            <div class="position-absolute top-50 start-50 translate-middle text-center">
                                                <div class="display-4 fw-bold text-success">
                                                    {{ progress.completion_percentage }}%
                                                </div>
                                                <div class="badge bg-success">{{ $t('completed') }}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Stats -->
                                    <div class="col-md-8">
                                        <h3 class="mb-4">{{ $t('learning_statistics') }}</h3>
                                        <div class="row g-3">
                                            <div class="col-6 col-lg-3">
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="bg-primary bg-opacity-10 rounded p-2">
                                                        <svg width="24" height="24" class="text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div class="h5 mb-0 fw-bold">{{ progress.completed_categories }}/{{ progress.total_categories }}</div>
                                                        <div class="text-muted small">{{ $t('chapter') }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-6 col-lg-3">
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="bg-success bg-opacity-10 rounded p-2">
                                                        <svg width="24" height="24" class="text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div class="h5 mb-0 fw-bold text-success">{{ progress.total_correct_answers }}</div>
                                                        <div class="text-muted small">{{ $t('correct_questions') }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-6 col-lg-3">
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="bg-warning bg-opacity-10 rounded p-2">
                                                        <svg width="24" height="24" class="text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div class="h5 mb-0 fw-bold text-warning">{{ progress.average_score.toFixed(1) }}%</div>
                                                        <div class="text-muted small">{{ $t('average_score') }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-6 col-lg-3">
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="bg-info bg-opacity-10 rounded p-2">
                                                        <svg width="24" height="24" class="text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div class="h5 mb-0 fw-bold text-info">{{ progress.time_spent }}</div>
                                                        <div class="text-muted small">{{ $t('time') }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mt-4 pt-3 border-top">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="text-muted small mb-1">{{ $t('started_at') }}:</div>
                                                    <div class="fw-semibold">{{ formatDate(progress.started_at) }}</div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="text-muted small mb-1">{{ $t('completed_at') }}:</div>
                                                    <div class="fw-semibold">{{ formatDate(progress.completed_at) }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="d-flex gap-2">
                            <router-link
                                :to="resolve_route_name('documents.show', { documentSlug: progress.document.slug })"
                                class="btn btn-primary"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                </svg>
                                {{ $t('learn_again') }}
                            </router-link>
                            <router-link
                                :to="resolve_route_name('documents.history')"
                                class="btn btn-outline-secondary"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                </svg>
                                {{ $t('return_to_history') }}
                            </router-link>
                        </div>
                    </div>
                </div>

                <!-- Category Progress -->
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-white">
                                <h5 class="mb-0">{{ $t('chapter_progress') }}</h5>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-hover mb-0">
                                        <thead class="bg-light">
                                            <tr>
                                                <th class="ps-4">STT</th>
                                                <th>{{ $t('chapter') }}</th>
                                                <th class="text-center">{{ $t('correct_questions') }}</th>
                                                <th class="text-center">{{ $t('percentage') }}</th>
                                                <th class="text-center">{{ $t('status') }}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="(catProgress, index) in progress.category_progresses"
                                                :key="catProgress.id"
                                            >
                                                <td class="ps-4">{{ index + 1 }}</td>
                                                <td>
                                                    <div class="fw-semibold">{{ catProgress.category.title }}</div>
                                                </td>
                                                <td class="text-center">
                                                    <span class="badge bg-success">
                                                        {{ catProgress.correct_count }}/{{ catProgress.answered_count }}
                                                    </span>
                                                </td>
                                                <td class="text-center">
                                                    <div class="d-flex align-items-center justify-content-center gap-2">
                                                        <div class="progress" style="width: 80px; height: 8px;">
                                                            <div
                                                                class="progress-bar"
                                                                :class="getProgressBarClass(catProgress)"
                                                                role="progressbar"
                                                                :style="{ width: getPercentage(catProgress) + '%' }"
                                                            ></div>
                                                        </div>
                                                        <span class="small fw-semibold">{{ getPercentage(catProgress) }}%</span>
                                                    </div>
                                                </td>
                                                <td class="text-center">
                                                    <span class="badge" :class="catProgress.completed ? 'bg-success' : 'bg-warning'">
                                                        {{ catProgress.completed ? $t('completed') : $t('learning_in_progress') }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { resolve_route_name } from "@/utils/route-helper.js";
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import { http } from '@/api/http-client.js';

const route = useRoute();

const progress = ref(null);
const loading = ref(true);
const error = ref(null);

// Fetch progress details from API
const fetchProgressDetails = async () => {
    const progressId = route.params.progressId;
    
    if (!progressId) {
        error.value = "Không tìm thấy ID tiến độ";
        loading.value = false;
        return;
    }

    try {
        loading.value = true;
        error.value = null;
        const response = await http.get(`/api/documents/progress/${progressId}`);
        
        if (response.data.success) {
            progress.value = response.data.progress;
        } else {
            error.value = response.data.message || "Không thể tải chi tiết tiến độ";
        }
    } catch (err) {
        error.value = err.response?.data?.message || "Không thể tải chi tiết tiến độ";
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchProgressDetails();
});

const circumference = computed(() => {
    return 2 * Math.PI * 70; // radius = 70
});

const getPercentage = (catProgress) => {
    if (catProgress.answered_count === 0) return 0;
    return Math.round((catProgress.correct_count / catProgress.answered_count) * 100);
};

const getProgressBarClass = (catProgress) => {
    const percentage = getPercentage(catProgress);
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-info';
    if (percentage >= 40) return 'bg-warning';
    return 'bg-danger';
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
</script>

<style scoped>
.table {
    transition: all 0.3s ease;
}

.table tbody tr {
    transition: background-color 0.2s ease;
}

.table tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.02);
}
</style>

