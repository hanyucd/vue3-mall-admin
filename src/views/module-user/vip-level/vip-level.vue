<template>
  <el-card shadow="never" class="border-0">
    <TableHeader @createEvt="openFormDrawer" @refreshEvt="getTableData(tablePage)" />
    
    <!-- 表格数据 -->
    <el-table v-loading="tableIsLoading" :data="tableDataList" border stripe>
      <el-table-column prop="name" label="会员等级" />

      <el-table-column prop="discount" label="折扣率(%)" />

      <el-table-column prop="level" label="等级权重" />

      <el-table-column label="状态">
        <template #default="{ row }">
          <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" :loading="row.isLoading" @change="switchChange($event, row)" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEditTableItem(scope.row)">修改</el-button>
          <el-popconfirm title="是否删除此等级?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleTableItemDelete(scope.row)">
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
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="tableFormData.name" placeholder="等级名称" />
        </el-form-item>

        <el-form-item label="等级权重" prop="level">
          <el-input v-model="tableFormData.level" placeholder="等级权重" type="number" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch v-model="tableFormData.status" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <el-form-item label="升级条件">
          <div class="w-full">
            <small class="mr-3 text-sm text-gray-500">累计消费满</small>
            <el-input v-model="tableFormData.max_price" placeholder="累计消费" type="number" style="width: 50%;">
              <template #append>元</template>
            </el-input>
            <p class="text-sm text-gray-400 mt-2">设置会员等级所需要的累计消费必须大于等于0元</p>
          </div>
          <div class="w-full mt-5">
            <small class="mr-3 text-sm text-gray-500">累计购买次数</small>
            <el-input v-model="tableFormData.max_times" placeholder="累次次数" type="number" style="width: 50%;">
              <template #append>次</template>
            </el-input>
            <p class="text-sm text-gray-400 mt-2">设置会员等级所需要的购买量必须大于等于0</p>
          </div>
        </el-form-item>

        <el-form-item label="折扣率">
          <el-input v-model="tableFormData.discount" placeholder="折扣率" type="number" style="width: 50%;">
            <template #append>%</template>
          </el-input>
          <p class="text-sm text-gray-400 mt-2">折扣率单位为百分比，如输入90，便是该会员等级的用户可以以商品原价的90%购买</p>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import TableHeader from '@/components/TableHeader/TableHeader.vue';
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import { getCurrentInstance } from 'vue';
import * as useTableHook from '@/hooks/useTableHook';

const { proxy } = getCurrentInstance();

const {
  tableIsLoading,
  tablePage,
  tableLimit,
  tableTotal,
  tableDataList,
  getTableData,
  switchChange,
  onTableCurPaginationChangeEvt,
  handleTableItemDelete
} = useTableHook.useBaseTableHook({
  getTableDataApi: proxy.$api.getUserLevelLisApi,
  deleteApi: proxy.$api.deleteUserLevelApi,
  updateStatusApi: proxy.$api.updateUserLevelStatusApi,
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
    level: 100,
    discount: 0,
    status: 1,
    max_price: 0,
    max_times: 0
  },
  formRules: {
    name: [{ required: true, message: '请填写会员等级名称', trigger: 'blur' }],
  },
  createApi: proxy.$api.createUserLevelApi,
  updateApi: proxy.$api.updateUserLevelApi,
  tablePage,
  getTableData,
});

// 获取公告数据
getTableData();

</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
