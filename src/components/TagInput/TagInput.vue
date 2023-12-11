<template>
  <div>
    <template v-if="dynamicTags.length > 0">
      <el-tag v-for="tag in dynamicTags" :key="tag" class="mx-1" closable :disable-transitions="false" @close="handleClose(tag)">
        {{ tag }}
      </el-tag>
    </template>
    <el-input
      v-if="inputVisible"
      ref="inputRef"
      v-model="inputValue"
      class="ml-1 w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">+ 添加值</el-button>
  </div>
</template>

<script setup>
import { ref, computed ,nextTick } from 'vue';

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const inputRef = ref(null);
const inputVisible = ref(false);
const inputValue = ref('');

// 动态标签
const dynamicTags = computed({
  get() {
    return props.modelValue.length ? props.modelValue.split(',') : [];
  },
  set(newValue) {
    // console.log('写值', newValue);
    emit('update:modelValue', newValue.join(','));
  },
});

/**
 * 显示输入框
 */
const showInput = () => {
  inputVisible.value = true;
  // 等待 DOM 更新
  nextTick(() => {
    inputRef.value.input.focus();
  });
};

/**
 * 关闭 Tag 时触发的事件
 */
const handleClose = tag => {
  let tempArr = dynamicTags.value;
  tempArr.splice(tempArr.indexOf(tag), 1);
  dynamicTags.value = tempArr;
};

/**
 * 处理输入框确定
 */
const handleInputConfirm = () => {
  if (inputValue.value) {
    let tempArr = dynamicTags.value;
    tempArr.push(inputValue.value);
    dynamicTags.value = tempArr;
  }
  inputVisible.value = false;
  inputValue.value = '';
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
