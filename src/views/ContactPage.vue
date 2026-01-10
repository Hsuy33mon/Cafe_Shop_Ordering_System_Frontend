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

<style scoped src="@/styles/customer/contact-page.css"></style>
