<template>
  <div v-if="showBtn" class="flex items-center flex-wrap">
    <template v-if="modelValue">
      <el-image v-if="(typeof modelValue == 'string')" :src="modelValue" fit="cover" :lazy="true" class="border w-[100px] h-[100px] rounded mx-1 mb-2" />
      <template v-else>
        <div v-for="(url, index) in modelValue" :key="index" class="relative flex flex-wrap w-[100px] h-[100px] mx-1 mb-2">
          <el-icon class="bg-white rounded-full text-md absolute top-[5px] right-[5px] z-10 " @click="removeImage(url)">
            <CircleClose />
          </el-icon>
          <el-image :src="url" fit="cover" :lazy="true" class="border w-[100px] h-[100px] rounded " />
        </div>
      </template>
    </template>
    <div class="choose-image-btn mx-1 mb-2" @click="openImageDialog">
      <el-icon class="text-gray-500" size="25"><Plus /></el-icon>
    </div>
  </div>

  <!-- 图片对话框 -->
  <el-dialog v-model="dialogVisible" title="选择图片" width="80%" top="5vh" @close="onImageDialogCloseEvt">
    <el-container class="bg-white rounded">
      <el-header>
        <el-button type="primary" @click="openAddImageClassDrawer">新增图片分类</el-button>
        <el-button type="warning" @click="openUploadFileDrawer">上传图片</el-button>
      </el-header>
      <el-container>
        <ImageAside ref="imageAsideRef" @changeImageClassEvt="onChangeImageClassEvt" />
        <ImageMain ref="imageMainRef" :image-limit="imageLimit" is-show-checked @imageChooseEvt="onImageChooseEvt" />
      </el-container>
    </el-container>
    <template #footer>
      <span>
        <el-button @click="closeChooseImageDialog">取消</el-button>
        <el-button type="primary" @click="submitCheckedImage">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import ImageAside from '@/components/ImageAside/ImageAside.vue';
import ImageMain from '@/components/ImageMain/ImageMain.vue';

const { proxy } = getCurrentInstance();

const props = defineProps({
  modelValue: [String, Array],
  showBtn: { type: Boolean, default: true },
  imageLimit: { type: Number, default: 1 },
});

// dialog框打开和关闭
const dialogVisible = ref(false);
const imageAsideRef = ref(null);
const imageMainRef = ref(null);

/**
 * 打开新增图片分类 drawer
 */
 const openAddImageClassDrawer = () => imageAsideRef.value.openAddImageClassDrawer();

/**
 * 打开上传文件 drawer
 */
const openUploadFileDrawer = () => imageMainRef.value.openUploadFileDrawer();

/**
 * 监听侧边栏 图片分类改变 事件
 */
const onChangeImageClassEvt = imageClassId => {
  imageMainRef.value.fetchImageList(imageClassId);
};

// 选中图片 urls 
let checkedImageURLs = [];
/**
 * 监听图片选中 事件
 */
const onImageChooseEvt = checkedImageList => {
  console.log('选中：', checkedImageList);
  // 过滤出图片地址
  checkedImageURLs = checkedImageList.map(item => item.url);
  console.log('选中URL：', checkedImageURLs);
};

const emit = defineEmits(['update:modelValue']);
/**
 * 提交选中的图片
 */
 const submitCheckedImage = () => {
  if (!checkedImageURLs.length) return proxy.$commonUtil.elNotify('没有选中图片', 'warning');

  if (props.imageLimit > 1) {
    // // 编辑商品详情时添加图片
    // if (!props.showBtn && typeof callBackFunction.value === 'function') {
    //     callBackFunction.value(urls);
    // } else {
    //     let values = [...props.modelValue, ...urls];
    //     if (values.length > props.imageLimit) {
    //         values = values.splice(0, props.imageLimit);
    //         toast(`最多只能传${props.imageLimit}张图片`, 'warning');
    //     }
    //     emit('update:modelValue', values);
    // }
  } else {
    // 组件 v-model 实现双向绑定
    emit('update:modelValue', checkedImageURLs[0] || '' );
  }

  closeChooseImageDialog();
};

/**
 * 监听图片 dialog 关闭事件
 */
const onImageDialogCloseEvt = () => {
  imageMainRef.value.clearImageCheckbox();
};

/**
 * 打开选择图片 dialog
 */
const openImageDialog = () => {
  dialogVisible.value = true;
};

/**
 * 关闭图片 dialog
 */
const closeChooseImageDialog = () => {
  dialogVisible.value = false;
};

defineExpose({
  openImageDialog,
  closeChooseImageDialog
});
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
