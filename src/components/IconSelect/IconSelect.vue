<template>
  <div class="flex items-center">
    <el-icon v-if="modelValue" class="mr-2" :size="20">
      <component :is="modelValue" />
    </el-icon>
    
    <el-select :model-value="modelValue" placeholder="请选择图标" clearable filterable @change="onSelectChange">
      <el-option v-for="item in iconOptions" :key="item" :label="item" :value="item">
        <div class="flex items-center justify-between overflow-hidden w-full">
          <el-icon class="flex-shrink-0">
            <component :is="item" />
          </el-icon>
          <span class="text-gray-500 text-xs">
            {{ item }}
          </span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

defineProps({
  modelValue: String
});

const iconOptions = ref(Object.keys(ElementPlusIconsVue));

const emit = defineEmits(['update:modelValue']);

const onSelectChange = icon => {
  emit('update:modelValue', icon);
};
</script>

<style lang="scss" scoped>

</style>
