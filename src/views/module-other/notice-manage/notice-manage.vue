<template>
  <el-card shadow="never" class="border-0">
    <TableHeader @createEvt="openFormDrawer" @refreshEvt="getTableData(tablePage)" />
    
    <!-- 表格数据 -->
    <el-table v-loading="tableIsLoading" :data="tableDataList" border stripe>
      <el-table-column prop="title" label="公告标题" width="260" />
      
      <el-table-column prop="content" label="发布内容" />

      <el-table-column prop="create_time" label="发布时间" />

      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEditTableItem(scope.row)">修改</el-button>
          <el-popconfirm title="是否删除此公告?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleTableItemDelete(scope.row)">
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
      <el-form ref="formRef" :model="tableFormData" :rules="tableFormRules" label-width="80px" size="large" class="flex flex-col min-h-full">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="tableFormData.title" placeholder="公告标题" />
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="tableFormData.content" placeholder="公告内容" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import TableHeader from '@/components/TableHeader/TableHeader.vue';
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import { reactive, getCurrentInstance } from 'vue';
import * as useTableHook from '@/hooks/useTableHook';

const { proxy } = getCurrentInstance();

const {
  tableIsLoading,
  tablePage,
  tableLimit,
  tableTotal,
  tableDataList,
  getTableData,
  onTableCurPaginationChangeEvt,
  handleTableItemDelete
} = useTableHook.useBaseTableHook({
  getTableDataApi: proxy.$api.getNoticeListApi,
  deleteApi: proxy.$api.deleteNoticeApi
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
  formData: { title: '', content: '' },
  formRules: {
    title: [{ required: true, message: '请填写公告标题', trigger: 'blur' }],
    content: [{ required: true, message: '请填写公告内容', trigger: 'blur' }]
  },
  createApi: proxy.$api.createNoticeApi,
  updateApi: proxy.$api.updateNoticeApi,
  tablePage,
  getTableData,
});

// 获取公告数据
getTableData();

</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
