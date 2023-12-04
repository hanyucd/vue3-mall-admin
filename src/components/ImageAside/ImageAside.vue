<template>
  <el-aside width="220px">
    <div class="content">
      <div v-for="item in 100" :key="item">
        {{ item }}
      </div>
    </div>
    <div class="footer">脚步</div>
  </el-aside>
</template>

<script setup>

</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
