<template>
  <div 
    class="formatted-text" 
    :class="textClass"
    :style="textStyle"
  >
    <pre v-if="preserveFormatting" class="formatted-pre"><code v-html="formattedContent"></code></pre>
    <div v-else v-html="formattedContent"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  preserveFormatting: {
    type: Boolean,
    default: true
  },
  textClass: {
    type: String,
    default: ''
  },
  fontSize: {
    type: String,
    default: 'inherit'
  },
  fontFamily: {
    type: String,
    default: 'monospace'
  }
})

const formattedContent = computed(() => {
  if (!props.content) return ''
  
  // Escape HTML để tránh XSS nhưng vẫn giữ định dạng
  const escaped = props.content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
  
  return escaped
})

const textStyle = computed(() => ({
  fontSize: props.fontSize,
  fontFamily: props.fontFamily
}))
</script>

<style scoped>
.formatted-text {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.formatted-pre {
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.formatted-pre code {
  background: transparent;
  padding: 0;
  border: none;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
}
</style>
