<template>
    <div>
        <PageTitle :title="$t('welcome_to') + ' ' + appName" />
        <div class="welcome-page">
            <!-- Navigation -->
            <nav
                class="navbar navbar-expand-lg fixed-top"
                :class="{ scrolled: isScrolled }"
            >
                <div class="container">
                    <a class="navbar-brand m-0" href="/">
                        <div class="d-flex align-items-center">
                            <Logo class="h-10 sm:h-8 md:h-10" />
                        </div>
                    </a>
                    <ul class="navbar-nav d-lg-block d-none">
                        <li class="nav-item text-white">
                            <LanguageSwitcher />
                        </li>
                    </ul>
                </div>
            </nav>

            <!-- Hero Section -->
            <section class="hero" data-aos="fade-up" data-aos-duration="1000">
                <div class="animated-bg"></div>
                <div id="particles-js"></div>

                <div class="hero-content text-center">
                    <h1 class="hero-title">
                        <span class="hero-title-line">
                            {{ $t("welcome_to") }}
                            <span class="brand-wrap">
                                <IconTextDecoration class="brand-underline" />
                                <span class="brand-name">{{ appName }}</span>
                            </span>
                        </span>
                    </h1>
                    <h2>
                        <div class="rotating-slogan">
                            <span>{{ displayedText }}</span
                            ><span class="cursor">|</span>
                        </div>
                    </h2>
                    <p>{{ $t("welcome_description") }}</p>
                    <button class="cta-btn" @click="startQuiz">
                        {{ $t("get_started") }}
                    </button>
                </div>

                <div class="hero-quiz">
                    <div class="code-section">
                        <h5 class="mb-3">{{ $t("try_a_sample_question") }}</h5>
                        <pre><code class="language-java">{{ sampleCode }}</code></pre>
                        <div class="quiz-question">
                            {{ sampleQuestion }}
                        </div>
                        <div class="answers mt-3">
                            <label
                                v-for="(answer, index) in sampleAnswers"
                                :key="index"
                                :class="{ selected: selectedAnswer === index }"
                                @click="selectAnswer(index)"
                            >
                                <input
                                    type="radio"
                                    :name="'sample-question'"
                                    :value="index"
                                    v-model="selectedAnswer"
                                />
                                {{ answer }}
                            </label>
                        </div>
                        <div class="text-center">
                            <button
                                class="cta-btn"
                                @click="checkAnswer"
                                :disabled="selectedAnswer === null"
                            >
                                {{
                                    answerChecked
                                        ? $t("start_quiz")
                                        : $t("check_answer")
                                }}
                            </button>
                        </div>
                        <div v-if="answerChecked" class="answer-result mt-3">
                            <div
                                :class="isCorrect ? 'text-success' : 'text-danger'"
                            >
                                <i
                                    :class="
                                        isCorrect
                                            ? 'fas fa-check-circle'
                                            : 'fas fa-times-circle'
                                    "
                                ></i>
                                {{ isCorrect ? $t("correct") : $t("incorrect") }}
                            </div>
                            <div class="explanation mt-2">
                                <strong>{{ $t("explanation") }}:</strong>
                                {{ explanation }}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Footer -->
            <footer class="footer text-center py-4 text-muted fixed-bottom">
                Copyright © {{ new Date().getFullYear() }} by
                <a href="https://github.com/doanquangnd" target="_blank">{{appName}}</a
                >.
            </footer>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import PageTitle from '@/components/PageTitle.vue';
import { useAuthStore } from '@/stores/auth'
import { useToast } from "@/composables/useToast.js"
import Logo from "@/components/Logo.vue"
import IconTextDecoration from "@/components/IconTextDecoration.vue"
import LanguageSwitcher from "@/components/LanguageSwitcher.vue"

// Composables
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Reactive data
const appName = import.meta.env.VITE_APP_NAME
const isScrolled = ref(false)
const selectedAnswer = ref(null)
const answerChecked = ref(false)
const isCorrect = ref(false)

const slogans = [
    "Think Java. Think Smart.",
    "Code. Learn. Conquer.",
    "Train your brain",
    "Boost your Java skills",
    "Quiz for real developers",
    "Suy nghĩ bằng Java, tư duy thông minh.",
    "Javaで考え、スマートに動く。",
]

const currentSloganIndex = ref(0)
const displayedText = ref("")
const typingSpeed = 80
const delayBetweenSlogans = 1500

const sampleCode = `public class Main {
      public static void main(String[] args) {
          int x = 5;
          int y = ++x * 2;
          System.out.println(y);
      }
  }`

const sampleQuestion = "What will be the output of the following code?"
const sampleAnswers = ["A. 10", "B. 11", "C. 12", "D. 8"]
const correctAnswer = 2
const explanation = "The pre-increment operator (++i) increments the value before it's used in the expression."

// Methods
const initScrollListener = () => {
    window.addEventListener("scroll", handleScroll)
}

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
}

const selectAnswer = (index) => {
    selectedAnswer.value = index
}

const checkAnswer = () => {
    if (selectedAnswer.value === null) return
    answerChecked.value = true
    isCorrect.value = selectedAnswer.value === correctAnswer
    if (isCorrect.value) {
        toast.success(
            "Correct! You have a good understanding of the pre-increment operator."
        )
    } else {
        toast.error(
            "Incorrect! Please see the explanation to understand better."
        )
    }
}

const startQuiz = () => {
    if (authStore.is_authenticated) {
        router.push("/dashboard")
    } else {
        router.push("/signin")
    }
}

const startTypewriter = async () => {
    while (true) {
        const slogan = slogans[currentSloganIndex.value]
        await typeText(slogan)
        await sleep(delayBetweenSlogans)
        await deleteText()
        currentSloganIndex.value = (currentSloganIndex.value + 1) % slogans.length
    }
}

const typeText = async (text) => {
    displayedText.value = ""
    for (let i = 0; i < text.length; i++) {
        displayedText.value += text[i]
        await sleep(typingSpeed)
    }
}

const deleteText = async () => {
    for (let i = displayedText.value.length; i >= 0; i--) {
        displayedText.value = displayedText.value.substring(0, i)
        await sleep(30)
    }
}

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const initParticles = () => {
    if (typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
            particles: {
                number: { value: 80 },
                size: { value: 3 },
                move: { speed: 1 },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.2,
                    width: 1,
                },
                color: { value: "#ffffff" },
                opacity: { value: 0.4 },
            },
            interactivity: {
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                },
                modes: {
                    repulse: { distance: 100 },
                    push: { particles_nb: 4 },
                },
            },
            retina_detect: true,
        })
    }
}

const initAOS = () => {
    if (typeof AOS !== "undefined") {
        AOS.init()
    }
}

const initHighlight = () => {
    if (typeof hljs !== "undefined") {
        hljs.highlightAll()
    }
}

// Lifecycle hooks
onMounted(() => {
    initScrollListener()
    initParticles()
    initAOS()
    initHighlight()
    startTypewriter()
})

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll)
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap");

/* =============================
   🔹 Global Styles
============================= */
:root {
    --primary-color: #6f42c1;
    --gradient-hero: linear-gradient(135deg, #6f42c1, #d63384);
}

.welcome-page {
    font-family: "Space Mono", monospace;
    background: linear-gradient(to bottom right, #f8f9ff, #eef1ff);
    color: #212529;
    overflow-x: hidden;
}

/* =============================
   🔹 Navbar
============================= */
.navbar {
    background: transparent;
    padding: 1rem 2rem;
    transition: background-color 0.4s ease;
}

.navbar.scrolled {
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(10px);
}

.navbar-brand {
    font-weight: 700;
    font-size: 1.5rem;
    color: var(--primary-color);
    text-decoration: none;
}

/* =============================
   🔹 Hero Section
============================= */
.hero {
    position: relative;
    height: 100vh;
    min-height: 600px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--gradient-hero);
    color: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 4rem;
    perspective: 1000px;
}
/* H1 layout và kích thước */
.hero-title {
    font-weight: 800;
    color: #0f172a; /* gần text-slate-900 */
    line-height: 1.1;
    margin-bottom: 1.5rem;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-size: 2.5rem;
}
@media (min-width: 640px) {
    .hero-title {
        font-size: 3.5rem;
    }
}
@media (min-width: 992px) {
    .hero-title {
        font-size: 4.25rem;
    }
}

.hero-title-line {
    display: inline-block;
    vertical-align: baseline;
}

/* Phần thương hiệu màu đỏ + gạch lượn */
.brand-wrap {
    position: relative;
    display: inline-block;
    margin: 0 0.35rem 0 0.5rem;
}
.brand-name {
    position: relative;
    color: #67ff0b;
    font-weight: 800;
}
.brand-underline {
    position: absolute;
    left: 0;
    bottom: -0.15em; /* nằm sát chân chữ */
    width: 100%;
    height: 0.6em;
    fill: #01f12582; /* đỏ nhạt như ảnh */
    pointer-events: none;
}


/* Typewriter (đã có hiệu ứng), chỉ chỉnh kích thước & màu */
.rotating-slogan {
    display: inline-block;
    color: #0f172a;
    font-weight: 800;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    .hero-title,
    .rotating-slogan {
        color: #fff;
    }
}

/* Background gradient animation */
.animated-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(270deg, #6f42c1, #d63384, #ff6b6b, #4facfe);
    background-size: 800% 800%;
    animation: gradientShift 20s ease infinite;
    z-index: 0;
    transform: translateZ(-50px) scale(1.2);
}

@keyframes gradientShift {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

/* Particle Layer */
#particles-js {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;
    transform: translateZ(-30px) scale(1.1);
}

/* Hero Content */
.hero-content {
    position: relative;
    z-index: 2;
    flex: 1;
    max-width: 45%;
    padding: 2rem;
    animation: fadeInLeft 1.2s ease;
    transform: translateZ(0);
}

@keyframes fadeInLeft {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.hero-content h1 {
    font-size: 3.8rem;
    font-weight: 800;
    margin-bottom: 1rem;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hero-content p {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.85);
}

/* CTA Button */
.cta-btn {
    background: #ff6b6b;
    color: #fff;
    padding: 0.85rem 1.8rem;
    font-size: 1.2rem;
    font-weight: 600;
    border: none;
    border-radius: 50px;
    margin-top: 2rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
    cursor: pointer;
}

.cta-btn:hover {
    background: #ff5252;
    transform: translateY(-3px);
    box-shadow: 0 6px 25px rgba(255, 107, 107, 0.4);
}

.cta-btn:disabled {
    background: #6c757d;
    color: #fff;
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 10px rgba(108, 117, 125, 0.3);
}

/* =============================
   🔹 Typewriter Slogan
============================= */
.rotating-slogan {
    font-size: 1.4rem;
    font-weight: 600;
    margin-top: 1rem;
    color: #fff;
    min-height: 2rem;
    white-space: pre;
}

.cursor {
    display: inline-block;
    width: 1ch;
    animation: blink 0.8s infinite;
    color: #fff;
}

@keyframes blink {
    0%,
    50% {
        opacity: 1;
    }
    50%,
    100% {
        opacity: 0;
    }
}

/* =============================
   🔹 Quiz Card Section
============================= */
.hero-quiz {
    position: relative;
    z-index: 2;
    flex: 1;
    max-width: 50%;
    padding: 2rem;
    animation: fadeInRight 1.2s ease;
    transform: translateZ(0);
}

@keyframes fadeInRight {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.hero-quiz .code-section {
    background: rgba(255, 255, 255, 0.11);
    backdrop-filter: blur(8px);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    color: #fff;
    transition: all 0.4s ease;
}

.hero-quiz .code-section:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
    background: rgba(255, 255, 255, 0.15);
}

pre {
    border-radius: 0.75rem;
    padding: 1rem;
    background: #282c34;
    color: #f8f9fa;
    font-size: 0.9rem;
}

.quiz-question {
    font-size: 1.1rem;
    font-weight: 600;
    margin-top: 1rem;
    color: var(--primary-color);
}

.answers label {
    display: block;
    background: #f1f3f5;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    margin-top: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    color: #212529;
}

.answers label:hover {
    background: #e2e6ea;
    transform: translateX(5px);
}

.answers label.selected {
    background: #e3f2fd;
    border: 2px solid var(--primary-color);
}

.answer-result {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    backdrop-filter: blur(5px);
}

.explanation {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
}

/* =============================
   🔹 Footer
============================= */
.footer {
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
}

/* =============================
   🔹 Responsive
============================= */
@media (max-width: 991px) {
    .hero {
        flex-direction: column;
        height: auto;
        min-height: 500px;
        padding: 4rem 1rem;
    }

    .hero-content,
    .hero-quiz {
        max-width: 100%;
        text-align: center;
    }

    .hero-content h1 {
        font-size: 2.5rem;
    }

    .rotating-slogan {
        font-size: 1.2rem;
    }
}

@media (max-width: 576px) {
    .hero-content h1 {
        font-size: 2rem;
    }

    .hero-content p {
        font-size: 1rem;
    }

    .cta-btn {
        font-size: 1rem;
        padding: 0.75rem 1.5rem;
    }

    .rotating-slogan {
        font-size: 1rem;
    }

    .hero-quiz .code-section {
        padding: 1rem;
    }
}
</style>
