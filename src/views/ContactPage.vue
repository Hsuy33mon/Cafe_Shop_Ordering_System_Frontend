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
          <span>Daily 8:00 – 18:00 (CafeShop)</span>
        </div>
      </div>
    </section>

    <!-- MAIN CONTENT -->
    <main class="contact-main">
      <section class="cs-container contact-layout">
        <!-- RIGHT: INFO + LOCATION -->
        <aside class="contact-side">
          <div class="info-card card-animate card-animate--delay">
            <h2 class="section-title">Visit Five Two One CafeShop</h2>
            <p class="section-subtitle">
              Ground floor, hotel lobby – right next to the main entrance.
            </p>

            <div class="info-block">
              <h3 class="info-title">Opening hours</h3>
              <p class="info-text">
                Monday: <strong>8:00 – 17:00</strong><br />
                Tuesday-Sunday: <strong>8:00 – 18:00</strong><br />
                Breakfast favourites, all-day snacks &amp; coffee.
              </p>
            </div>

            <div class="info-block">
              <h3 class="info-title">Contact</h3>
              <p class="info-text">
                Phone:
                <a href="tel:+660831936982" class="link-inline">+66 08 319 36982</a><br />
                Line / Chat:
                <span class="link-inline">@cafeshop</span><br />
              </p>
            </div>
          </div>

          <div class="map-card card-animate card-animate--delay-lg">
            <div class="map-header">
              <span class="dot dot--green" />
              <span class="map-label">Cafe location</span>
            </div>

            <div class="map-placeholder">
              <iframe class="map-frame" src="https://www.google.com/maps?q=13.740169,100.5807218&z=17&output=embed"
                loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
              <!-- <iframe
                class="map-frame"
                src="https://www.google.com/maps/place/D+Varee+Residence+Montara+Thonglor+25/@13.7398661,100.5805632,19.94z/data=!4m9!3m8!1s0x30e29e50b7d4b54f:0xf6c4223a8ddee63a!5m2!4m1!1i2!8m2!3d13.740169!4d100.5807218!16s%2Fg%2F12hnjprgv?hl=en&entry=ttu&g_ep=EgoyMDI2MDMxNS4wIKXMDSoASAFQAw%3D%3D"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                :allowfullscreen="true"
              ></iframe> -->
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


<style scoped src="@/styles/customer/contact-page.css"></style>
