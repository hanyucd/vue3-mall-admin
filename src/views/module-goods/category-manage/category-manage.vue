<template>
  <el-card shadow="never" class="border-0">
    <TableHeader btn-list="create, refresh" @createEvt="openFormDrawer" @refreshEvt="getTableData(tablePage)" />

    <!-- 表格数据 -->
    <el-table ref="tableRef" v-loading="tableIsLoading" :data="tableDataList" border stripe>
      <el-table-column prop="name" label="商品分类" align="center" />
      
      <el-table-column label="状态" align="center">
        <template #default="{ row }">
          <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" :loading="row.isLoading" @change="switchChange($event, row)" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" :loading="scope.row.goodsDrawerLoading" @click="handleEditTableItem(scope.row)">推荐商品</el-button>
          <el-button size="small" type="primary" @click="handleEditTableItem(scope.row)">修改</el-button>
          <el-popconfirm title="是否删除该分类?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleTableItemDelete(scope.row)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="tablePage"
      v-model:page-size="tableLimit"
      class="mt-6 flex items-center justify-center"
      background
      layout="prev, pager, next" 
      :total="tableTotal"
      @current-change="onTableCurPaginationChangeEvt"
    />

    <!-- 表单Drawer -->
    <FormDrawer ref="formDrawerRef" :title="formDrawerTitle" destroy-on-close @formDrawerSubmitEvt="onFormDrawerSubmitEvt" @formDrawerCloseEvt="onFormDrawerCloseEvt">
      <el-form ref="formRef" :model="tableFormData" :rules="tableFormRules" label-width="80px" :inline="false" size="default">
        <el-form-item label="商品分类" prop="name">
          <el-input v-model="tableFormData.name" placeholder="请输入分类名称" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import TableHeader from '@/components/TableHeader/TableHeader.vue';
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';

import { ref, getCurrentInstance } from 'vue';
import * as useTableHook from '@/hooks/useTableHook';

const { proxy } = getCurrentInstance();

const {
  tableIsLoading,
  tablePage,
  tableLimit,
  tableTotal,
  tableDataList,
  tableRef,
  switchChange,
  getTableData,
  onTableCurPaginationChangeEvt,
  handleTableItemDelete
} = useTableHook.useBaseTableHook({
  getTableDataApi: proxy.$api.getGoodsCategoryListApi,
  updateStatusApi: proxy.$api.updateGoodsCategoryStatusApi,
  deleteApi: proxy.$api.deleteGoodsCategoryApi,
  onGetListSuccess: tableDataRes => {
    tableDataList.value = tableDataRes.map(item => {
      item.goodsDrawerLoading = false;
      return item;
    });
  }
});

const {
  tableFormData,
  tableFormRules,
  formDrawerRef,
  formRef,
  formDrawerTitle,
  editTableItemId,
  openFormDrawer,
  onFormDrawerSubmitEvt,
  onFormDrawerCloseEvt,
  handleEditTableItem
} = useTableHook.useFormTableHook({
  formData: {
    name: '',
  },
  formRules: {
    name: [ { required: true, message: '请输入分类名称', trigger: 'blur' } ],
  },
  createApi: proxy.$api.createGoodsCategoryApi,
  updateApi: proxy.$api.updateGoodsCategoryApi,
  tablePage,
  getTableData,
});

getTableData();
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
