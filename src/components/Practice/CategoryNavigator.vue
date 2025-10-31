<template>
    <div class="category-navigator card border-0 shadow-sm mb-4">
        <div class="card-body py-3">
            <div class="d-flex justify-content-between align-items-center">
                <!-- Previous Category -->
                <router-link
                    v-if="previousCategory"
                    :to="resolve_route_name('documents.category.practice', { categoryId: previousCategory.id })"
                    class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    <span class="d-none d-md-inline">{{ previousCategory.title }}</span>
                    <span class="d-md-none">{{ $t('previous') }}</span>
                </router-link>
                <div v-else class="invisible">
                    <button class="btn btn-outline-secondary btn-sm">{{ $t('placeholder') }}</button>
                </div>

                <!-- Current Position -->
                <div class="text-center">
                    <div class="badge bg-primary fs-6">
                        {{ $t('chapter') }} {{ currentCategoryOrder }} / {{ totalCategories }}
                    </div>
                </div>

                <!-- Next Category -->
                <router-link
                    v-if="nextCategory"
                    :to="resolve_route_name('documents.category.practice', { categoryId: nextCategory.id })"
                    class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                >
                    <span class="d-none d-md-inline">{{ nextCategory.title }}</span>
                    <span class="d-md-none">{{ $t('next') }}</span>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </router-link>
                <div v-else class="invisible">
                    <button class="btn btn-outline-secondary btn-sm">{{ $t('placeholder') }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { resolve_route_name } from '@/utils/route-helper.js';

const props = defineProps({
    currentCategory: {
        type: Object,
        required: true
    },
    previousCategory: {
        type: Object,
        default: null
    },
    nextCategory: {
        type: Object,
        default: null
    },
    currentCategoryOrder: {
        type: Number,
        required: true
    },
    totalCategories: {
        type: Number,
        required: true
    }
});
</script>

<style scoped>
.category-navigator {
    transition: box-shadow 0.3s ease;
}

.category-navigator:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}
</style>

