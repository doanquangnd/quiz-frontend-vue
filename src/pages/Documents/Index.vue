<template>
  <AppLayout breadcrumb="Documents">
    <!-- Page Header -->
    <div class="mb-4">
      <h1 class="h3 fw-bold text-dark mb-2">{{ $t('documents') }}</h1>
      <p class="text-muted mb-0">{{ $t('learning_system_from_basic_to_advanced') }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row g-4">
      <div v-for="i in 6" :key="i" class="col-md-6 col-lg-4">
        <div class="card border-0 shadow-soft h-100">
          <div class="card-body p-4">
            <div class="skeleton skeleton-circle mb-3" style="width: 48px; height: 48px;"></div>
            <div class="skeleton skeleton-text mb-2"></div>
            <div class="skeleton skeleton-text" style="width: 70%;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Documents Grid -->
    <div v-else-if="documents.length > 0" class="row g-4">
      <div v-for="document in documents" :key="document.id" class="col-md-6 col-lg-4">
        <DocumentCard :document="document" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card border-0 shadow-soft">
      <div class="card-body p-5 text-center">
        <div class="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style="width: 80px; height: 80px;">
          <i class="ni ni-books-2 text-muted fs-3"></i>
        </div>
        <h3 class="h5 fw-bold text-dark mb-2">{{ $t('no_documents_yet') }}</h3>
        <p class="text-muted mb-0">{{ $t('check_back_later_for_new_content') }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="alert alert-danger">
      <strong>Lỗi:</strong> {{ error }}
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import DocumentCard from '@/components/Cards/DocumentCard.vue'
import { DocumentService } from '@/services/document-service.js'
import { useToastStore } from '@/stores/toast.js'
import { useSeo, SEO_CONFIGS } from '@/composables/useSeo.js'
import { SEO_CONFIGS_EN } from '@/composables/useSeo.en.js'
import { SEO_CONFIGS_JA } from '@/composables/useSeo.ja.js'
import { useTranslation } from '@/composables/useTranslation'

// State
const documents = ref([])
const loading = ref(true)
const error = ref(null)
const toast = useToastStore()
const { locale } = useTranslation()

// SEO Setup - Documents require login, use noindex
const init_seo = () => {
  let configs
  if (locale.value === 'en') {
    configs = SEO_CONFIGS_EN
  } else if (locale.value === 'ja') {
    configs = SEO_CONFIGS_JA
  } else {
    configs = SEO_CONFIGS
  }
  useSeo({
    ...configs.documents,
    robots: 'noindex, nofollow',
  })
}
init_seo()

// Fetch documents
const fetch_documents = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await DocumentService.get_all()
    
    if (response.success) {
      documents.value = response.data
    } else {
      throw new Error(response.message || 'Failed to load documents')
    }
  } catch (err) {
    console.error('Error loading documents:', err)
    error.value = err.response?.data?.message || err.message || 'Không thể tải tài liệu'
    toast.error('Không thể tải danh sách tài liệu')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetch_documents()
})
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
}

.skeleton-circle {
  border-radius: 50%;
}

.skeleton-text {
  height: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
