<template>
  <div class="about-page">
    <!-- Background shapes -->
    <div class="bg-shape bg-shape--one"></div>
    <div class="bg-shape bg-shape--two"></div>

    <main class="about-main">
      <!-- HERO SECTION -->
      <section class="cs-container hero">
        <div class="hero-layout">
          <div class="hero-text">
            <span class="hero-pill">About CafeShop</span>
            <h1 class="cs-heading-xl hero-title">Good food, warm lights, slow mornings.</h1>
            <p class="cs-body-muted hero-subtitle">
              CafeShop is your everyday corner cafe at the heart of the hotel lobby – where guests,
              students and locals start their day with coffee, snacks and easy conversation.
            </p>

            <div class="hero-tags">
              <span class="hero-tag">Freshly brewed coffee</span>
              <span class="hero-tag">Comfort food classics</span>
              <span class="hero-tag">Study & chill corner</span>
            </div>
          </div>

          <div class="hero-media">
            <div class="hero-card">
              <p class="hero-card-eyebrow">Since 2024</p>
              <p class="hero-card-text">
                From early-morning lattes to late study sessions, our team serves guests all day,
                every day – with a smile and a snack.
              </p>

              <div class="hero-stats">
                <div class="hero-stat">
                  <span class="hero-stat-value">7:00 – 22:00</span>
                  <span class="hero-stat-label">Daily opening hours</span>
                </div>
                <div class="hero-stat">
                  <span class="hero-stat-value">25+</span>
                  <span class="hero-stat-label">Signature menu items</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- STORY + IMAGE SECTION -->
      <section class="cs-container story">
        <div class="story-layout">
          <div class="story-media">
            <div class="story-photo story-photo--main"></div>
            <div class="story-photo story-photo--secondary"></div>
          </div>

          <div class="story-text">
            <h2 class="section-title">Our story</h2>
            <p class="section-subtitle">
              CafeShop was created as a cozy meeting point between hotel guests, university students
              and the local neighborhood. A place where it feels natural to stay a little longer.
            </p>

            <p class="story-body">
              We started with a simple idea: combine hotel-grade service with the relaxed vibe of a
              campus cafe. That’s why you’ll find specialty coffee next to comfort dishes, fast
              Wi-Fi next to power outlets, and playlists that match the time of day.
            </p>

            <p class="story-body">
              Whether you're grabbing a quick take-away before class, hosting a casual meeting, or
              winding down with dessert in the evening, our team aims to make every visit feel easy,
              friendly and just a little bit special.
            </p>

            <ul class="story-list">
              <li>Freshly brewed coffee and teas all day</li>
              <li>Quick bites, light bowls and sharing plates</li>
              <li>Plenty of plugs, seating and calm lighting</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- HIGHLIGHTS / STATS ROW -->
      <section class="cs-container highlights">
        <div class="highlights-grid">
          <article v-for="item in highlights" :key="item.title" class="highlight-card">
            <div class="highlight-icon">
              {{ item.icon }}
            </div>
            <h3 class="highlight-title">{{ item.title }}</h3>
            <p class="highlight-text">
              {{ item.description }}
            </p>
          </article>
        </div>
      </section>

      <!-- VALUES SECTION -->
      <section class="cs-container values">
        <div class="values-header">
          <h2 class="section-title">What we care about</h2>
          <p class="section-subtitle">
            Every drink we pour and dish we send out follows a simple checklist: fresh, cozy,
            friendly.
          </p>
        </div>

        <div class="values-grid">
          <article v-for="value in values" :key="value.title" class="value-card">
            <h3 class="value-title">{{ value.title }}</h3>
            <p class="value-text">{{ value.description }}</p>

            <ul class="value-list">
              <li v-for="point in value.points" :key="point">
                {{ point }}
              </li>
            </ul>
          </article>
        </div>
      </section>

      <!-- CTA SECTION -->
      <section class="cs-container visit">
        <div class="visit-card">
          <div class="visit-left">
            <h2 class="visit-title">Come say hi at CafeShop</h2>
            <p class="visit-text">
              We’re on the ground floor, right next to the lobby entrance. Drop by with your laptop,
              your friends or just your coffee cravings.
            </p>
          </div>
          <div class="visit-right">
            <div class="visit-pill">
              <span class="visit-dot"></span>
              <span>Open daily · 7:00 – 22:00</span>
            </div>
            <p class="visit-small">
              Follow the “CafeShop” signs from reception – you’ll smell the coffee.
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
type Highlight = {
  title: string
  description: string
  icon: string
}

type Value = {
  title: string
  description: string
  points: string[]
}

const highlights: Highlight[] = [
  {
    title: 'Lobby convenience',
    description: 'Located just steps from reception – easy to find, easy to return to.',
    icon: '📍',
  },
  {
    title: 'All-day energy',
    description: 'From first espresso shot to late-night snacks, we keep the lights on.',
    icon: '⚡️',
  },
  {
    title: 'Made to share',
    description: 'Plates and drinks designed for small groups, study sessions and meet-ups.',
    icon: '👥',
  },
]

const values: Value[] = [
  {
    title: 'Freshness first',
    description:
      'We prioritize ingredients and prep that taste just as good at 7 p.m. as at 7 a.m.',
    points: ['Brew-to-order coffee', 'Daily baked sweets', 'Simple, honest plates'],
  },
  {
    title: 'Comfort & calm',
    description:
      'Soft lighting, comfortable seating and a layout that fits laptops and long talks.',
    points: [
      'Plenty of plugs and seating',
      'Warm, neutral interior tones',
      'Ambient playlists, not noise',
    ],
  },
  {
    title: 'Friendly service',
    description: 'Our team is here to help – whether you’re rushing or settling in for hours.',
    points: [
      'Quick order-at-counter flow',
      'Smiles, not scripts',
      'Happy to customize when we can',
    ],
  },
]
</script>

<style scoped>
.about-page {
  position: relative;
  background: radial-gradient(circle at top left, #fff7d6 0, #f9fafb 40%, #eef2ff 100%);
  min-height: 100vh;
  overflow: hidden;
}

/* Background shapes */
.bg-shape {
  position: absolute;
  border-radius: 999px;
  filter: blur(40px);
  opacity: 0.55;
  pointer-events: none;
  z-index: 0;
}

.bg-shape--one {
  width: 260px;
  height: 260px;
  background: #facc15;
  top: -60px;
  right: 8%;
  animation: floatShape 18s ease-in-out infinite;
}

.bg-shape--two {
  width: 220px;
  height: 220px;
  background: #a855f7;
  bottom: -80px;
  left: 4%;
  animation: floatShape 22s ease-in-out infinite;
}

.about-main {
  padding-block: 2.6rem 3.4rem;
  position: relative;
  z-index: 1;
}

/* ---------- HERO ---------- */
.hero {
  margin-bottom: 2.5rem;
}

.hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1.1fr);
  gap: 2.2rem;
  align-items: center;
}

.hero-text {
  max-width: 520px;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.35);
  backdrop-filter: blur(10px);
}

.hero-pill::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #22c55e;
}

.hero-title {
  margin-top: 0.7rem;
  margin-bottom: 0.3rem;
}

.hero-subtitle {
  margin-top: 0.4rem;
  font-size: 0.95rem;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.9rem;
}

.hero-tag {
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  border: 1px dashed rgba(148, 163, 184, 0.7);
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
}

/* hero right card */
.hero-media {
  display: flex;
  justify-content: flex-end;
}

.hero-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 24px;
  padding: 1.4rem 1.5rem 1.6rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  max-width: 380px;
  transform: translateY(18px);
  opacity: 0;
  animation: cardIn 0.7s ease-out forwards;
}

.hero-card-eyebrow {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.hero-card-text {
  font-size: 0.88rem;
  color: #4b5563;
  margin-bottom: 1rem;
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1.1rem;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.hero-stat-value {
  font-size: 1rem;
  font-weight: 700;
}

.hero-stat-label {
  font-size: 0.78rem;
  color: #6b7280;
}

/* ---------- STORY ---------- */
.story {
  margin-bottom: 2.6rem;
}

.story-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr);
  gap: 2rem;
  align-items: center;
}

.story-media {
  position: relative;
  min-height: 260px;
}

.story-photo {
  position: absolute;
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
  background-size: cover;
  background-position: center;
}

.story-photo--main {
  inset: 0;
  background-image: url('https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg');
}

.story-photo--secondary {
  width: 140px;
  height: 140px;
  right: -16px;
  bottom: -16px;
  background-image: url('https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg');
  border: 4px solid #f9fafb;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.section-subtitle {
  font-size: 0.9rem;
  color: var(--cs-text-muted, #6b7280);
  margin-bottom: 0.7rem;
}

.story-body {
  font-size: 0.9rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.story-list {
  margin-top: 0.5rem;
  padding-left: 1.1rem;
  font-size: 0.88rem;
  color: #4b5563;
}

.story-list li + li {
  margin-top: 0.25rem;
}

/* ---------- HIGHLIGHTS ---------- */
.highlights {
  margin-bottom: 2.4rem;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.4rem;
}

.highlight-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 20px;
  padding: 1rem 1rem 1.1rem;
  box-shadow: var(--cs-shadow-soft, 0 14px 30px rgba(15, 23, 42, 0.09));
  border: 1px solid rgba(248, 250, 252, 0.95);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.highlight-icon {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fffbeb;
  margin-bottom: 0.15rem;
}

.highlight-title {
  font-size: 0.96rem;
  font-weight: 600;
}

.highlight-text {
  font-size: 0.86rem;
  color: var(--cs-text-muted, #6b7280);
}

/* ---------- VALUES ---------- */
.values {
  margin-bottom: 3rem;
}

.values-header {
  text-align: center;
  max-width: 520px;
  margin: 0 auto 1.4rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.4rem;
}

.value-card {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 20px;
  padding: 1.1rem 1.1rem 1.2rem;
  box-shadow: var(--cs-shadow-soft, 0 14px 30px rgba(15, 23, 42, 0.09));
  border: 1px solid rgba(248, 250, 252, 0.95);
}

.value-title {
  font-size: 0.96rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.value-text {
  font-size: 0.86rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.value-list {
  font-size: 0.83rem;
  color: #6b7280;
  padding-left: 1.1rem;
}

.value-list li + li {
  margin-top: 0.2rem;
}

/* ---------- VISIT CTA ---------- */
.visit {
  margin-top: 0.5rem;
}

.visit-card {
  background: linear-gradient(135deg, #fef3c7, #fee2e2);
  border-radius: 24px;
  padding: 1.3rem 1.5rem 1.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.4rem;
  box-shadow: 0 18px 40px rgba(251, 191, 36, 0.35);
}

.visit-left {
  max-width: 420px;
}

.visit-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.visit-text {
  font-size: 0.9rem;
  color: #4b5563;
}

.visit-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}

.visit-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
}

.visit-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background-color: #22c55e;
}

.visit-small {
  font-size: 0.8rem;
  color: #4b5563;
}

/* ---------- ANIMATIONS ---------- */
@keyframes floatShape {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(12px, -16px, 0);
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

/* ---------- RESPONSIVE ---------- */
@media (max-width: 960px) {
  .hero-layout,
  .story-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .hero-media {
    justify-content: flex-start;
  }

  .hero-card {
    max-width: 100%;
  }

  .story-media {
    order: -1;
    min-height: 220px;
  }

  .visit-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .visit-right {
    align-items: flex-start;
  }
}

@media (max-width: 720px) {
  .highlights-grid,
  .values-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .story-photo--secondary {
    display: none;
  }

  .about-main {
    padding-block: 2rem 2.6rem;
  }
}
</style>
