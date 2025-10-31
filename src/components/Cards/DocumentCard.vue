<template>
  <router-link :to="documentHref" class="card border-0 shadow-soft h-100 text-decoration-none card-hover">
    <div class="card-body p-4">
      <!-- Icon Badge -->
      <div class="bg-gradient-primary rounded-3 d-flex align-items-center justify-content-center mb-3" style="width: 48px; height: 48px;">
        <i class="ni ni-books-2 text-white fs-5"></i>
      </div>
      
      <!-- Title -->
      <h5 class="fw-bold text-dark mb-2 text-truncate-2">
        {{ document.title }}
      </h5>
      
      <!-- Description -->
      <p v-if="document.description" class="text-muted small mb-3 text-truncate-2">
        {{ document.description }}
      </p>
      
      <!-- Stats -->
      <div class="d-flex align-items-center justify-content-between pt-3 border-top">
        <div class="d-flex align-items-center text-muted small">
          <i class="ni ni-collection me-2"></i>
          <span class="fw-medium">{{ document.categories_count || 0 }} {{ $t('chapters') }}</span>
        </div>
        
        <i class="ni ni-bold-right text-muted"></i>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  document: {
    type: Object,
    required: true
  }
})

const documentHref = computed(() => {
  return `/documents/${props.document.slug || 'default'}`
})
</script>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-hover {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
}
</style>
