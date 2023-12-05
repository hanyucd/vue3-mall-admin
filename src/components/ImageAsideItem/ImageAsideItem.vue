<template>
  <div class="image-item" :class="{ 'image-item-active': active }">
    <span class="truncate"><slot></slot></span>
    <el-button class="ml-auto px-1" text type="primary" size="small" @click.stop="$emit('edit')">
      <el-icon :size="13"><Edit /></el-icon>
    </el-button>

    <el-popconfirm title="是否删除此分类?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="$emit('delete')">
      <template #reference>
        <el-button class="px-1" text type="primary" size="small">
          <el-icon :size="13"><Close /></el-icon>
        </el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<script setup>
defineProps({
  active: { type: Boolean, default: false},
});
defineEmits(['edit', 'delete']);
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
