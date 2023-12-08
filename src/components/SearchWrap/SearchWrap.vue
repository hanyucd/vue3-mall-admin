<template>
  <el-form :model="formModel">
    <el-row :gutter="20">
      <slot></slot>
      <el-col :span="8" :offset="showSearch ? 0 : 8 ">
        <div class="flex items-center justify-end">
          <el-button type="primary" @click="$emit('searchEvt')">搜索</el-button>
          <el-button v-if="isShowReset" @click="$emit('resetEvt')">重置</el-button>
        <!-- <el-button v-if="hasShowSearch" type="primary" text @click="showSearch = !showSearch">
            {{ showSearch ? '收起' : '展开' }}
            <el-icon class="pl-1">
              <ArrowUp v-if="showSearch" />
              <ArrowDown v-else />
            </el-icon>
          </el-button> -->
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  formModel: { type: Object, default: () => ({}) },
  isShowReset: { type: Boolean, default: true }
});

// 显示隐藏搜索
const showSearch = ref(false);

defineEmits(['searchEvt', 'resetEvt']);
</script>

<style lang="scss" scoped>

</style>
