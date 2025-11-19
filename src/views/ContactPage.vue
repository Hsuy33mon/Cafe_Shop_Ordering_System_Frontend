<template>
  <div class="contact-page">
    <!-- decorative background shapes -->
    <div class="bg-shape bg-shape--one"></div>
    <div class="bg-shape bg-shape--two"></div>

    <!-- PAGE HEADER / COVER -->
    <section class="contact-hero">
      <div class="cs-container contact-hero-inner">
        <div class="hero-text">
          <p class="eyebrow">Contact</p>
          <h1 class="contact-title">Let’s talk about good food</h1>
          <p class="contact-subtitle">
            Questions about your order, room delivery or menu? Our team is here to help.
          </p>

          <div class="hero-tags">
            <span class="hero-tag">Fresh coffee daily</span>
            <span class="hero-tag">Room &amp; table service</span>
          </div>
        </div>

        <div class="contact-meta-pill">
          <span class="dot" />
          <span>Daily 7:00 – 22:00 (CafeShop)</span>
        </div>
      </div>
    </section>

    <!-- MAIN CONTENT -->
    <main class="contact-main">
      <section class="cs-container contact-layout">
        <!-- LEFT: CONTACT FORM -->
        <section class="contact-form-card card-animate">
          <h2 class="section-title">Send us a message</h2>
          <p class="section-subtitle">
            Share feedback, ask about allergens or request something special for your stay.
          </p>

          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="field-row">
              <div class="field">
                <label class="field-label">Your name</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="field-input"
                  placeholder="Eg. Aye Chan"
                  required
                />
              </div>
              <div class="field">
                <label class="field-label">Room / Table no. (optional)</label>
                <input
                  v-model="form.roomOrTable"
                  type="text"
                  class="field-input"
                  placeholder="Eg. Room 1205"
                />
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="field-label">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="field-input"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div class="field">
                <label class="field-label">Phone (optional)</label>
                <input v-model="form.phone" type="tel" class="field-input" placeholder="+66 ..." />
              </div>
            </div>

            <div class="field">
              <label class="field-label">Topic</label>
              <select v-model="form.topic" class="field-input select-input" required>
                <option value="" disabled>Select a topic</option>
                <option value="order">Order or delivery</option>
                <option value="menu">Menu &amp; allergens</option>
                <option value="feedback">Feedback</option>
                <option value="other">Something else</option>
              </select>
            </div>

            <div class="field">
              <label class="field-label">Message</label>
              <textarea
                v-model="form.message"
                class="field-input field-textarea"
                rows="4"
                placeholder="Tell us how we can help…"
                required
              />
            </div>

            <button type="submit" class="btn primary submit-btn">
              <span>Send message</span>
              <span class="btn-glow" />
            </button>

            <p v-if="submitted" class="success-text">
              Thank you! We’ve received your message and will get back to you soon.
            </p>
          </form>
        </section>

        <!-- RIGHT: INFO + LOCATION -->
        <aside class="contact-side">
          <div class="info-card card-animate card-animate--delay">
            <h2 class="section-title">Visit CafeShop</h2>
            <p class="section-subtitle">
              Ground floor, hotel lobby – right next to the main entrance.
            </p>

            <div class="info-block">
              <h3 class="info-title">Opening hours</h3>
              <p class="info-text">
                Daily: <strong>7:00 – 22:00</strong><br />
                Breakfast favourites, all-day snacks &amp; coffee.
              </p>
            </div>

            <div class="info-block">
              <h3 class="info-title">Contact</h3>
              <p class="info-text">
                Phone:
                <a href="tel:+66000000000" class="link-inline">+66 00 000 0000</a><br />
                Line / Chat:
                <span class="link-inline">@cafeshop</span><br />
                Email:
                <a href="mailto:hello@cafeshop.local" class="link-inline">hello@cafeshop.local</a>
              </p>
            </div>
          </div>

          <div class="map-card card-animate card-animate--delay-lg">
            <div class="map-header">
              <span class="dot dot--green" />
              <span class="map-label">Cafe location</span>
            </div>

            <div class="map-placeholder">
              <iframe
                class="map-frame"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31023.320866788!2d100.8238592!3d13.6019968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d430e775155f9%3A0xf01923824353260!2sAssumption%20University%20Suvarnabhumi%20Campus!5e0!3m2!1sen!2sth!4v1763490259254!5m2!1sen!2sth"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                :allowfullscreen="true"
              ></iframe>
            </div>

            <p class="map-text">
              We’re just a few steps from the lobby reception. Follow the “CafeShop” sign and the
              smell of fresh coffee.
            </p>
          </div>
        </aside>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

type ContactForm = {
  name: string
  roomOrTable: string
  email: string
  phone: string
  topic: string
  message: string
}

const form = reactive<ContactForm>({
  name: '',
  roomOrTable: '',
  email: '',
  phone: '',
  topic: '',
  message: '',
})

const submitted = ref(false)

function handleSubmit() {
  console.log('Contact form submitted', { ...form })

  submitted.value = true

  setTimeout(() => {
    submitted.value = false
  }, 4000)
}
</script>

<style scoped>
.contact-page {
  position: relative;
  background: radial-gradient(circle at top left, #fff7d6 0, #f9fafb 35%, #f3f4f6 100%);
  min-height: calc(100vh - 64px);
  overflow: hidden;
}

/* soft floating background shapes */
.bg-shape {
  position: absolute;
  border-radius: 999px;
  filter: blur(40px);
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}

.bg-shape--one {
  width: 260px;
  height: 260px;
  background: #f8e7a0;
  top: -40px;
  right: 10%;
  animation: floatShape 14s ease-in-out infinite;
}

/* ---------- HEADER / COVER ---------- */
.contact-hero {
  position: relative;
  background: transparent;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  z-index: 1;
}

.contact-hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 2.6rem;
  gap: 1.5rem;
}

.hero-text {
  max-width: 480px;
}

.contact-title {
  font-size: 2.1rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #111827;
  margin-bottom: 0.4rem;
}

.contact-subtitle {
  font-size: 0.95rem;
  color: var(--cs-text-muted);
  max-width: 420px;
  margin-bottom: 0.9rem;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.hero-tag {
  font-size: 0.7rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  border: 1px dashed rgba(15, 23, 42, 0.18);
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
}

.contact-meta-pill {
  background: linear-gradient(135deg, #fde68a, #facc15);
  padding: 0.65rem 1.3rem;
  border-radius: 999px;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 12px 30px rgba(202, 138, 4, 0.4);
  animation: pulseGlow 2.2s ease-in-out infinite;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background-color: #16a34a;
}

/* ---------- MAIN LAYOUT ---------- */
.contact-main {
  padding-block: 2.2rem 3rem;
  position: relative;
  z-index: 1;
}

.contact-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1.4fr);
  gap: 2rem;
}

/* shared card styles + entrance animation */
.card-animate {
  background: rgba(255, 255, 255, 0.88);
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  padding: 1.6rem 1.5rem 1.8rem;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transform: translateY(18px);
  opacity: 0;
  animation: cardIn 0.7s ease-out forwards;
}

.card-animate--delay {
  animation-delay: 0.12s;
}

.card-animate--delay-lg {
  animation-delay: 0.22s;
}

.card-animate:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 50px rgba(15, 23, 42, 0.12);
}

/* ---------- FORM CARD ---------- */
.contact-form-card {
  /* card styles from .card-animate */
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.section-subtitle {
  font-size: 0.85rem;
  color: var(--cs-text-muted);
  margin-bottom: 1rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.field-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.field-input {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 0.6rem 0.75rem;
  font-size: 0.85rem;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  outline: none;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.12s ease;
}

.field-input::placeholder {
  color: #9ca3af;
}

.field-input:focus {
  border-color: var(--cs-primary);
  box-shadow:
    0 0 0 1px rgba(250, 204, 21, 0.6),
    0 14px 28px rgba(15, 23, 42, 0.1);
  transform: translateY(-1px);
  background: #ffffff;
}

.select-input {
  -webkit-appearance: none;
  appearance: none;
  background-image:
    linear-gradient(45deg, transparent 50%, #6b7280 50%),
    linear-gradient(135deg, #6b7280 50%, transparent 50%);
  background-position:
    calc(100% - 14px) 55%,
    calc(100% - 10px) 55%;
  background-size:
    4px 4px,
    4px 4px;
  background-repeat: no-repeat;
}

.field-textarea {
  resize: vertical;
  min-height: 110px;
}

/* button */
.btn {
  position: relative;
  border-radius: 999px;
  padding: 0.7rem 1.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.btn.primary {
  background: linear-gradient(135deg, #facc15, #f97316);
  color: #111827;
  box-shadow: 0 14px 32px rgba(234, 179, 8, 0.7);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 40px rgba(234, 179, 8, 0.85);
}

.btn.primary:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: 0 8px 20px rgba(180, 83, 9, 0.7);
}

.btn-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 10% 0, rgba(255, 255, 255, 0.7), transparent 55%);
  opacity: 0.9;
  mix-blend-mode: screen;
  pointer-events: none;
}

.submit-btn {
  align-self: flex-start;
  margin-top: 0.4rem;
}

.success-text {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #16a34a;
  animation: fadeIn 0.3s ease-out;
}

/* ---------- SIDE COLUMN ---------- */
.contact-side {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}

.info-card,
.map-card {
  /* card styles inherit from .card-animate */
}

.info-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.info-text {
  font-size: 0.82rem;
  color: var(--cs-text-muted);
  line-height: 1.5;
}

.info-block + .info-block {
  margin-top: 0.9rem;
}

.link-inline {
  color: #111827;
  text-decoration: none;
  border-bottom: 1px dotted rgba(15, 23, 42, 0.5);
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.link-inline:hover {
  color: #ea580c;
  border-color: rgba(234, 88, 12, 0.7);
}

/* map card */
.map-header {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.6rem;
  font-size: 0.8rem;
}

.dot--green {
  background-color: #22c55e;
}

.map-label {
  font-weight: 500;
}

/* make the iframe fill the rounded box */
.map-frame {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

.map-placeholder {
  border-radius: 18px;
  overflow: hidden;
  background-color: #e5e7eb;
  height: 220px;
  position: relative;
}

.map-placeholder::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(250, 204, 21, 0.25), transparent);
  pointer-events: none;
}

.map-text {
  font-size: 0.8rem;
  color: var(--cs-text-muted);
  margin-top: 0.7rem;
}

/* ---------- ANIMATIONS ---------- */
@keyframes pulseGlow {
  0%,
  100% {
    transform: translateY(0);
    box-shadow: 0 12px 30px rgba(202, 138, 4, 0.4);
  }
  50% {
    transform: translateY(-2px);
    box-shadow: 0 18px 40px rgba(202, 138, 4, 0.55);
  }
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(26px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatShape {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(10px, -14px, 0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 960px) {
  .contact-hero-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .contact-meta-pill {
    align-self: flex-start;
  }

  .contact-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .field-row {
    grid-template-columns: minmax(0, 1fr);
  }

  .card-animate {
    border-radius: 18px;
  }

  .contact-hero-inner {
    padding-block: 1.8rem;
  }

  .contact-title {
    font-size: 1.7rem;
  }
}
</style>
