<template>
  <div class=" flex items-center mb-4">
    <div class="flex items-center">
      <!-- 新增 -->
      <el-button v-if="btns.includes('create')" type="primary" size="default" @click="$emit('createEvt')">新增</el-button>

      <!-- 批量删除 -->
      <el-popconfirm v-if="btns.includes('delete')" :title="'是否批量删除选中' + title + '?'" width="180" confirm-button-text="删除" cancel-button-text="取消" @confirm="$emit('deleteEvt')">
        <template #reference>
          <el-button size="default" type="danger">批量删除</el-button>
        </template>
      </el-popconfirm>
      <slot></slot>
    </div>

    <div class="flex items-center ml-auto">
      <!-- 刷新数据 -->
      <el-tooltip v-if="btns.includes('refresh')" content="刷新数据" placement="top" effect="dark">
        <el-button type="text" @click="$emit('refreshEvt')">
          <el-icon :size="18"><Refresh /></el-icon>
        </el-button>
      </el-tooltip>

      <!-- 导出数据 -->
      <el-tooltip v-if="btns.includes('download')" content="导出数据" placement="top" effect="dark">
        <el-button type="text" @click="$emit('downloadEvt')">
          <el-icon :size="18"><Download /></el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  btnList: { type: String, default: 'create, refresh' },
  title: { type: String, default: '' },
});

defineEmits([ 'createEvt', 'refreshEvt', 'deleteEvt', 'downloadEvt']);

const btns = computed(() => props.btnList.replace(/\s+/g, '').split(','));
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
