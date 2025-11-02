<template>
  <AppLayout :breadcrumb="`Documents / ${document?.title || 'Loading...'}`">
    <!-- Loading State -->
    <div v-if="loading" class="card border-0 shadow-soft">
      <div class="card-body p-4">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- Document Header -->
    <div v-else-if="document" class="content-wrapper">
    <div class="card border-0 shadow-soft mb-4">
      <div class="card-body p-4">
        <div class="d-flex align-items-start">
          <div class="bg-gradient-primary rounded-3 d-flex align-items-center justify-content-center me-3 flex-shrink-0" style="width: 56px; height: 56px;">
            <i class="ni ni-books-2 text-white fs-4"></i>
          </div>
          <div class="flex-grow-1">
            <h1 class="h3 fw-bold text-dark mb-2">{{ document.title }}</h1>
            <p v-if="document.description" class="text-muted mb-0">{{ document.description }}</p>
          </div>
          <div class="badge bg-primary bg-gradient-primary px-3 py-2">
            {{ document.categories.length }} {{ $t('chapters') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Categories List -->
    <div class="row g-3">
      <div
        v-for="(category, index) in document.categories"
        :key="category.id"
        class="col-12 category-item"
      >
        <div class="card border-0 shadow-soft h-100">
          <div class="card-body p-4">
            <div class="d-flex flex-lg-row align-items-start align-items-lg-center gap-3">
              <!-- Chapter Number -->
              <div class="flex-shrink-0">
                <div 
                  class="rounded-3 d-flex align-items-center justify-content-center" 
                  :class="{
                    'bg-success': category.progress?.status === 'completed',
                    'bg-warning': category.progress?.status === 'in_progress',
                    'bg-light': !category.progress || category.progress?.status !== 'completed' && category.progress?.status !== 'in_progress'
                  }"
                  style="width: 48px; height: 48px;"
                >
                  <span 
                    class="fw-bold"
                    :class="{
                      'text-white': category.progress?.status === 'completed' || category.progress?.status === 'in_progress',
                      'text-primary': !category.progress || category.progress?.status !== 'completed' && category.progress?.status !== 'in_progress'
                    }"
                  >{{ index + 1 }}</span>
                </div>
              </div>
              
              <!-- Content Section -->
              <div class="flex-grow-1 min-width-0 w-100">
                <!-- Title and Badge -->
                <div class="d-flex align-items-center flex-wrap gap-2 mb-1">
                  <h5 class="fw-bold text-dark mb-0">{{ category.title }}</h5>
                  <span v-if="category.progress?.status === 'completed'" class="badge bg-success">
                    {{ $t('completed') }}
                  </span>
                  <span v-else-if="category.progress?.status === 'in_progress'" class="badge bg-primary">
                    {{ $t('in_progress') }}
                  </span>
                </div>
                
                <!-- Description -->
                <p v-if="category.description" class="text-muted small mb-2">
                  {{ category.description }}
                </p>
                
                <!-- Progress Bar, Score, và Button trong cùng một hàng -->
                <div class="mt-2">
                  <div class="d-flex flex-column flex-md-row align-items-md-center gap-2">
                    <!-- Progress Bar Section -->
                    <div class="flex-grow-1 d-flex align-items-center gap-2">
                      <div v-if="category.progress" class="progress flex-grow-1" style="height: 8px;">
                        <div
                          class="progress-bar"
                          :class="{
                            'bg-success': category.progress.status === 'completed',
                            'bg-primary': category.progress.status === 'in_progress'
                          }"
                          role="progressbar"
                          :style="{ width: (category.progress.answered_count / category.questions_count * 100) + '%' }"
                          :aria-valuenow="category.progress.answered_count"
                          :aria-valuemin="0"
                          :aria-valuemax="category.questions_count"
                        ></div>
                      </div>
                      <span v-if="category.progress" class="text-muted small fw-medium text-nowrap" style="min-width: 60px;">
                        {{ category.progress.answered_count }}/{{ category.questions_count }}
                      </span>
                    </div>
                    
                    <!-- Score Badge -->
                    <div v-if="category.progress?.status === 'completed'" class="flex-shrink-0">
                      <span class="badge bg-light text-dark small text-nowrap">
                        <i class="ni ni-check-bold text-success me-1"></i>
                        {{ $t('score') }}: {{ category.progress.correct_count }}/{{ category.progress.answered_count }}
                      </span>
                    </div>
                    
                    <!-- No Progress - Show Question Count -->
                    <div v-if="!category.progress" class="flex-shrink-0">
                      <span class="badge bg-light text-dark">
                        <i class="ni ni-book-bookmark me-1"></i>
                        {{ category.questions_count }} {{ $t('questions') }}
                      </span>
                    </div>
                    
                    <!-- Action Button -->
                    <div class="flex-shrink-0">
                      <button
                        v-if="category.progress?.status === 'completed'"
                        @click="showRestartModal(category)"
                        class="btn btn-sm btn-outline-success text-nowrap"
                      >
                        <i class="ni ni-refresh-69 me-1"></i>
                        {{ $t('restart') }}
                      </button>
                      <router-link
                        v-else
                        :to="`/documents/category/${category.id}/practice`"
                        class="btn btn-sm btn-primary text-nowrap"
                      >
                        <i class="ni ni-bold-right me-1"></i>
                        {{ category.progress?.status === 'in_progress' ? $t('continue') : $t('start') }}
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Restart Confirmation Modal -->
    <div
      v-if="showRestartConfirmModal"
      class="modal fade show d-block"
      style="background-color: rgba(0, 0, 0, 0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <!-- Modal Header -->
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">
              <i class="ni ni-refresh-69 text-warning me-2"></i>
              {{ $t('confirm_restart') }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeRestartModal"
            ></button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <div class="alert alert-warning mb-3">
              <i class="ni ni-bell-55 me-2"></i>
              <strong>{{ $t('warning') }}:</strong> {{ $t('restart_warning_message') }}
            </div>
            
            <p class="mb-2 text-dark">
              <strong>{{ $t('chapter') }}:</strong> {{ selectedCategory?.title }}
            </p>
            <p class="mb-2 text-dark">
              <strong>{{ $t('previous_score') }}:</strong> 
              {{ selectedCategory?.progress?.correct_count }}/{{ selectedCategory?.progress?.answered_count }}
              ({{ Math.round((selectedCategory?.progress?.correct_count / selectedCategory?.progress?.answered_count) * 100) }}%)
            </p>
            <p class="text-muted small mb-0">
              {{ $t('restart_explanation') }}
            </p>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer border-0 pt-0">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeRestartModal"
            >
              <i class="ni ni-fat-remove me-1"></i>
              {{ $t('cancel') }}
            </button>
            <button
              type="button"
              class="btn btn-warning"
              @click="confirmRestart"
            >
              <i class="ni ni-refresh-69 me-1"></i>
              {{ $t('confirm_restart_button') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resolve_route_name } from '@/utils/route-helper.js'
import AppLayout from '@/layouts/AppLayout.vue'
import { DocumentService } from '@/services/document-service.js'
import { useToastStore } from '@/stores/toast.js'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

// State
const document = ref(null)
const loading = ref(true)
const error = ref(null)

// Fetch document
const fetch_document = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await DocumentService.get_by_slug(route.params.documentSlug)
    
    if (response.success) {
      document.value = response.data
    } else {
      throw new Error(response.message || 'Document not found')
    }
  } catch (err) {
    console.error('Error loading document:', err)
    error.value = err.response?.data?.message || err.message
    toast.error('Không thể tải tài liệu')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetch_document()
})

// State cho restart modal
const showRestartConfirmModal = ref(false)
const selectedCategory = ref(null)

// Function để hiển thị modal xác nhận restart
function showRestartModal(category) {
  selectedCategory.value = category
  showRestartConfirmModal.value = true
}

// Function để đóng modal
function closeRestartModal() {
  showRestartConfirmModal.value = false
  selectedCategory.value = null
}

// Function để xác nhận restart
function confirmRestart() {
  if (selectedCategory.value) {
    // Chuyển đến trang practice với ?restart=1
    router.push({ 
      name: 'documents.category.practice', 
      params: { categoryId: selectedCategory.value.id },
      query: { restart: '1' }
    })
  }
  closeRestartModal()
}
</script>

<style scoped>
.card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15) !important;
}

.modal.show {
  display: block;
}

.category-item .card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15) !important;
}

/* Đảm bảo progress bar luôn có chiều rộng đồng nhất */
.progress {
  width: 100%;
  min-width: 100px; /* Đảm bảo có chiều rộng tối thiểu */
}

/* Ngăn chặn text overflow */
.min-width-0 {
  min-width: 0;
}

/* Đảm bảo button và badge không bị shrink */
.flex-shrink-0 {
  flex-shrink: 0;
}

/* Đảm bảo các badge và text không bị wrap */
.text-nowrap {
  white-space: nowrap;
}

/* Căn chỉnh progress bar container */
.flex-grow-1 {
  flex-grow: 1;
  min-width: 0; /* Quan trọng cho flexbox */
}

/* Responsive cho tablet và mobile */
@media (max-width: 767.98px) {
  .category-item .card-body {
    padding: 1rem !important;
  }
  
  /* Trên mobile, button full width */
  .category-item .flex-shrink-0 .btn {
    width: 100%;
    justify-content: center;
  }
  
  /* Progress bar section chiếm full width trên mobile */
  .category-item .flex-grow-1.d-flex {
    width: 100%;
  }
}

/* Đảm bảo layout đồng nhất trên tất cả các item */
.category-item .d-flex.flex-column.flex-md-row {
  min-height: 40px; /* Chiều cao tối thiểu để đồng nhất */
}

/* Căn chỉnh các phần tử trong hàng progress */
.category-item .d-flex.align-items-center {
  align-items: center !important;
}
</style>
