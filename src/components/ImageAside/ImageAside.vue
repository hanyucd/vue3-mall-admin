<template>
  <el-aside v-loading="isLoading" width="220px">
    <!-- 内容区 -->
    <div class="content">
      <div v-for="(item, index) in imageClassList" :key="index">
        <ImageAsideItem :active="activeImageClassId === item.id">{{ item.name }}</ImageAsideItem>
      </div>
    </div>
    <!-- 脚部分页器 -->
    <div class="footer">
      <el-pagination
        v-model:page-size="imageClassLimit"
        v-model:current-page="imageClassPage"
        background
        layout="prev, pager, next"
        :pager-count="2"
        :total="imageClassTotal"
        @current-change="onCurrentPaginationChangeEvt"
      />
    </div>
  </el-aside>

  <!-- 新增图片分类 表单drawer -->
  <FormDrawer ref="formDrawerRef" title="新增图片分类" destroy-on-close @formDrawerSubmitEvt="onFormDrawerSubmitEvt">
    <el-form ref="imageClassFormRef" :model="imageClassForm" :rules="imageClassFormRules" label-width="80px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="imageClassForm.name" />
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="imageClassForm.order" :min="0" :max="1000" />
      </el-form-item>

      <el-alert title="排序值越大越靠前" type="info" show-icon :closable="false" />
    </el-form>
  </FormDrawer>
</template>

<script setup>
import ImageAsideItem from '@/components/ImageAsideItem/ImageAsideItem.vue';
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import { ref, reactive, getCurrentInstance } from 'vue';

let isLoading = ref(false); // 是否加载中
let imageClassPage = ref(1); // 图片分类 当前页码
let imageClassLimit = ref(10); // 图片分类 一页数量
let imageClassTotal = ref(0); // 图片分类 数量总数
let imageClassList = ref([]); // 图片分类 列表数据
let activeImageClassId = ref(0); // 选中的图片分类 id
const { proxy } = getCurrentInstance();

/**
 * 获取图片分类列表
 */
const _getImageClassList = async (page = 1) => {
  isLoading.value = true;
  const param = { limit: imageClassLimit.value };
  try {
    const { data: imageClassData } = await proxy.$api.getImageClassListApi(page, param);
    imageClassTotal.value = imageClassData.totalCount;
    imageClassList.value = imageClassData.list;
    // 默认选中第一个分类
    imageClassList.value[0] && changeImageClassId(imageClassList.value[0].id);
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.log(error);
  }
};

_getImageClassList();

/**
 * 更换图片分类
 */
const changeImageClassId = imageClassId => {
  activeImageClassId.value = imageClassId;
};

/**
 * current-page 改变时触发
 */
const onCurrentPaginationChangeEvt = page => _getImageClassList(page);

const formDrawerRef = ref(null);
// 图片分类表单数据
const imageClassForm = reactive({ name: '', order: 30 });
// 图片分类表单验证
const imageClassFormRules = {
  name: [ { required: true, message: '图库分类名称不能为空', trigger: 'blur' } ]
};

/**
 * 打开 formDraw 子组件
 */
const openAddImageClassDrawer = () => formDrawerRef.value.openFormDrawer();

// 图片分类 form 表单组件引用
const imageClassFormRef = ref(null);
/**
 * 监听 formDraw 提交 事件
 */
const onFormDrawerSubmitEvt = () => {
  // console.log('提交');
  // form 表单组件
  imageClassFormRef.value.validate(valid => {
    console.log(valid);
    if (!valid) return;
    // formDrawerRef.value.showSubmitBtnLoading();
  });
};

defineExpose({ openAddImageClassDrawer });
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
