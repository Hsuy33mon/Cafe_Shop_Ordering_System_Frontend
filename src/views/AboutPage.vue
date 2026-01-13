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
<style scoped src="@/styles/customer/about-page.css"></style>
