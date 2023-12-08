<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 -->
    <SearchWrap :form-model="searchForm" @searchEvt="getTableDataFetch" @resetEvt="resetSearchForm">
      <SearchItem label="关键词">
        <el-input v-model="searchForm.keyword" clearable placeholder="请输入管理员昵称搜索" />
      </SearchItem>
    </SearchWrap>
    
    <div @click="openFormDrawer">新增按钮</div>
    
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

      <el-table-column label="状态" width="200" align="center">
        <template #default="{ row }">
          <el-switch :disabled="row.super == 1" :model-value="row.status" :active-value="1" :inactive-value="0" :loading="row.isLoading" @change="switchChange($event, row)" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <small v-if="scope.row.super == 1" class="text-gray-500">暂无操作</small>
          <div v-else>
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">修改</el-button>
            <el-popconfirm title="是否删除该角色?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
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
  </el-card>
</template>

<script setup>
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import SearchWrap from '@/components/SearchWrap/SearchWrap.vue';
import SearchItem from '@/components/SearchItem/SearchItem.vue';
import { getCurrentInstance } from 'vue';
import * as useTableHook from '@/hooks/useTableHook';

const { proxy } = getCurrentInstance();

const {
  tableIsLoading,
  tablePage,
  tableLimit,
  tableTotal,
  tableDataList,
  searchForm,
  getTableDataFetch,
  onTableCurPaginationChangeEvt,
  resetSearchForm,
  handleTableItemDelete
} = useTableHook.useBaseTableHook({
  searchForm: { keyword: '' },
  getTableDataApi: proxy.$api.getManagerListApi,
  deleteApi: proxy.$api.deleteNoticeApi
});

getTableDataFetch();

</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
