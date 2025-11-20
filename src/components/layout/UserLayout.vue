<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderPage from './HeaderPage.vue'
import FooterPage from './FooterPage.vue'
</script>

<template>
  <HeaderPage></HeaderPage>
  <RouterView></RouterView>
  <FooterPage></FooterPage>
</template>
<style scoped></style>
