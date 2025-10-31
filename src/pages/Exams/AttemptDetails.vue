<template>
    <div>
        <PageTitle :title="attempt ? ($t('details') + ' - ' + attempt.exam.title) : $t('details')" />
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
                    <button @click="fetchAttemptDetails" class="btn btn-primary">
                        {{ $t('retry') }}
                    </button>
                </div>
            </div>

            <!-- Main Content -->
            <div v-else-if="attempt" class="container-fluid py-4">
                <div class="row mb-4">
                    <div class="col-12">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb bg-transparent mb-2 pb-0 pt-1 px-0">
                                <li class="breadcrumb-item">
                                    <router-link :to="resolve_route_name('exams.index')" class="text-decoration-none">
                                        {{ $t('exam') }}
                                    </router-link>
                                </li>
                                <li class="breadcrumb-item">
                                    <router-link :to="resolve_route_name('exams.show', { examSlug: attempt.exam.slug })" class="text-decoration-none">
                                        {{ attempt.exam.title }}
                                    </router-link>
                                </li>
                                <li class="breadcrumb-item">
                                    <router-link :to="resolve_route_name('exams.history', { examSlug: attempt.exam.slug })" class="text-decoration-none">
                                        {{ $t('history') }}
                                    </router-link>
                                </li>
                                <li class="breadcrumb-item active">{{ $t('details') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <!-- Result Summary Card -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card shadow-lg border-0">
                            <div class="card-body p-4">
                                <div class="row align-items-center">
                                    <!-- Score Circle -->
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
                                                    :stroke="attempt.is_passed ? '#198754' : '#dc3545'"
                                                    stroke-width="15"
                                                    :stroke-dasharray="circumference"
                                                    :stroke-dashoffset="circumference - (circumference * attempt.score_percentage) / 100"
                                                    stroke-linecap="round"
                                                    transform="rotate(-90 90 90)"
                                                />
                                            </svg>
                                            <div class="position-absolute top-50 start-50 translate-middle text-center">
                                                <div class="display-4 fw-bold" :class="attempt.is_passed ? 'text-success' : 'text-danger'">
                                                    {{ attempt.score_percentage }}%
                                                </div>
                                                <div class="badge" :class="attempt.is_passed ? 'bg-success' : 'bg-danger'">
                                                    {{ attempt.is_passed ? $t('passed') : $t('not_passed') }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Stats -->
                                    <div class="col-md-8">
                                        <h3 class="mb-4">{{ $t('detailed_results') }}</h3>
                                        <div class="row g-3">
                                            <div class="col-6 col-lg-3">
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="bg-primary bg-opacity-10 rounded p-2">
                                                        <svg width="24" height="24" class="text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div class="h5 mb-0 fw-bold">{{ attempt.total_questions }}</div>
                                                        <div class="text-muted small">{{ $t('total_questions') }}</div>
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
                                                        <div class="h5 mb-0 fw-bold text-success">{{ attempt.correct_answers }}</div>
                                                        <div class="text-muted small">{{ $t('correct_answers') }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-6 col-lg-3">
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="bg-danger bg-opacity-10 rounded p-2">
                                                        <svg width="24" height="24" class="text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div class="h5 mb-0 fw-bold text-danger">{{ attempt.incorrect_answers }}</div>
                                                        <div class="text-muted small">{{ $t('incorrect_answers') }}</div>
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
                                                        <div class="h5 mb-0 fw-bold text-info">{{ attempt.time_spent }}</div>
                                                        <div class="text-muted small">{{ $t('time') }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mt-4 pt-3 border-top">
                                            <div class="text-muted small mb-1">{{ $t('completed_at') }}:</div>
                                            <div class="fw-semibold">{{ formatDate(attempt.completed_at) }}</div>
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
                                :to="resolve_route_name('exams.quiz', { examSlug: attempt.exam.slug })"
                                class="btn btn-primary"
                            >
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                </svg>
                                {{ $t('take_exam_again') }}
                            </router-link>
                            <router-link
                                :to="resolve_route_name('exams.history', { examSlug: attempt.exam.slug })"
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

                <!-- Questions Review -->
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-white d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">{{ $t('detailed_answers') }}</h5>
                                <div class="btn-group btn-group-sm">
                                    <button @click="expandAll" class="btn btn-outline-primary">
                                        <i class="bi bi-arrows-expand"></i>
                                        {{ $t('expand_all') }}
                                    </button>
                                    <button @click="collapseAll" class="btn btn-outline-secondary">
                                        <i class="bi bi-arrows-collapse"></i>
                                        {{ $t('collapse_all') }}
                                    </button>
                                </div>
                            </div>
                            <div class="card-body p-0">
                                <div
                                    v-for="(answer, index) in attempt.answers"
                                    :key="answer.id"
                                    class="border-bottom"
                                >
                                    <!-- Question Summary (Always Visible - Clickable) -->
                                    <div 
                                        @click="toggleQuestion(index)"
                                        class="p-3 cursor-pointer hover-bg-light"
                                        style="cursor: pointer;"
                                    >
                                        <div class="d-flex justify-content-between align-items-center">
                                            <!-- Left: Question number & status -->
                                            <div class="d-flex align-items-center gap-3">
                                                <div
                                                    class="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                                    style="width: 40px; height: 40px;"
                                                    :class="answer.is_correct ? 'bg-success text-white' : 'bg-danger text-white'"
                                                >
                                                    {{ index + 1 }}
                                                </div>
                                                <div>
                                                    <span class="badge" :class="answer.is_correct ? 'bg-success' : 'bg-danger'">
                                                        {{ answer.is_correct ? $t('correct') : $t('incorrect') }}
                                                    </span>
                                                    <div class="text-muted small mt-1">
                                                        {{ $t('click_to_view_details') }}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <!-- Right: Expand/Collapse icon -->
                                            <div>
                                                <i 
                                                    class="bi transition-transform"
                                                    :class="isExpanded(index) ? 'bi-chevron-up' : 'bi-chevron-down'"
                                                    style="font-size: 1.5rem;"
                                                ></i>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Question Details (Collapsible) -->
                                    <div v-if="isExpanded(index)" class="p-4 pt-0 animate-fade-in">
                                        <!-- Question Content -->
                                        <div class="mb-3">
                                            <div class="bg-light rounded p-3">
                                                <div v-html="processContentForHighlight(answer.question.content)"></div>
                                            </div>
                                        </div>

                                        <!-- Choices -->
                                        <div class="row g-2">
                                            <div
                                                v-for="(choice, choiceIndex) in answer.question.choices"
                                                :key="choice.id"
                                                class="col-12 col-md-6"
                                            >
                                                <div
                                                    class="card h-100 border-2"
                                                    :class="{
                                                        'border-success bg-success bg-opacity-10': choice.is_correct,
                                                        'border-danger bg-danger bg-opacity-10': !choice.is_correct && answer.selected_choice_ids.includes(choice.id),
                                                        'border-light': !choice.is_correct && !answer.selected_choice_ids.includes(choice.id)
                                                    }"
                                                >
                                                    <div class="card-body p-3">
                                                        <div class="d-flex align-items-center gap-3">
                                                            <!-- Letter -->
                                                            <div
                                                                class="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                                                style="width: 32px; height: 32px;"
                                                                :class="{
                                                                    'bg-success text-white': choice.is_correct,
                                                                    'bg-danger text-white': !choice.is_correct && answer.selected_choice_ids.includes(choice.id),
                                                                    'bg-light text-secondary': !choice.is_correct && !answer.selected_choice_ids.includes(choice.id)
                                                                }"
                                                            >
                                                                {{ letters[choiceIndex] }}
                                                            </div>

                                                            <!-- Content -->
                                                            <div class="flex-grow-1">
                                                                <FormattedText
                                                                    :content="choice.content"
                                                                    :preserve-formatting="true"
                                                                    font-family="monospace"
                                                                />
                                                            </div>

                                                            <!-- Icon -->
                                                            <div class="flex-shrink-0">
                                                                <svg
                                                                    v-if="choice.is_correct"
                                                                    width="20"
                                                                    height="20"
                                                                    class="text-success"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                                                </svg>
                                                                <svg
                                                                    v-else-if="answer.selected_choice_ids.includes(choice.id)"
                                                                    width="20"
                                                                    height="20"
                                                                    class="text-danger"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Explanation -->
                                        <div v-if="answer.question.explanation" class="mt-3">
                                            <div class="card bg-primary bg-opacity-10 border-primary">
                                                <div class="card-body">
                                                    <div class="d-flex gap-2 mb-2">
                                                        <svg width="20" height="20" class="text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                        </svg>
                                                        <span class="fw-bold">{{ $t('explanation') }}:</span>
                                                    </div>
                                                    <div v-html="processContentForHighlight(answer.question.explanation)"></div>
                                                </div>
                                            </div>
                                        </div>
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
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import FormattedText from "@/components/Shared/FormattedText.vue";
import { http } from '@/api/http-client.js';
import { processContentForHighlight } from '@/utils/highlight.js';

const route = useRoute();
const router = useRouter();

// Reactive state
const attempt = ref(null);
const loading = ref(true);
const error = ref(null);

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

// State để track câu hỏi nào đang expanded
const expandedQuestions = ref(new Set())

// Fetch attempt details from API
const fetchAttemptDetails = async () => {
    const attemptId = route.params.attemptId;
    
    if (!attemptId) {
        error.value = "Không tìm thấy ID bài thi";
        loading.value = false;
        return;
    }

    try {
        loading.value = true;
        error.value = null;
        const response = await http.get(`/api/exams/attempts/${attemptId}`);
        
        if (response.data.success) {
            attempt.value = response.data.attempt;
        } else {
            error.value = response.data.message || "Không thể tải chi tiết bài thi";
        }
    } catch (err) {
        error.value = err.response?.data?.message || "Không thể tải chi tiết bài thi";
    } finally {
        loading.value = false;
    }
};

// Toggle expand/collapse cho câu hỏi
const toggleQuestion = (index) => {
    if (expandedQuestions.value.has(index)) {
        expandedQuestions.value.delete(index)
    } else {
        expandedQuestions.value.add(index)
    }
}

// Check xem câu hỏi có đang expanded không
const isExpanded = (index) => {
    return expandedQuestions.value.has(index)
}

// Expand tất cả
const expandAll = () => {
    if (attempt.value?.answers) {
        attempt.value.answers.forEach((_, index) => {
            expandedQuestions.value.add(index)
        })
    }
}

// Collapse tất cả
const collapseAll = () => {
    expandedQuestions.value.clear()
}

const circumference = computed(() => {
    return 2 * Math.PI * 70; // radius = 70
});

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

onMounted(() => {
    fetchAttemptDetails();
});
</script>

<style scoped>
.card {
    transition: all 0.3s ease;
}

.cursor-pointer {
    cursor: pointer;
}

.hover-bg-light:hover {
    background-color: #f8f9fa;
}

.transition-transform {
    transition: transform 0.2s ease;
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

