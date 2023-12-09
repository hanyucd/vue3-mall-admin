<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 -->
    <SearchWrap :form-model="searchForm" @searchEvt="getTableData" @resetEvt="resetSearchForm">
      <SearchItem label="关键词">
        <el-input v-model="searchForm.keyword" clearable placeholder="请输入管理员昵称搜索" />
      </SearchItem>
    </SearchWrap>
    
    <el-button type="primary" size="default" @click="openFormDrawer">新增</el-button>
    
    <!-- 表格数据 -->
    <el-table v-loading="tableIsLoading" :data="tableDataList" border stripe>
      <!-- 管理员 -->
      <el-table-column label="管理员" width="300">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar :size="40" :src="row.avatar">
              <img src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" />
            </el-avatar>
            <div class="ml-2 leading-normal">
              <h3>{{ row.username }}</h3>
              <small class="mt-1">ID: {{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="role.name" label="所属角色" align="center" />

      <el-table-column label="状态" align="center">
        <template #default="{ row }">
          <el-switch :disabled="row.super == 1" :model-value="row.status" :active-value="1" :inactive-value="0" :loading="row.isLoading" @change="switchChange($event, row)" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="260" align="center">
        <template #default="scope">
          <small v-if="scope.row.super == 1" class="text-gray-500">暂无操作</small>
          <div v-else>
            <el-button size="small" type="primary" @click="handleEditTableItem(scope.row)">修改</el-button>
            <el-popconfirm title="是否删除该角色?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleTableItemDelete(scope.row)">
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
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
        <el-form-item label="头像" prop="avatar">
          <!-- 组件 v-model 实现双向绑定 -->
          <ChooseImage v-model="tableFormData.avatar" />
        </el-form-item>
        
        <el-form-item label="用户名" prop="username">
          <el-input v-model="tableFormData.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="tableFormData.password" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item label="角色" prop="role_id">
          <el-select v-model="tableFormData.role_id" placeholder="请选择角色" clearable filterable>
            <el-option label="--请选择角色--" value="--" disabled />
            <el-option v-for="item in managerRoles" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="tableFormData.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import SearchWrap from '@/components/SearchWrap/SearchWrap.vue';
import SearchItem from '@/components/SearchItem/SearchItem.vue';
import ChooseImage from '@/components/ChooseImage/ChooseImage.vue';

import { ref, getCurrentInstance } from 'vue';
import * as useTableHook from '@/hooks/useTableHook';

const { proxy } = getCurrentInstance();

const managerRoles = ref([]); // 管理员角色列表

const {
  tableIsLoading,
  tablePage,
  tableLimit,
  tableTotal,
  tableDataList,
  searchForm,
  resetSearchForm,
  switchChange,
  getTableData,
  onTableCurPaginationChangeEvt,
  handleTableItemDelete
} = useTableHook.useBaseTableHook({
  searchForm: { keyword: '' },
  getTableDataApi: proxy.$api.getManagerListApi,
  updateStatusApi: proxy.$api.updateManagerStatusApi,
  deleteApi: proxy.$api.deleteManagerApi,
  // 回调函数
  onGetListSuccess: tableDataRes => {
    // console.log(tableDataRes);
    // 管理员角色赋值
    managerRoles.value = tableDataRes.roles || [];
    tableDataList.value = tableDataRes.list.map(item => { item.isLoading = false; return item; });
    tableTotal.value = tableDataRes.totalCount;
  },
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
    username: '',
    password: '',
    role_id: '',
    status: 1,
    avatar: ''
  },
  formRules: {
    username: [ { required: true, message: '请填写用户名', trigger: 'blur' } ],
    password: [ { required: true, message: '请填写密码', trigger: 'blur' } ]
  },
  createApi: proxy.$api.createManagerApi,
  updateApi: proxy.$api.updateManagerApi,
  tablePage,
  getTableData,
});

getTableData();

</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
