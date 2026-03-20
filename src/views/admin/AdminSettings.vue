<template>
  <div class="btn-div">
    <button class="setting-btn" @click="goToCategory">Categories</button>
    <button class="setting-btn" @click="goToProduct">Products</button>
    <button class="setting-btn" @click="goToTags">Tags</button>
    <button class="setting-btn" @click="goToSizes">Sizes</button>
     <button class="setting-btn" @click="goToVats">Vats</button>
  </div>
</template>
<script setup lang="ts">
import router from '../../router'

function goToCategory() {
  router.push({ name: 'category-table' })
}

function goToTags() {
  router.push({ name: 'tags-table' })
}

function goToProduct() {
  router.push({ name: 'admin-menu' })
}

function goToSizes() {
  router.push({ name: 'size-table' })
}

function goToVats() {
  router.push({name: 'admin-vat-list'})
}
</script>
<style scoped src="@/styles/admin/admin-setting.css"></style>
