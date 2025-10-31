<template>
  <teleport to="body">
    <div v-if="active" class="confetti-container">
      <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>
    </div>
  </teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: 3000,
  },
  particleCount: {
    type: Number,
    default: 100,
  },
});

const emit = defineEmits(['complete']);

const confettiCanvas = ref(null);
let animationFrame = null;
let particles = [];
let startTime = null;

class ConfettiParticle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = -20;
    this.size = Math.random() * 10 + 5;
    this.speedY = Math.random() * 3 + 2;
    this.speedX = Math.random() * 4 - 2;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 10 - 5;
    this.color = this.getRandomColor();
    this.shape = Math.random() > 0.5 ? 'circle' : 'square';
  }

  getRandomColor() {
    const colors = [
      '#5e72e4', // primary
      '#82d616', // success
      '#ffd700', // gold
      '#ff6b35', // orange
      '#a855f7', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;
    this.speedY += 0.1; // gravity
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);

    ctx.fillStyle = this.color;

    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }

    ctx.restore();
  }

  isOutOfBounds() {
    return this.y > this.canvas.height + 20;
  }
}

const initConfetti = () => {
  if (!confettiCanvas.value) return;

  const canvas = confettiCanvas.value;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  particles = [];
  for (let i = 0; i < props.particleCount; i++) {
    particles.push(new ConfettiParticle(canvas));
  }

  startTime = Date.now();
  animate();
};

const animate = () => {
  if (!confettiCanvas.value) return;

  const canvas = confettiCanvas.value;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.update();
    particle.draw(ctx);

    if (particle.isOutOfBounds()) {
      particle.reset();
    }
  });

  // Check if duration exceeded
  if (Date.now() - startTime < props.duration) {
    animationFrame = requestAnimationFrame(animate);
  } else {
    cleanup();
    emit('complete');
  }
};

const cleanup = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  particles = [];
};

const handleResize = () => {
  if (confettiCanvas.value) {
    confettiCanvas.value.width = window.innerWidth;
    confettiCanvas.value.height = window.innerHeight;
  }
};

watch(() => props.active, (newValue) => {
  if (newValue) {
    initConfetti();
  } else {
    cleanup();
  }
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  if (props.active) {
    initConfetti();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  cleanup();
});
</script>

<style scoped>
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 99999;
  overflow: hidden;
}

.confetti-canvas {
  width: 100%;
  height: 100%;
}
</style>

