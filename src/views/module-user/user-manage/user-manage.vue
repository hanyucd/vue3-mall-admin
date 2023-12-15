<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 -->
    <SearchWrap :form-model="searchForm" @searchEvt="getTableData" @resetEvt="resetSearchForm">
      <SearchItem label="关键词">
        <el-input v-model="searchForm.keyword" clearable placeholder="请输入手机号/昵称" />
      </SearchItem>
      <!-- 具名插槽 -->
      <template #more>
        <SearchItem label="会员等级">
          <el-select v-model="searchForm.user_level_id" placeholder="请选择会员等级" clearable>
            <el-option v-for="item in userLevelList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </SearchItem>
      </template>
    </SearchWrap>
    
    <TableHeader @createEvt="openFormDrawer" @refreshEvt="getTableData(tablePage)" />
    
    <!-- 表格数据 -->
    <el-table v-loading="tableIsLoading" :data="tableDataList" border stripe>
      <el-table-column label="用户" width="300">
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
      
      <el-table-column label="会员等级" align="center">
        <template #default="{ row }">
          {{ row.user_level?.name || '-' }}
        </template>
      </el-table-column>

      <el-table-column label="登录注册" align="center">
        <template #default="{ row }">
          <p v-if="row.last_login_time">
            <span>最近登录:</span><span>{{ row.last_login_time }}</span>
          </p>
          <p>
            <span>注册时间:</span><span>{{ row.create_time }}</span>
          </p>
        </template>
      </el-table-column>

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
            <el-popconfirm title="是否删除该用户?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleTableItemDelete(scope.row)">
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
          <ChooseImage v-model="tableFormData.avatar" />
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="tableFormData.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="tableFormData.password" placeholder="请输入密码" show-password />
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="tableFormData.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="手机" prop="phone">
          <el-input v-model="tableFormData.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="tableFormData.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="会员等级" prop="user_level_id">
          <el-select v-model="tableFormData.user_level_id" placeholder="请选择会员等级" clearable filterable>
            <el-option label="--请选择会员等级--" value="--" disabled />
            <el-option v-for="item in userLevelList" :key="item.id" :label="item.name" :value="item.id" />
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
import TableHeader from '@/components/TableHeader/TableHeader.vue';
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import SearchWrap from '@/components/SearchWrap/SearchWrap.vue';
import SearchItem from '@/components/SearchItem/SearchItem.vue';
import ChooseImage from '@/components/ChooseImage/ChooseImage.vue';

import { ref, getCurrentInstance } from 'vue';
import * as useTableHook from '@/hooks/useTableHook';

const { proxy } = getCurrentInstance();

const userLevelList = ref([]); // 用户等级列表

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
  searchForm: { keyword: '', user_level_id: '' },
  getTableDataApi: proxy.$api.getUserLisApi,
  updateStatusApi: proxy.$api.updateUserStatusApi,
  deleteApi: proxy.$api.deleteUserApi,
  // 回调函数
  onGetListSuccess: tableDataRes => {
    // 管理员角色赋值
    userLevelList.value = tableDataRes.user_level || [];
    tableDataList.value = tableDataRes.list.map(item => { item.isLoading = false; return item; });
    tableTotal.value = tableDataRes.totalCount;
  },
});

// 自定义验证规则
const _checkPhoneRule = (rule, value, callback) => {
  const reg =  /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (!reg.test(value)) {
    return callback(new Error('请填写正确的手机号'));
  }
  callback();
};
const _checkEmailRule = (rule, value, callback) => {
  const reg =  /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (!reg.test(value)) {
    return callback(new Error('请填写正确的邮箱'));
  }
  callback();
};

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
    user_level_id: 3,
    phone: '',
    nickname: '',
    email: '',
    status: 1,
    avatar: ''
  },
  formRules: {
    username: [ { required: true, message: '请填写用户名', trigger: 'blur' } ],
    password: [ { required: true, message: '请填写密码', trigger: 'blur' } ],
    phone: [ { validator: _checkPhoneRule, trigger: 'blur' } ],
    email: [ { validator: _checkEmailRule, trigger: 'blur' } ]
  },
  createApi: proxy.$api.createUserApi,
  updateApi: proxy.$api.updateUserApi,
  tablePage,
  getTableData,
});

getTableData();

</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
