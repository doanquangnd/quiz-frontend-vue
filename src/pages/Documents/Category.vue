<template>
  <div>
    <PageTitle :title="category?.title" />
    <AppLayout :breadcrumb="category && category.document ? `${category.document.title} / ${category.title}` : 'Category'">
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

    <!-- Category Content -->
    <div v-else-if="category">
    <!-- Category Header -->
    <div class="card border-0 shadow-soft mb-4">
      <div class="card-body p-4">
        <div class="d-flex align-items-start">
          <div class="bg-gradient-success rounded-3 d-flex align-items-center justify-content-center me-3 flex-shrink-0" style="width: 56px; height: 56px;">
            <i class="ni ni-collection text-white fs-4"></i>
          </div>
          <div class="flex-grow-1">
            <nav aria-label="breadcrumb" class="mb-2">
              <ol class="breadcrumb mb-0 small">
                <li class="breadcrumb-item">
                  <router-link :to="resolve_route_name('documents.index')" class="text-decoration-none">{{ $t('documents') }}</router-link>
                </li>
                <li class="breadcrumb-item">
                  <router-link :to="resolve_route_name('documents.show', { documentSlug: category.document.slug })" class="text-decoration-none">
                    {{ category.document.title }}
                  </router-link>
                </li>
                <li class="breadcrumb-item active">{{ category.title }}</li>
              </ol>
            </nav>
            <h1 class="h3 fw-bold text-dark mb-2">{{ category.title }}</h1>
            <p v-if="category.description" class="text-muted mb-0">{{ category.description }}</p>
          </div>
          <div class="badge bg-success bg-gradient-success px-3 py-2">
            {{ category.questions.length }} {{ $t('questions') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Questions List -->
    <div v-if="processedQuestions.length > 0" class="row g-3">
      <div
        v-for="(question, index) in processedQuestions"
        :key="question.id"
        class="col-12"
      >
        <div class="card border-0 shadow-soft">
          <div class="card-body p-4">
            <!-- Question Header -->
            <div class="d-flex align-items-start mb-3">
              <div class="bg-light rounded-3 d-flex align-items-center justify-content-center me-3 flex-shrink-0" style="width: 40px; height: 40px;">
                <span class="fw-bold text-success">{{ index + 1 }}</span>
              </div>
              <div class="flex-grow-1">
                <h5 class="fw-bold text-dark mb-2" v-html="question.question_text"></h5>
                
                <!-- Question Image -->
                <div v-if="question.image_url" class="mb-3">
                  <img :src="question.image_url" alt="Question Image" class="img-fluid rounded" style="max-width: 400px;" />
                </div>

                <!-- Options -->
                <div class="mb-3">
                  <div
                    v-for="option in question.options"
                    :key="option.id"
                    class="form-check mb-2 p-3 rounded"
                    :class="{
                      'bg-success bg-opacity-10 border border-success': option.is_correct,
                      'bg-light': !option.is_correct
                    }"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="option.is_correct"
                      disabled
                    />
                    <label class="form-check-label ms-2" :class="{ 'fw-bold text-success': option.is_correct }">
                      <span v-html="option.option_text"></span>
                    </label>
                  </div>
                </div>

                <!-- Explanation -->
                <div v-if="question.explanation" class="alert alert-info mb-0">
                  <h6 class="fw-bold mb-2">
                    <i class="ni ni-bulb-61 me-2"></i>{{ $t('explanation') }}:
                  </h6>
                  <div v-html="question.explanation"></div>
                  
                  <!-- Translation Toggle -->
                  <TranslationToggle 
                    v-if="question.vietnamese_translation"
                    :translation="question.vietnamese_translation"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card border-0 shadow-soft">
      <div class="card-body p-5 text-center">
        <div class="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style="width: 80px; height: 80px;">
          <i class="ni ni-ui-04 text-muted fs-3"></i>
        </div>
        <h3 class="h5 fw-bold text-dark mb-2">{{ $t('no_questions_yet') }}</h3>
        <p class="text-muted mb-0">{{ $t('no_questions_in_chapter') }}</p>
      </div>
    </div>
    </div>
    </AppLayout>
  </div>
</template>

<script setup>
import PageTitle from '@/components/PageTitle.vue';
import { resolve_route_name } from '@/utils/route-helper.js'
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { http } from '@/api/http-client.js'
import AppLayout from '@/layouts/AppLayout.vue'
import TranslationToggle from '@/components/Shared/TranslationToggle.vue'
import { fixImageUrl } from '@/utils/highlight.js'

const route = useRoute()

// State
const category = ref(null)
const loading = ref(true)
const error = ref(null)

// Fetch category data from API
const fetchCategory = async () => {
  loading.value = true
  error.value = null
  
  try {
    const categoryId = route.params.categoryId
    const response = await http.get(`/api/documents/category/${categoryId}`)
    
    if (response.data.success) {
      category.value = response.data.data
    } else {
      throw new Error(response.data.message || 'Category not found')
    }
  } catch (err) {
    console.error('Error loading category:', err)
    error.value = err.response?.data?.message || err.message || 'Không thể tải danh mục'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategory()
})

// Process questions để fix image URLs
const processedQuestions = computed(() => {
  if (!category.value || !category.value.questions) return []
  return category.value.questions.map(question => ({
    ...question,
    question_text: question.content,
    image_url: question.image_url ? fixImageUrl(question.image_url) : null,
    options: question.choices
  }))
})
</script>
