<script setup lang="ts">
import { RouterView } from 'vue-router'
import Footer from './components/layout/FooterPage.vue'
import MobileNav from './components/layout/MobileNav.vue'
import SliderNav from './components/layout/SliderNav.vue'
import NavBar from './components/layout/NavBar.vue'
import Header from './components/layout/HeaderPage.vue'

</script>


<template>
    <Header></Header>
    <div class="custom-cursor">
      <SliderNav></SliderNav>
      <div class="page-wrapper">
        <NavBar></NavBar>
        <RouterView></RouterView>
        <Footer></Footer>
      </div>
      <MobileNav></MobileNav>
    </div>
</template>
<style scoped></style>
