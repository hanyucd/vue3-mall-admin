<template>
  <FormDrawer ref="formDrawerRef" title="推荐商品" confirm-text="关联" size="50%" destroy-on-close @formDrawerSubmitEvt="openChooseGoodsRelationDialog">
    <el-table :data="tableData" border stripe>
      <el-table-column prop="goods_id" label="ID" width="60" align="center" />

      <el-table-column label="商品封面" align="center" style="width: 35%;min-width: 180px;">
        <template #default="{ row }">
          <el-image :src="row.cover" fit="fill" :lazy="true" style="width: 64px;height: 64px;" />
        </template>
      </el-table-column>      

      <el-table-column prop="name" label="商品名称" align="center" style="width: 35%;min-width: 180px;" />

      <el-table-column label="操作" align="center" width="100">
        <template #default="{ row }">
          <el-popconfirm width="180" confirm-button-text="删除" cancel-button-text="取消" title="是否删除该关联商品" @confirm="handleDeleteRelation(row)">
            <template #reference>
              <el-button type="primary" text :loading="row.isDelLoading">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <ChooseGoodsDialog ref="chooseGoodsDialogRef" />
  </FormDrawer>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import ChooseGoodsDialog from '@/components/ChooseGoodsDialog/ChooseGoodsDialog.vue';
import { ref, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const tableData = ref([]);
const formDrawerRef = ref(null);
const categoryId = ref(0); // 商品分类 id

/**
 * 打开详情 drawer
 */
const openRelationDrawer = tableItem => {
  console.log(tableItem);
  tableItem.goodsDrawerLoading = true;
  categoryId.value = tableItem.id;

  _getGoodsCategoryRelationList().then(res => {
    formDrawerRef.value.openFormDrawer();
  }).finally(() => {
    tableItem.goodsDrawerLoading = false;
  });
};

/**
 * 获取商品、分类关联列表
 */
const _getGoodsCategoryRelationList = () => {
  return proxy.$api.getGoodsCategoryRelationListApi({ category_id: categoryId.value }).then(res => {
    tableData.value = res.data.map(item => {
      item.isDelLoading = false;
      return item;
    });
  });
};

/**
 * 处理删除关联
 */
const handleDeleteRelation = tableItem => {
  tableItem.isDelLoading = true;

  proxy.$api.deleteGoodsCategoryRelationApi(tableItem.id).then(res => {
    proxy.$commonUtil.elNotify('删除成功');
    _getGoodsCategoryRelationList();
  });
};

const chooseGoodsDialogRef = ref(null);
// 打开关联 dialog
const openChooseGoodsRelationDialog = () => {
  chooseGoodsDialogRef.value.openChooseGoodsDialog(goodsId => {
    formDrawerRef.value.showSubmitBtnLoading();

    const param = { category_id: categoryId.value, goods_ids: goodsId };
    proxy.$api.updateGoodsCategoryRelationApi(param).then(res => {
      _getGoodsCategoryRelationList();
      proxy.$commonUtil.elNotify('关联成功');
    }).finally(() => {
      formDrawerRef.value.hideSubmitBtnLoading();
    });
  });
};

defineExpose({
  openRelationDrawer
});
</script>

<style lang="scss" scoped>

</style>
