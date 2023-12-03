<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex items-center justify-between text-sm">
        <span>订单统计</span>
        <div>
          <el-check-tag v-for="(item, index) in tagTypeOptions" :key="index" :checked="curTagType == item.type" size="small" color="red" class="ml-2" @click="changeTagType(item.type)">
            {{ item.value }}
          </el-check-tag>
        </div>
      </div>
    </template>

    <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
    <template #footer>Footer content</template>
  </el-card>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const curTagType = ref('week');
const tagTypeOptions = [
  { type: 'month', value: '近1个月' },
  { type: 'week', value: '近1周' },
  { type: 'hour', value: '近24小时' }
];

// 切换 tag
const changeTagType = tagType => {
    curTagType.value = tagType;
    // getDate(type);
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
