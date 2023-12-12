<template>
  <el-form :model="formModel" class=" mb-4">
    <el-row :gutter="20">
      <slot></slot>

      <template v-if="isShowMore">
        <slot name="more"></slot>
      </template>
      <el-col :span="8" :offset="isShowMore ? 0 : 8 ">
        <div class="flex items-center justify-end">
          <el-button type="primary" @click="$emit('searchEvt')">搜索</el-button>
          <el-button v-if="isShowReset" @click="$emit('resetEvt')">重置</el-button>
          <el-button v-if="isExistMore" type="primary" text @click="isShowMore = !isShowMore">
            {{ isShowMore ? '收起' : '展开' }}
            <el-icon class="pl-1">
              <ArrowUp v-if="isShowMore" />
              <ArrowDown v-else />
            </el-icon>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, useSlots } from 'vue';

defineProps({
  formModel: { type: Object, default: () => ({}) },
  isShowReset: { type: Boolean, default: true }
});

const slots = useSlots();
// !!就可以将变量转化为对应布尔值 | 存在 more 具名插槽
const isExistMore = ref(!!slots.more);
// 显示显示更多隐藏搜索
const isShowMore = ref(false);

defineEmits(['searchEvt', 'resetEvt']);
</script>

<style lang="scss" scoped>

</style>
