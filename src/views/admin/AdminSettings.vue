<template>
Admin Setting
<div class="btn-div">
    <button class="setting-btn" @click="goToCategory"> Categories </button>
    <button class="setting-btn" @click="goToProduct"> Products </button>
    <button class="setting-btn" @click="goToTags"> Tags </button>
    <button class="setting-btn" @click="goToSizes"> Sizes </button>
</div>


</template>
<script setup lang="ts">
import router from '../../router';


function goToCategory(){
  router.push({name: 'category-table'})
}

function goToTags(){
  router.push({name: 'tags-table'})
}

function goToProduct(){
  router.push({name: 'admin-menu'})
}

function goToSizes(){
  router.push({name: 'size-table'})
}
</script>
<style scoped src="@/styles/admin/admin-setting.css"></style>
