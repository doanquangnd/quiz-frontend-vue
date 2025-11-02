<template>
    <div>
        <PageTitle :title="category ? ($t('learn_by_chapter') + ' - ' + category.title) : $t('learn_by_chapter')" />
        <AppLayout>
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">{{ $t('loading') || 'Loading...' }}</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="alert alert-danger">
                <h5 class="alert-heading">Error</h5>
                <p>{{ error }}</p>
                <button @click="fetchPracticeData" class="btn btn-primary">Retry</button>
            </div>

            <!-- Practice Content -->
            <div v-else-if="category && questions.length > 0">
            <!-- Practice Header -->
            <div class="practice-header-fixed rounded-3">
                <div class="d-flex align-items-center justify-content-between flex-wrap">
                    <div class="mb-3 mb-md-0">
                        <div class="text-muted small mb-1">
                            <router-link :to="resolve_route_name('documents.show', { documentSlug: category.document.slug })" class="text-decoration-none">
                                {{ category.document.title }}
                            </router-link>
                            <span class="mx-2">›</span>
                            <span>{{ category.title }}</span>
                        </div>
                        <div class="d-flex align-items-center gap-3">
                            <h5 class="fw-bold text-dark mb-2">
                                {{ $t('learn_by_chapter') }}
                            </h5>
                            <div class="d-flex align-items-center justify-content-between gap-3">
                                <p class="mb-0">
                                    {{ $t('question') }} {{ currentQuestionIndex + 1 }} / {{ questions.length }}
                                </p>
                                <!-- Progress Bar -->
                                <div class="d-flex align-items-center gap-3">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="text-muted small">
                                            {{ $t('progress') }}:
                                            <span class="fw-semibold text-dark">{{
                                                Math.round(
                                                    (answeredCount / questions.length) * 100
                                                )
                                            }}%</span>
                                        </div>
                                        <div class="progress" style="width: 200px; height: 12px;">
                                            <div
                                                class="progress-bar bg-gradient-primary"
                                                role="progressbar"
                                                :style="{
                                                    width:
                                                        (answeredCount / questions.length) *
                                                            100 +
                                                        '%',
                                                }"
                                                :aria-valuenow="(answeredCount / questions.length) * 100"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    <div v-if="answeredCount > 0" class="text-center">
                                        <div class="h5 fw-bold text-success mb-0">
                                            {{ correctCount }}
                                        </div>
                                        <div class="text-muted small">{{ $t('correct') }}</div>
                                    </div>
                                    <div v-if="answeredCount > 0" class="text-center">
                                        <div class="h5 fw-bold text-danger mb-0">
                                            {{ answeredCount - correctCount }}
                                        </div>
                                        <div class="text-muted small">{{ $t('incorrect') }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Practice Content -->
            <div class="practice-content-wrapper row mt-4">
                <!-- Main Practice Area -->
                <div class="col-12">
                    <!-- Empty State -->
                    <div
                        v-if="!questions || questions.length === 0"
                        class="d-flex align-items-center justify-center min-vh-50"
                    >
                        <div class="card border-0 shadow-lg text-center p-5" style="max-width: 500px;">
                            <div class="mb-4">
                                <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 100px; height: 100px;">
                                    <svg
                                        width="50"
                                        height="50"
                                        class="text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <h3 class="h4 fw-bold text-dark mb-3">
                                {{ $t('no_questions_yet') }}
                            </h3>
                            <p class="text-muted mb-4">
                                {{ $t('this_chapter_has_no_questions') }}
                            </p>
                            <router-link
                                :to="resolve_route_name('documents.show', { documentSlug: category.document.slug })"
                                class="btn btn-primary btn-lg"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    class="me-2"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                {{ $t('return_to_chapter_list') }}
                            </router-link>
                        </div>
                    </div>

                    <!-- Question Card -->
                    <div v-if="currentQuestion" class="container card border-0 shadow-soft quiz-content practice-question-card">
                        <div class="card-body p-4">
                            <!-- Question Text -->
                            <div class="mb-4">
                                <div class="bg-light border rounded p-4">
                                    <div
                                        class="question-text"
                                        v-html="processedCurrentQuestion?.content"
                                    ></div>
                                </div>
                            </div>

                            <!-- Choices Grid -->
                            <div class="row g-2 mb-4">
                                <div
                                    v-for="(choice, index) in currentQuestion.choices"
                                    :key="choice.id"
                                    class="col-12 col-lg-6"
                                >
                                    <div
                                        @click="toggleChoice(choice.id)"
                                        class="card h-100 cursor-pointer transition-all choice-option"
                                        :class="{
                                            'border-info bg-white shadow-sm selected':
                                                selected.includes(choice.id) &&
                                                !showAnswer,
                                            'border-success bg-white shadow-sm':
                                                showAnswer &&
                                                isChoiceCorrect(choice.id),
                                            'border-warning bg-white shadow-sm':
                                                showAnswer &&
                                                selected.includes(choice.id) &&
                                                !isChoiceCorrect(choice.id),
                                            'opacity-60':
                                                showAnswer &&
                                                !isChoiceCorrect(choice.id) &&
                                                !selected.includes(choice.id),
                                            'border-light bg-white': !selected.includes(choice.id) && !showAnswer,
                                        }"
                                        style="cursor: pointer; min-height: 65px;"
                                    >
                                        <div class="card-body d-flex align-items-center gap-3 p-3">
                                            <!-- Choice Letter -->
                                            <div class="flex-shrink-0">
                                                <div
                                                    class="rounded-circle d-flex align-items-center justify-content-center choice-letter"
                                                    :class="{
                                                        'bg-info text-white':
                                                            selected.includes(
                                                                choice.id
                                                            ) && !showAnswer,
                                                        'bg-success text-white':
                                                            showAnswer &&
                                                            isChoiceCorrect(
                                                                choice.id
                                                            ),
                                                        'bg-warning text-dark':
                                                            showAnswer &&
                                                            selected.includes(
                                                                choice.id
                                                            ) &&
                                                            !isChoiceCorrect(
                                                                choice.id
                                                            ),
                                                        'bg-light text-secondary':
                                                            !selected.includes(
                                                                choice.id
                                                            ) && !showAnswer,
                                                    }"
                                                >
                                                    {{ letters[index] }}
                                                </div>
                                            </div>

                                            <!-- Choice Content -->
                                            <div class="flex-grow-1">
                                                <FormattedText
                                                    :content="choice?.content"
                                                    :preserve-formatting="true"
                                                    text-class="text-dark small"
                                                    font-family="monospace"
                                                />
                                            </div>

                                            <!-- Status Icon -->
                                            <div
                                                v-if="showAnswer"
                                                class="flex-shrink-0"
                                            >
                                                <div
                                                    v-if="isChoiceCorrect(choice.id)"
                                                    class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                                                    style="width: 28px; height: 28px;"
                                                >
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="3"
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                                <div
                                                    v-else-if="selected.includes(choice.id)"
                                                    class="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center"
                                                    style="width: 28px; height: 28px;"
                                                >
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="3"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Action Button -->
                            <div class="text-center">
                                <!-- Nếu câu chưa trả lời, hiển thị nút kiểm tra -->
                                <button
                                    v-if="!showAnswer && !isCurrentQuestionAnswered"
                                    @click="submitAnswer"
                                    :disabled="selected.length === 0"
                                    class="btn btn-primary btn-lg px-5"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        class="me-2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>{{ $t('check_answer') }}</span>
                                </button>

                                <!-- Nếu đã trả lời (showAnswer = true hoặc isCurrentQuestionAnswered), hiển thị nút tiếp theo -->
                                <button
                                    v-if="showAnswer || isCurrentQuestionAnswered"
                                    @click="nextQuestion"
                                    class="btn btn-success btn-lg px-5"
                                >
                                    <span>{{
                                        currentQuestionIndex < questions.length - 1 ? $t('next_question') : $t('complete') }}</span>
                                    <svg
                                        width="20"
                                        height="20"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        class="ms-2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <!-- Answer Result -->
                            <div
                                v-if="showAnswer"
                                id="practice-result-section"
                                class="mt-4 rounded border shadow-sm"
                                :class="{
                                    'bg-info bg-opacity-10 border-info':
                                        isCurrentAnswerCorrect,
                                    'bg-warning bg-opacity-10 border-danger':
                                        !isCurrentAnswerCorrect,
                                }"
                            >
                                <!-- Result Header -->
                                <div class="p-3 border-bottom bg-white bg-opacity-50">
                                    <div class="d-flex align-items-center gap-3">
                                        <div
                                            class="rounded d-flex align-items-center justify-content-center flex-shrink-0"
                                            style="width: 50px; height: 50px;"
                                            :class="{
                                                'bg-success': isCurrentAnswerCorrect,
                                                'bg-danger': !isCurrentAnswerCorrect,
                                            }"
                                        >
                                            <svg
                                                v-if="isCurrentAnswerCorrect"
                                                width="24"
                                                height="24"
                                                class="text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <svg
                                                v-else
                                                width="24"
                                                height="24"
                                                class="text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </div>
                                        <div class="flex-grow-1">
                                            <h5
                                                class="mb-1 fw-bold"
                                                :class="{
                                                    'text-success': isCurrentAnswerCorrect,
                                                    'text-danger': !isCurrentAnswerCorrect,
                                                }"
                                            >
                                                {{
                                                    isCurrentAnswerCorrect
                                                        ? $t('correct')
                                                        : $t('incorrect')
                                                }}
                                            </h5>
                                            <p
                                                class="mb-0 small"
                                                :class="{
                                                    'text-success':
                                                        isCurrentAnswerCorrect,
                                                    'text-danger':
                                                        !isCurrentAnswerCorrect,
                                                }"
                                            >
                                                {{ $t('correct_answer') }}: <span class="badge bg-success fs-6 fw-bold ms-auto">
                                                    {{ correctLettersDisplay }}
                                            </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Correct Answer & Explanation -->
                                <div class="p-3">
                                    <!-- Explanation -->
                                    <div id="practice-explanation-section" class="card mb-3 border">                        
                                        <div class="card-body">
                                            <div class="d-flex align-items-center justify-content-between mb-3">
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                                                        <svg
                                                            width="16"
                                                            height="16"
                                                            class="text-primary"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                stroke-width="2"
                                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <span class="fw-bold">{{ $t('detailed_explanation') }}</span>
                                                </div>
                                                <!-- Inline Line Length Control -->
                                                <BasicLineControl />
                                            </div>
                                            <div
                                                class="text-dark small prose"
                                                v-html="processedCurrentQuestion?.explanation"
                                            ></div>
                                            
                                            <!-- Translation Toggle -->
                                            <TranslationToggle 
                                                v-if="processedCurrentQuestion?.vietnamese_translation"
                                                :translation="processedCurrentQuestion.vietnamese_translation"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Result Modal -->
            <div
                v-if="showResult"
                class="modal fade show d-block"
                style="background-color: rgba(0, 0, 0, 0.6);"
                tabindex="-1"
            >
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0 shadow-lg">
                        <!-- Modal Header -->
                        <div class="modal-header bg-gradient-primary text-white border-0 py-5">
                            <div class="w-100 text-center">
                                <div class="display-1 mb-4">
                                    {{ getResultEmoji }}
                                </div>
                                <h3 class="modal-title fw-bold text-warning mb-2">
                                    {{ $t('complete_chapter') }}!
                                </h3>
                                <p class="mb-0 text-white">{{ $t('you_have_completed_the_chapter') }} {{ category.title }}</p>
                            </div>
                        </div>

                        <!-- Modal Content -->
                        <div class="modal-body p-5">
                            <!-- Score Display -->
                            <div class="card bg-primary bg-opacity-10 border-primary mb-4">
                                <div class="card-body text-center py-5">
                                    <div class="text-white small mb-2 fw-medium">
                                        {{ $t('your_result') }}
                                    </div>
                                    <div class="display-3 fw-bold text-warning mb-3">
                                        {{ score }} / {{ questions.length }}
                                    </div>
                                    <div class="d-inline-flex align-items-center gap-2 bg-white rounded-pill px-4 py-2 shadow-sm">
                                        <svg
                                            width="20"
                                            height="20"
                                            class="text-warning"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                            />
                                        </svg>
                                        <span class="fw-bold text-dark"
                                            >{{ $t('correct_percentage') }}: {{ percentage }}%</span
                                        >
                                    </div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="d-grid gap-3">
                                <button
                                    @click="restartPractice"
                                    class="btn btn-primary btn-lg"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        class="me-2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    {{ $t('restart_chapter') }}
                                </button>
                                <router-link
                                    :to="resolve_route_name('documents.show', { documentSlug: category.document.slug })"
                                    class="btn btn-secondary btn-lg"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        class="me-2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                        />
                                    </svg>
                                    {{ $t('chapter_list') }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            <!-- No Data State -->
            <div v-else class="alert alert-warning">
                <h5>{{ $t('no_data') || 'No data available' }}</h5>
                <p>{{ $t('no_questions_found') || 'No questions found for this category' }}</p>
            </div>
        </AppLayout>
    </div>
</template>

<script setup>
import PageTitle from '@/components/PageTitle.vue';
import { resolve_route_name } from '@/utils/route-helper.js';
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { useRoute, useRouter } from 'vue-router';
import AppLayout from "@/layouts/AppLayout.vue";
import BasicLineControl from "@/components/Shared/BasicLineControl.vue";
import { debouncedHighlightCodeBlocks, processContentForHighlight } from "@/utils/highlight.js";
import FormattedText from "@/components/Shared/FormattedText.vue";
import TranslationToggle from "@/components/Shared/TranslationToggle.vue";
import { useProgressSync } from "@/composables/useProgressSync.js";
import { http } from '@/api/http-client.js';
import { useAuthStore } from '@/stores/auth';

// Get route params
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Data from API
const category = ref(null);
const questions = ref([]);
const progress = ref(null);
const loading = ref(true);
const error = ref(null);

// Fetch data from API
const fetchPracticeData = async () => {
    try {
        loading.value = true;
        error.value = null;
        
        const categoryId = route.params.categoryId;
        const isRestart = window.location.search.includes('restart=1');
        
        const url = `/api/documents/category/${categoryId}/practice${isRestart ? '?restart=1' : ''}`;
        const response = await http.get(url);
        
        if (response.data.success) {
            category.value = response.data.data.category;
            questions.value = response.data.data.questions;
            progress.value = response.data.data.progress;
        } else {
            error.value = 'Failed to load practice data';
        }
    } catch (err) {
        console.error('Error fetching practice data:', err);
        error.value = err.message || 'Failed to load practice data';
    } finally {
        loading.value = false;
    }
};

// Fetch data on mount
onMounted(() => {
    fetchPracticeData();
});

const currentUser = computed(() => authStore.user || null);

// Tạo unique identifier cho localStorage (tránh conflict giữa users)
const getUserIdentifier = () => {
    // Nếu có user, dùng user_id
    if (currentUser.value?.id) {
        return `user_${currentUser.value.id}`;
    }
    
    // Nếu guest, dùng session_id từ cookie hoặc tạo mới
    let session_id = localStorage.getItem('category_session_id');
    if (!session_id) {
        session_id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('category_session_id', session_id);
    }
    return session_id;
};

const user_identifier = getUserIdentifier();

// Progress Sync - wait for category to load
const saveProgress = ref(null);
const startAutoSave = ref(null);
const isSaving = ref(false);
const lastSaveTime = ref(null);

// Initialize progress sync when category is loaded
watch(category, (newCategory) => {
    if (newCategory) {
        const progressSync = useProgressSync(newCategory.id);
        saveProgress.value = progressSync.saveProgress;
        startAutoSave.value = progressSync.startAutoSave;
        isSaving.value = progressSync.isSaving;
        lastSaveTime.value = progressSync.lastSaveTime;
    }
});

const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const currentQuestionIndex = ref(0);
const showAnswer = ref(false);
const selected = ref([]);
const correctCount = ref(0);
const answeredCount = ref(0);
const showResult = ref(false);
const questionsAnswered = ref([]); // Track câu hỏi đã trả lời

// LocalStorage functions
const getLocalStorageKey = () => {
    return `category_progress_${user_identifier}_${category.value?.id || 'unknown'}`;
};

const saveProgressToLocalStorage = () => {
    const progress_data = {
        current_question_index: currentQuestionIndex.value,
        correct_count: correctCount.value,
        answered_count: answeredCount.value,
        questions_answered: questionsAnswered.value,
        selected: selected.value,
        show_answer: showAnswer.value,
        timestamp: new Date().toISOString()
    };
    
    try {
        localStorage.setItem(getLocalStorageKey(), JSON.stringify(progress_data));
    } catch (error) {
        console.error('Error saving progress to localStorage:', error);
    }
};

const loadProgressFromLocalStorage = () => {
    try {
        const saved = localStorage.getItem(getLocalStorageKey());
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Error loading progress from localStorage:', error);
        return null;
    }
};

const clearProgressFromLocalStorage = () => {
    try {
        localStorage.removeItem(getLocalStorageKey());
    } catch (error) {
        console.error('Error clearing progress from localStorage:', error);
    }
};

// Tự động load progress từ localStorage khi vào trang (không cần modal)
const is_restart = window.location.search.includes('restart=1');

// Watch progress data and restore when loaded
watch([progress, loading], ([newProgress, isLoading]) => {
    if (!isLoading && !is_restart) {
        // Ưu tiên localStorage trước, sau đó mới đến server progress
        const local_progress = loadProgressFromLocalStorage();
        const progress_to_restore = local_progress || newProgress;
    
    if (progress_to_restore) {
        currentQuestionIndex.value = progress_to_restore.current_question_index || progress_to_restore.last_question_index || 0;
        correctCount.value = progress_to_restore.correct_count || 0;
        answeredCount.value = progress_to_restore.answered_count || 0;
        questionsAnswered.value = progress_to_restore.questions_answered || [];
        
        // Restore selected và showAnswer từ localStorage
        if (local_progress) {
            selected.value = progress_to_restore.selected || [];
            showAnswer.value = progress_to_restore.show_answer || false;
        }
        
            // Nếu câu hiện tại đã được trả lời (khi refresh), tự động hiển thị đáp án
            if (questionsAnswered.value.includes(currentQuestionIndex.value)) {
                showAnswer.value = true;
            }
        }
    }
});

const currentQuestion = computed(
    () => questions.value[currentQuestionIndex.value] || null
);

// Process current question content
const processedCurrentQuestion = computed(() => {
    if (!currentQuestion.value) return null;
    return {
        ...currentQuestion.value,
        content: processContentForHighlight(currentQuestion.value.content),
        explanation: processContentForHighlight(currentQuestion.value.explanation)
    };
});

const score = computed(() => correctCount.value);

const percentage = computed(() =>
    questions.value.length
        ? Math.round((score.value / questions.value.length) * 100)
        : 0
);

const getResultEmoji = computed(() => {
    const percent = percentage.value;
    if (percent >= 90) return "🏆";
    if (percent >= 70) return "🎉";
    if (percent >= 50) return "👍";
    return "💪";
});

const isCurrentAnswerCorrect = computed(() => {
    const correctIds =
        currentQuestion.value?.choices
            ?.filter((c) => c.is_correct)
            .map((c) => String(c.id)) || [];
    const selectedIds = selected.value.map(String);
    return (
        correctIds.length === selectedIds.length &&
        correctIds.every((id) => selectedIds.includes(id))
    );
});

const correctLettersDisplay = computed(() => {
    const correctIds =
        currentQuestion.value?.choices
            ?.filter((c) => c.is_correct)
            .map((c) => c.id) || [];
    return correctIds
        .map((id) => {
            const idx = currentQuestion.value.choices.findIndex(
                (c) => String(c.id) === String(id)
            );
            return letters[idx];
        })
        .join(" , ");
});

function isChoiceCorrect(id) {
    return currentQuestion.value?.choices?.some(
        (c) => c.is_correct && String(c.id) === String(id)
    );
}

// Computed để check câu hiện tại đã trả lời chưa
const isCurrentQuestionAnswered = computed(() => {
    return questionsAnswered.value.includes(currentQuestionIndex.value);
});

function toggleChoice(id) {
    // Không cho chọn nếu đã hiển thị đáp án HOẶC câu này đã trả lời rồi
    if (showAnswer.value || isCurrentQuestionAnswered.value) return;
    const i = selected.value.indexOf(id);
    if (i >= 0) selected.value.splice(i, 1);
    else selected.value.push(id);
}

function submitAnswer() {
    if (selected.value.length === 0) return;
    
    // Chỉ tăng answered_count nếu câu này chưa được trả lời
    if (!questionsAnswered.value.includes(currentQuestionIndex.value)) {
        questionsAnswered.value.push(currentQuestionIndex.value);
        answeredCount.value++;
        if (isCurrentAnswerCorrect.value) correctCount.value++;
        
        // Only save to server when user actually makes progress
        saveProgressData();
    }
    
    showAnswer.value = true;
    
    // Lưu progress vào localStorage ngay lập tức
    saveProgressToLocalStorage();
    
    // Scroll xuống phần kết quả sau khi hiển thị đáp án
    nextTick(() => {
        scrollToResult();
    });
}

// Function để scroll xuống phần kết quả
function scrollToResult() {
    const resultSection = document.getElementById('practice-result-section');
    if (resultSection) {
        // Scroll với offset để không bị che bởi header
        const offset = 100;
        const elementPosition = resultSection.offsetTop - offset;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Function để scroll lên top khi chuyển câu
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function nextQuestion() {
    if (currentQuestionIndex.value < questions.value.length - 1) {
        // Scroll to top with smooth animation
        scrollToTop();
        
        currentQuestionIndex.value++;
        selected.value = [];
        showAnswer.value = false;
        
        // Nếu câu tiếp theo đã được trả lời, restore trạng thái
        if (questionsAnswered.value.includes(currentQuestionIndex.value)) {
            showAnswer.value = true;
        }
        
        // Lưu progress vào localStorage
        saveProgressToLocalStorage();
    } else {
        // Hoàn thành chương
        showResult.value = true;
        // Clear localStorage khi hoàn thành
        clearProgressFromLocalStorage();
        saveProgressData(true); // Mark as completed on server
    }
}

// Get progress data for SessionWarning component
const getProgressData = () => {
    return {
        total_questions: questions.value.length,
        answered_questions: answeredCount.value,
        correct_answers: correctCount.value,
        last_question_index: currentQuestionIndex.value,
        completed: showResult.value,
        time_spent_seconds: 0, // TODO: implement timer if needed
    };
};

// Session management is now handled silently in the background

function saveProgressData(completed = false) {
    const progressData = {
        total_questions: questions.value.length,
        answered_questions: answeredCount.value,
        correct_answers: correctCount.value,
        last_question_index: currentQuestionIndex.value,
        completed: completed,
        time_spent_seconds: 0, // TODO: implement timer if needed
    };
    
    // Save to localStorage first
    saveProgressToLocalStorage();
    
    // Then save to server (from useProgressSync)
    if (saveProgress.value) {
        saveProgress.value(progressData);
    }
}

function restartPractice() {
    // Clear localStorage khi restart
    clearProgressFromLocalStorage();
    if (category.value) {
        router.push({ 
            name: 'documents.category.practice', 
            params: { categoryId: category.value.id },
            query: { restart: '1' }
        });
    }
}

// Highlight code blocks using debounced utility function
const highlightCodeBlocks = () => {
    debouncedHighlightCodeBlocks(document, nextTick, 150);
};

// Event listeners để lưu progress khi thoát trang
let before_unload_handler = null;
let visibility_change_handler = null;

onMounted(async () => {
    highlightCodeBlocks();
    
    // No auto-save - only save when user actually makes progress
    // This reduces unnecessary server requests and improves performance
    
    // Setup event listeners để save progress khi cần thiết
    before_unload_handler = () => {
        if (!showResult.value) {
            saveProgressToLocalStorage();
            // Only save to server if there are actual changes
            const progressData = getProgressData();
            if (progressData.answered_questions > 0 || progressData.correct_answers > 0) {
                if (saveProgress.value) {
                    saveProgress.value(progressData);
                }
            }
        }
    };
    
    visibility_change_handler = () => {
        if (document.hidden && !showResult.value) {
            saveProgressToLocalStorage();
            // Only save to server if there are actual changes
            const progressData = getProgressData();
            if (progressData.answered_questions > 0 || progressData.correct_answers > 0) {
                if (saveProgress.value) {
                    saveProgress.value(progressData);
                }
            }
        }
    };
    
    window.addEventListener('beforeunload', before_unload_handler);
    document.addEventListener('visibilitychange', visibility_change_handler);
});

onBeforeUnmount(() => {
    // Save progress trước khi component bị destroy
    if (!showResult.value) {
        saveProgressToLocalStorage();
    }
    
    // Cleanup event listeners
    if (before_unload_handler) {
        window.removeEventListener('beforeunload', before_unload_handler);
    }
    
    if (visibility_change_handler) {
        document.removeEventListener('visibilitychange', visibility_change_handler);
    }
});

watch(
    currentQuestion,
    (newCurrent) => {
        if (!newCurrent) return;
        highlightCodeBlocks();
    },
    { immediate: true }
);
</script>


<style scoped>
.practice-header-fixed {
    position: sticky;
    top: 0;
    z-index: 1000;
    background-color: white;
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    margin-bottom: 1rem !important;
}
.cursor-pointer {
    cursor: pointer;
}

.transition-all {
    transition: all 0.3s ease;
}

.choice-letter {
    width: 32px;
    height: 32px;
    font-weight: 600;
    font-size: 0.9rem;
    border: 2px solid #e9ecef;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.choice-letter.bg-light {
    border: 2px solid #dee2e6;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.choice-letter.bg-info {
    border: 2px solid #0dcaf0;
    box-shadow: 0 3px 8px rgba(13, 202, 240, 0.3);
}

.choice-letter.bg-success {
    border: 2px solid #198754;
    box-shadow: 0 3px 8px rgba(25, 135, 84, 0.3);
}

.choice-letter.bg-warning {
    border: 2px solid #ffc107;
    box-shadow: 0 3px 8px rgba(255, 193, 7, 0.3);
}

.prose pre {
    background-color: #1e1e1e;
    color: #f8f8f2;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 1rem;
    overflow-x: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.prose pre code {
    background: transparent;
    color: inherit;
    font-family: "Fira Code", monospace;
    font-size: 0.9rem;
    line-height: 1.5;
}

.hljs-ln-numbers {
    text-align: right;
    color: #888;
    border-right: 1px solid #444;
    padding-right: 10px;
    user-select: none;
    width: 3rem;
}

.hljs-ln-code {
    padding-left: 10px;
}

.prose pre::-webkit-scrollbar {
    height: 8px;
}

.prose pre::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
}

.prose pre::-webkit-scrollbar-thumb:hover {
    background: #777;
}

.prose pre code .hljs-keyword {
    color: #4fc3f7;
    font-weight: 600;
}

.prose pre code .hljs-string {
    color: #a5d6a7;
}

.prose pre code .hljs-comment {
    color: #9ca3af;
    font-style: italic;
}

.prose pre code .hljs-number {
    color: #fbbf24;
}

.prose pre code .hljs-class {
    color: #c084fc;
    font-weight: 600;
}

.prose pre code .hljs-function {
    color: #f87171;
}

.prose pre code .hljs-variable {
    color: #f8f8f2;
}

.prose {
    max-width: var(--explanation-line-length, 80ch);
    line-height: var(--explanation-line-height, 1.6);
}

.prose p {
    margin: 0.5rem 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

/* Đặc biệt cho phần giải thích */
#practice-explanation-section .prose {
    max-width: var(--explanation-line-length, 60ch);
    font-size: var(--explanation-font-size, 0.95rem);
    line-height: var(--explanation-line-height, 1.7);
}

/* Responsive cho mobile */
@media (max-width: 768px) {
    .prose {
        max-width: var(--mobile-line-length, 50ch);
    }
    
    #practice-explanation-section .prose {
        max-width: var(--mobile-line-length, 45ch);
    }
}

/* Practice Question Transition Effects */
.practice-question-card {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(0);
    opacity: 1;
}

.practice-question-card.question-enter {
    transform: translateY(20px);
    opacity: 0;
}

.practice-question-card.question-enter-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.practice-question-card.question-leave {
    transform: translateY(0);
    opacity: 1;
}

.practice-question-card.question-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(-20px);
    opacity: 0;
}

/* Choice options transition */
.choice-option {
    transition: all 0.2s ease-in-out;
}

.choice-option:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

/* Smooth scroll behavior */
html {
    scroll-behavior: smooth;
}
</style>

