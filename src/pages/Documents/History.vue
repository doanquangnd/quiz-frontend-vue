<template>
    <div>
        <PageTitle :title="$t('history') + ' - ' + document.title" />
        <AppLayout>
            <!-- Page Header -->
            <div class="container-fluid py-4">
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb bg-transparent mb-2 pb-0 pt-1 px-0">
                                        <li class="breadcrumb-item">
                                            <router-link :to="resolve_route_name('documents.index')" class="text-decoration-none">
                                                {{ $t('documents') }}
                                            </router-link>
                                        </li>
                                        <li class="breadcrumb-item">
                                            <router-link :to="resolve_route_name('documents.show', { documentSlug: document.slug })" class="text-decoration-none">
                                                {{ document.title }}
                                            </router-link>
                                        </li>
                                        <li class="breadcrumb-item active">{{ $t('history') }}</li>
                                    </ol>
                                </nav>
                                <h3 class="mb-0">{{ $t('history') }}</h3>
                            </div>
                            <router-link
                                :to="resolve_route_name('documents.show', { documentSlug: document.slug })"
                                class="btn btn-primary"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                </svg>
                                {{ $t('start_learning') }}
                            </router-link>
                        </div>
                    </div>
                </div>

                <!-- Active Progress Card -->
                <div v-if="active_progress" class="row mb-4">
                    <div class="col-12">
                        <div class="card border-warning border-2 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                                            <svg width="24" height="24" class="text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h5 class="mb-1 fw-bold">{{ $t('learning_in_progress') }}</h5>
                                            <div class="d-flex align-items-center gap-3 text-muted small">
                                                <span>
                                                    {{ $t('progress') }}: {{ active_progress.completed_categories }}/{{ active_progress.total_categories }} {{ $t('chapters') }}
                                                </span>
                                                <span class="badge bg-warning">{{ active_progress.completion_percentage }}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <router-link
                                        :to="resolve_route_name('documents.show', { documentSlug: document.slug })"
                                        class="btn btn-warning"
                                    >
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-2">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                        </svg>
                                        {{ $t('continue_learning') }}
                                    </router-link>
                                </div>

                                <!-- Progress Bar -->
                                <div class="mt-3">
                                    <div class="progress" style="height: 8px;">
                                        <div
                                            class="progress-bar bg-warning"
                                            role="progressbar"
                                            :style="{ width: active_progress.completion_percentage + '%' }"
                                            :aria-valuenow="active_progress.completion_percentage"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
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
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                        </svg>
                                    </div>
                                </div>
                                <h4 class="mb-2">{{ $t('no_history') }}</h4>
                                <p class="text-muted mb-4">{{ $t('you_have_not_completed_this_document_yet') }}</p>
                                <router-link
                                    :to="resolve_route_name('documents.show', { documentSlug: document.slug })"
                                    class="btn btn-primary"
                                >
                                    {{ $t('start_learning') }}
                                </router-link>
                            </div>
                        </div>

                        <!-- History Cards -->
                        <div v-else class="row g-3">
                            <div
                                v-for="(progress, index) in history"
                                :key="progress.id"
                                class="col-12 col-md-6 col-lg-4"
                            >
                                <div class="card h-100 shadow-sm hover-shadow">
                                    <div class="card-body">
                                        <!-- Badge -->
                                        <div class="d-flex justify-content-between align-items-start mb-3">
                                            <span class="badge bg-success">{{ $t('completed') }}</span>
                                            <span class="text-muted small">#{{ history.length - index }}</span>
                                        </div>

                                        <!-- Completion -->
                                        <div class="text-center mb-3">
                                            <div class="display-4 fw-bold text-success">
                                                {{ progress.completion_percentage }}%
                                            </div>
                                            <p class="text-muted mb-0 small">
                                                {{ progress.completed_categories }}/{{ progress.total_categories }} {{ $t('chapters') }}
                                            </p>
                                        </div>

                                        <!-- Stats -->
                                        <div class="border-top pt-3 mb-3">
                                            <div class="d-flex justify-content-between mb-2">
                                                <span class="text-muted small">{{ $t('average_score') }}:</span>
                                                <span class="fw-semibold small">{{ progress.average_score.toFixed(1) }}%</span>
                                            </div>
                                            <div class="d-flex justify-content-between mb-2">
                                                <span class="text-muted small">{{ $t('total_correct_answers') }}:</span>
                                                <span class="fw-semibold small">{{ progress.total_correct_answers }}/{{ progress.total_questions_answered }}</span>
                                            </div>
                                            <div class="d-flex justify-content-between mb-2">
                                                <span class="text-muted small">{{ $t('time_spent') }}:</span>
                                                <span class="fw-semibold small">{{ progress.time_spent }}</span>
                                            </div>
                                            <div class="d-flex justify-content-between">
                                                <span class="text-muted small">{{ $t('completed') }}:</span>
                                                <span class="fw-semibold small">{{ formatDate(progress.completed_at) }}</span>
                                            </div>
                                        </div>

                                        <!-- Actions -->
                                        <router-link
                                            :to="resolve_route_name('documents.progress.details', { progressId: progress.id })"
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
                                <h5 class="mb-0">{{ $t('statistics') }}</h5>
                            </div>
                            <div class="card-body">
                                <div class="row text-center">
                                    <div class="col-6 col-md-3 mb-3 mb-md-0">
                                        <div class="h3 fw-bold text-primary mb-1">{{ history.length }}</div>
                                        <div class="text-muted small">{{ $t('learning_attempts') }}</div>
                                    </div>
                                    <div class="col-6 col-md-3 mb-3 mb-md-0">
                                        <div class="h3 fw-bold text-success mb-1">{{ totalQuestionsAnswered }}</div>
                                        <div class="text-muted small">{{ $t('total_questions') }}</div>
                                    </div>
                                    <div class="col-6 col-md-3">
                                        <div class="h3 fw-bold text-warning mb-1">{{ overallAverageScore.toFixed(1) }}%</div>
                                        <div class="text-muted small">{{ $t('average_score') }}</div>
                                    </div>
                                    <div class="col-6 col-md-3">
                                        <div class="h3 fw-bold text-info mb-1">{{ bestScore.toFixed(1) }}%</div>
                                        <div class="text-muted small">{{ $t('highest_score') }}</div>
                                    </div>
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
import { computed } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
    document: Object,
    active_progress: Object,
    history: Array,
});

const totalQuestionsAnswered = computed(() => {
    if (!props.history || props.history.length === 0) return 0;
    return props.history.reduce((sum, progress) => sum + progress.total_questions_answered, 0);
});

const overallAverageScore = computed(() => {
    if (!props.history || props.history.length === 0) return 0;
    const sum = props.history.reduce((acc, progress) => acc + progress.average_score, 0);
    return sum / props.history.length;
});

const bestScore = computed(() => {
    if (!props.history || props.history.length === 0) return 0;
    return Math.max(...props.history.map(progress => progress.average_score));
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

