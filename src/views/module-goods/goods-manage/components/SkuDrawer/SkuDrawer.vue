<template>
  <FormDrawer ref="formDrawerRef" title="设置商品规格" size="50%" destroy-on-close @formDrawerSubmitEvt="onFormDrawerSubmitEvt" @formDrawerCloseEvt="onFormDrawerCloseEvt">
    <el-form ref="formRef" :model="skuForm" label-width="80px" size="large" class="flex flex-col min-h-full">
      <el-form-item label="规格类型">
        <el-radio-group v-model="skuForm.sku_type">
          <el-radio :label="0" border>单规格</el-radio>
          <el-radio :label="1" border>多规格</el-radio>
        </el-radio-group>
      </el-form-item>

      <template v-if="skuForm.sku_type == 0">
        <el-form-item label="市场价格">
          <el-input v-model="skuForm.sku_value.oprice" style="max-width: 300px;">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input v-model="skuForm.sku_value.pprice" style="max-width: 300px;">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成本价格">
          <el-input v-model="skuForm.sku_value.cprice" style="max-width: 300px;">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="skuForm.sku_value.weight" style="max-width: 300px;">
            <template #append>公斤</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input v-model="skuForm.sku_value.volume" style="max-width: 300px;">
            <template #append>立方米</template>
          </el-input>
        </el-form-item>
      </template>

      <template v-else>
        多规格
      <!-- <sku-card /> -->
      </template>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import { ref, reactive, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const goodsId = ref(0); // 商品 id
// 商品规格表单
const skuForm = reactive({
  sku_type: 0,
  sku_value: {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0
  }
});
const formDrawerRef = ref(null);

const emit = defineEmits(['reloadDataEvt']);

/**
 * 打开详情 drawer
 */
 const openSkuDrawer = tableItem => {
  tableItem.skusLoading = true;
  goodsId.value = tableItem.id;

  proxy.$api.getGoodsDetailApi(goodsId.value).then(res => {
    skuForm.sku_type = res.data.sku_type || 0;
    skuForm.sku_value = res.data.sku_value || {
      oprice: 0,
      pprice: 0,
      cprice: 0,
      weight: 0,
      volume: 0
    };
    formDrawerRef.value.openFormDrawer();
  }).finally(() => {
    tableItem.skusLoading = false;
  });
};

// 表单 drawer 提交事件
const onFormDrawerSubmitEvt = () => {
  formDrawerRef.value.showSubmitBtnLoading();

  let params = { ...skuForm };
  // 多规格
  if (skuForm.sku_type == 1) {
    // params.goodsSkus = sku_list.value;
  }

  proxy.$api.updateGoodsSkuApi(goodsId.value, params).then(res => {
    proxy.$commonUtil.elNotify('更新商品规格成功');
    formDrawerRef.value.closeFormDrawer();
    emit('reloadDataEvt');
  }).finally(() => {
    formDrawerRef.value.hideSubmitBtnLoading();
  });
};

// 监听表单 drawer 关闭事件
const onFormDrawerCloseEvt = () => {
  console.log('关闭弹窗');
};

defineExpose({
  openSkuDrawer
});
</script>

<style lang="scss" scoped>

</style>
