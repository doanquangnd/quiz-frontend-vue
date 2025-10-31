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
        class="col-12"
      >
        <div class="card border-0 shadow-soft h-100">
          <div class="card-body p-4">
            <div class="row align-items-center">
              <div class="col-auto">
                <div 
                  class="rounded-3 d-flex align-items-center justify-content-center" 
                  :class="{
                    'bg-success': category.progress?.status === 'completed',
                    'bg-light': !category.progress || category.progress?.status !== 'completed'
                  }"
                  style="width: 48px; height: 48px;"
                >
                  <span 
                    class="fw-bold"
                    :class="{
                      'text-white': category.progress?.status === 'completed',
                      'text-primary': !category.progress || category.progress?.status !== 'completed'
                    }"
                  >{{ index + 1 }}</span>
                </div>
              </div>
              <div class="col">
                <div class="d-flex align-items-center gap-2">
                  <h5 class="fw-bold text-dark mb-1">{{ category.title }}</h5>
                  <!-- Badge hiển thị trạng thái hoàn thành -->
                  <span v-if="category.progress?.status === 'completed'" class="badge bg-success">
                    {{ $t('completed') }}
                  </span>
                  <span v-else-if="category.progress?.status === 'in_progress'" class="badge bg-primary">
                    {{ $t('in_progress') }}
                  </span>
                </div>
                <p v-if="category.description" class="text-muted small mb-0 text-truncate">
                  {{ category.description }}
                </p>
                <!-- Hiển thị tiến độ nếu có -->
                <div v-if="category.progress" class="mt-2">
                  <div class="d-flex align-items-center gap-2">
                    <div class="progress flex-grow-1" style="height: 8px;">
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
                    <span class="text-muted small fw-medium" style="min-width: 60px;">
                      {{ category.progress.answered_count }}/{{ category.questions_count }}
                    </span>
                  </div>
                  <!-- Hiển thị điểm nếu đã hoàn thành -->
                  <div v-if="category.progress.status === 'completed'" class="mt-1">
                    <span class="badge bg-light text-dark small">
                      <i class="ni ni-check-bold text-success me-1"></i>
                      {{ $t('score') }}: {{ category.progress.correct_count }}/{{ category.progress.answered_count }}
                    </span>
                  </div>
                </div>
                <!-- Hiển thị tổng số câu nếu chưa có tiến độ -->
                <div v-else class="mt-2">
                  <span class="badge bg-light text-dark">
                    <i class="ni ni-book-bookmark me-1"></i>
                    {{ category.questions_count }} {{ $t('questions') }}
                  </span>
                </div>
              </div>
              <div class="col-auto">
                <!-- Nút hành động tùy trạng thái -->
                <div v-if="category.progress?.status === 'completed'">
                  <!-- Nút Làm lại cho chương đã hoàn thành -->
                  <button
                    @click="showRestartModal(category)"
                    class="btn btn-sm btn-outline-success"
                  >
                    <i class="ni ni-refresh-69 me-1"></i>
                    {{ $t('restart') }}
                  </button>
                </div>
                <div v-else>
                  <!-- Nút Tiếp tục hoặc Bắt đầu -->
                  <router-link
                    :to="`/documents/category/${category.id}/practice`"
                    class="btn btn-sm btn-primary"
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
            
            <p class="mb-2">
              <strong>{{ $t('chapter') }}:</strong> {{ selectedCategory?.title }}
            </p>
            <p class="mb-2">
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
</style>
