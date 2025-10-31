<template>
    <button 
        @click="handleRestart" 
        :class="buttonClass" 
        :disabled="loading"
    >
        <div v-if="loading" class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <svg v-else width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="me-2">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <span v-if="loading">{{ $t('loading') }}</span>
        <span v-else>{{ label }}</span>
    </button>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { http } from '@/api/http-client.js';

const props = defineProps({
    type: {
        type: String,
        required: true, // 'exam' or 'document'
        validator: (value) => ['exam', 'document'].includes(value)
    },
    slug: {
        type: String,
        required: true
    },
    variant: {
        type: String,
        default: 'primary'
    },
    label: {
        type: String,
        default: `${$t('try_again')}`
    },
    confirmMessage: {
        type: String,
        default: `${$t('confirm_restart')}`
    },
    redirectAfter: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['restarted']);

const router = useRouter();
const loading = ref(false);

const buttonClass = computed(() => `btn btn-${props.variant}`);

const handleRestart = async () => {
    // Confirm before restart
    if (props.confirmMessage && !confirm(props.confirmMessage)) {
        return;
    }

    loading.value = true;
    
    try {
        // Call restart API
        const apiRoute = props.type === 'exam' 
            ? `/api/exams/${props.slug}/restart`
            : `/api/documents/${props.slug}/restart`;
            
        const response = await http.post(apiRoute);
        
        // Emit event
        emit('restarted', response.data);
        
        // Redirect if enabled
        if (props.redirectAfter) {
            const redirectRoute = props.type === 'exam'
                ? `/exams/${props.slug}/quiz`
                : `/documents/${props.slug}`;
                
            router.push(redirectRoute);
        }
    } catch (error) {
        // Silent fail
        const errorMessage = error.response?.data?.message || `${$t('error_restarting')}`;
        alert(errorMessage);
    } finally {
        loading.value = false;
    }
};
</script>

