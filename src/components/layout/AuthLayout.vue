<template>
  <div class="auth-layout">
    <main class="auth-container">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #f8fafc;
}
.auth-container {
  width: 100%;
  max-width: 420px;
}
</style>
