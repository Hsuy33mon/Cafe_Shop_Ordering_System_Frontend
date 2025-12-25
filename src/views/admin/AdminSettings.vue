<template>
Admin Setting
<div class="btn-div">
    <button class="setting-btn" @click="goToCategory"> Categories </button>
    <button class="setting-btn" > Products </button>
    <button class="setting-btn" > Tags </button>
    <button class="setting-btn"> Category </button>
</div>


</template>
<script setup lang="ts">
import router from '../../router';


function goToCategory(){
  router.push({name: 'category-table'})
}
</script>
<style scoped src="@/styles/admin/admin-setting.css"></style>
