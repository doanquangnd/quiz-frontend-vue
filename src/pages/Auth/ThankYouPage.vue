<template>
    <div class="thankyou-page d-flex flex-column align-items-center justify-content-center min-vh-100 bg-body-tertiary px-3">
      <!-- Card -->
      <div class="card thankyou-card border-0 shadow-lg rounded-4 overflow-hidden animate-fade-in" style="max-width: 520px;">
        <!-- Gradient Header -->
        <div class="thankyou-header d-flex align-items-center justify-content-center p-5 position-relative">
          <div class="circle d-flex align-items-center justify-content-center">
            <i class="bi bi-envelope-paper-heart-fill fs-1 text-white"></i>
          </div>
        </div>
  
        <!-- Content -->
        <div class="card-body text-center p-4 p-md-5">
          <h2 class="fw-bold text-dark mb-3">{{ $t('thank_you') }}</h2>
          <p class="text-muted mb-4">
            {{ $t('thank_you_description') }}
          </p>
  
          <!-- Status -->
          <div class="alert alert-primary status-box border-0 rounded-pill py-2 mb-4 shadow-sm fw-semibold">
            {{ $t('status') }}: {{ $t('pending') }}
          </div>
  
          <!-- Actions -->
          <div class="d-flex flex-column gap-2">
            <button class="btn btn-primary w-100 btn-gradient" @click="goHome">
              <i class="bi bi-house-door me-2"></i>
              {{ $t('back_to_home') }}
            </button>
            <button class="btn btn-outline-secondary w-100" @click="checkEmail">
              <i class="bi bi-envelope me-2"></i>
              {{ $t('check_email') }}
            </button>
          </div>
        </div>
      </div>
    </div>
</template>
  
  <script setup>
  const goHome = () => {
    window.location.href = '/'
  }
  
  const checkEmail = () => {
    window.open('https://mail.google.com', '_blank')
  }
  </script>
  
  <style scoped>
  /* Background */
  .thankyou-page {
    background: linear-gradient(to bottom right, #eef6ff, #f9fafc);
  }
  
  /* Card */
  .thankyou-card {
    animation: fadeIn 0.8s ease;
  }
  
  /* Gradient Header */
  .thankyou-header {
    background: linear-gradient(135deg, #007bff, #6610f2);
    height: 150px;
  }
  
  .circle {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
  
  /* Buttons */
  .btn-gradient {
    background: linear-gradient(135deg, #6610f2, #007bff);
    border: none;
    transition: all 0.3s ease;
  }
  
  .btn-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.35);
  }
  
  /* Status box */
  .status-box {
    background: linear-gradient(135deg, #007bff, #00bfff);
    color: white;
    font-size: 0.95rem;
  }
  
  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Responsive */
  @media (max-width: 576px) {
    .thankyou-header {
      height: 120px;
    }
    .circle {
      width: 70px;
      height: 70px;
    }
  }
  </style>
  