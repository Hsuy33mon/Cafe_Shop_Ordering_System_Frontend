<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderPage from './components/layout/HeaderPage.vue'
import FooterPage from './components/layout/FooterPage.vue'
</script>

<template>
  <HeaderPage></HeaderPage>
  <RouterView></RouterView>
  <FooterPage></FooterPage>
</template>
<style scoped></style>
