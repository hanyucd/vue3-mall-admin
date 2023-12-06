<template>
  <el-card shadow="never" class="border-0">
    <div>新增按钮</div>
    
    <!-- 表格数据 -->
    <el-table v-loading="tableIsLoading" :data="tableDataList" border stripe>
      <el-table-column prop="title" label="公告标题" width="260" />
      
      <el-table-column prop="content" label="发布内容" />

      <el-table-column prop="create_time" label="发布时间" />

      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">修改</el-button>
          <el-popconfirm title="是否删除此公告?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
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
  </el-card>
</template>

<script setup>
import { reactive, getCurrentInstance } from 'vue';
import * as useTableHook from '@/hooks/useTableHook';

const { proxy } = getCurrentInstance();

const {
  tableIsLoading,
  tablePage,
  tableLimit,
  tableTotal,
  tableDataList,
  getTableDataFetch,
  onTableCurPaginationChangeEvt
} = useTableHook.useQueryTableHook({ getTableDataApi: proxy.$api.getNoticeListApi });

// 获取公告数据
getTableDataFetch();

</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
