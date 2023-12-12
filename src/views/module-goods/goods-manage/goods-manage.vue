<template>
  <div>
    <el-tabs v-model="searchForm.tab" class="demo-tabs" @tab-change="onTabChangeEvt">
      <el-tab-pane v-for="(item, index) in tabbars" :key="index" :label="item.name" :name="item.key" />
    </el-tabs>
    
    <el-card shadow="never" class="border-0">
      <!-- 搜索 -->
      <SearchWrap :form-model="searchForm" @searchEvt="getTableData" @resetEvt="resetSearchForm">
        <SearchItem label="关键词">
          <el-input v-model="searchForm.title" clearable placeholder="请输入商品名称" />
        </SearchItem>
        <!-- 具名插槽 -->
        <template #more>
          <SearchItem label="商品分类">
            <el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
              <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </SearchItem>
        </template>
      </SearchWrap>
      
      <TableHeader @createEvt="openFormDrawer" @refreshEvt="getTableData(tablePage)" />
      
      <!-- 表格数据 -->
      <el-table v-loading="tableIsLoading" :data="tableDataList" border stripe>
        <el-table-column type="selection" width="55" />
  
        <el-table-column label="商品" width="300">
          <template #default="{ row }">
            <h5 class="font-md font-bold text-dark-300">{{ row.title }}</h5>
            <div class="flex items-center">
              <el-image class="mr-3 rounded" :src="row.cover" fit="cover" :lazy="true" style="width: 50px;height: 50px;" />
              <div class="flex-1">
                <div>
                  <span class="text-rose-500 text-xs font-bold">￥{{ row.min_price }}</span>
                  <el-divider direction="vertical" />
                  <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
                </div>
                <p class="text-gray-400 text-xs mb-1">分类: {{ row.category ? row.category.name : '未分类' }}</p>
                <p class="text-gray-400 text-xs">创建时间: {{ row.create_time }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="实际销量" width="100" prop="sale_count" align="center" />

        <el-table-column label="商品状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'" size="small">{{ row.status ? '上架' : '仓库' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column v-if="searchForm.tab != 'delete'" label="审核状态" width="100" align="center">
          <template #default="{ row }">
            <div v-if="row.ischeck == 0">
              <el-button type="success" size="small" plain @click="CheckGoodsStatus(row, 1)">审核通过</el-button>
              <el-button class="mt-1" type="danger" size="small" plain style="margin-left: 0 !important;" @click="CheckGoodsStatus(row, 2)">审核拒绝</el-button>
            </div>
            <el-tag v-else-if="row.ischeck == 1" type="success" size="small" effect="plain">通过</el-tag>
            <el-tag v-else type="danger" size="small" effect="plain">拒绝</el-tag>
          </template>
        </el-table-column>
  
        <el-table-column prop="stock" label="总库存" align="center" />
  
        <el-table-column label="操作" align="right">
          <template #default="scope">
            <div v-if="searchForm.tab != 'delete'">
              <el-button class="px-1" size="small" type="primary" @click="handleEdit(scope.row)"> 修改 </el-button>
              <!-- <el-button class="px-1" size="small" :type="isSetSku(scope.row)" :loading="scope.row.skusLoading" @click="handleSetGoodsSkus(scope.row)">商品规格</el-button> -->
              <el-button class="px-1" size="small" :type="scope.row.goods_banner.length == 0 ? 'danger' : 'primary'" :loading="scope.row.bannersLoading" @click="handleSetGoodsBanners(scope.row)">设置轮播图</el-button>
              <el-button class="px-1" size="small" :type="!scope.row.content ? 'danger' : 'primary'" :loading="scope.row.contentLoading" @click="handleSetGoodsContent(scope.row)">商品详情</el-button>
              <el-popconfirm title="是否删除该商品?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleMultiDelete(scope.row.id)">
                <template #reference>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
            <sapn v-else>暂无操作</sapn>
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
  </div>
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
  searchForm: {
    title: '',
    tab: 'all',
    category_id: null
  },
  getTableDataApi: proxy.$api.getGoodsLisApi,
  updateStatusApi: proxy.$api.updateManagerStatusApi,
  deleteApi: proxy.$api.deleteManagerApi,
  // 回调函数
  onGetListSuccess: tableDataRes => {
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

// tab 标签页
const tabbars = [
  { key: 'all', name: '全部' },
  { key: 'checking', name: '审核中' },
  { key: 'saling', name: '出售中' },
  { key: 'off', name: '已下架' },
  { key: 'min_stock', name: '库存预警' },
  { key: 'delete', name: '回收站' }
];

getTableData();

/**
 * tab 改变时触发
 */
const onTabChangeEvt = activeTabName => {
  console.log(activeTabName);
  getTableData();
};

// 分类列表
const category_list = ref([]);
proxy.$api.getGoodsCategoryLisApi().then(res => {
  category_list.value = res.data;
});
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
