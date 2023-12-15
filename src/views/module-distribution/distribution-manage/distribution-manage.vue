<template>
  <div>
    <DataCard />

    <el-card shadow="never" class="border-0">
      <!-- 搜索 -->
      <SearchWrap :form-model="searchForm" @searchEvt="getTableData" @resetEvt="resetSearchForm">
        <search-item label="时间选择">
          <el-radio-group v-model="searchForm.type">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="today">今天</el-radio-button>
            <el-radio-button label="yesterday">昨天</el-radio-button>
            <el-radio-button label="last7days">最近7天</el-radio-button>
          </el-radio-group>
        </search-item>
        <template #more>
          <search-item label="开始日期">
            <el-date-picker v-model="searchForm.starttime" type="date" value-format="YYYY-MM-DD" placeholder="开始日期" />
          </search-item>
          <search-item label="结束日期">
            <el-date-picker v-model="searchForm.endtime" type="date" value-format="YYYY-MM-DD" placeholder="结束日期" />
          </search-item>
          <search-item label="关键词">
            <el-input v-model="searchForm.keyword" clearable placeholder="请输入手机号/邮箱/用户名称搜索" style="width: 80%;" />
          </search-item>
        </template>
      </SearchWrap>
      
      <TableHeader btn-list="refresh" @refreshEvt="getTableData(tablePage)" />
      
      <!-- 表格数据 -->
      <el-table v-loading="tableIsLoading" :data="tableDataList" border stripe>
        <el-table-column label="ID" prop="id" width="90" align="center" />
        <el-table-column label="头像" width="100">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar">
              <img src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" />
            </el-avatar>
          </template>
        </el-table-column>
  
        <el-table-column label="用户信息" width="180">
          <template #default="{ row }">
            <div class="text-gray-500 text-sm">
              <p>用户：{{ row.username || '' }}</p>
              <p>昵称：{{ row.nickname || '' }}</p>
              <p>姓名：{{ row.user_info?.name || '' }}</p>
              <p>电话：{{ row.phone || '' }}</p>
            </div>
          </template>
        </el-table-column>
  
        <el-table-column label="推广用户数量" prop="share_num" align="center" />
        <el-table-column label="订单数量" prop="share_order_num" align="center" />
        <el-table-column label="订单金额" prop="order_price" align="center" />
        <el-table-column label="账户佣金" prop="commission" align="center" />
        <el-table-column label="已提现金额" prop="cash_out_price" align="center" />
        <el-table-column label="提现次数" prop="cash_out_time" align="center" />
        <el-table-column label="未提现金额" prop="no_cash_out_price" align="center" />
                  
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="dataDrawerOpen(row.id)"> 推广人 </el-button>
            <el-button size="small" type="primary" @click="dataDrawerOpen(row.id, 'order')"> 推广订单 </el-button>
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


    <!-- 推广人 -->
    <DetailDrawer ref="dataDrawerRef" type="user" />
    <!-- 推广订单 -->
    <DetailDrawer ref="orderDataDrawerRef" type="order" />
  </div>
</template>

<script setup>
import TableHeader from '@/components/TableHeader/TableHeader.vue';
import SearchWrap from '@/components/SearchWrap/SearchWrap.vue';
import SearchItem from '@/components/SearchItem/SearchItem.vue';
import DataCard from './components/DataCard/DataCard.vue';
import DetailDrawer from './components/DetailDrawer/DetailDrawer.vue';

import { ref, getCurrentInstance } from 'vue';
import * as useTableHook from '@/hooks/useTableHook';

const { proxy } = getCurrentInstance();

const {
  tableIsLoading,
  tablePage,
  tableLimit,
  tableTotal,
  tableDataList,
  searchForm,
  resetSearchForm,
  getTableData,
  onTableCurPaginationChangeEvt,
} = useTableHook.useBaseTableHook({
  searchForm: {
    keyword: '',
    type: 'all',
    starttime: null,
    endtime: null
  },
  getTableDataApi: proxy.$api.getDistributionListApi,
});

getTableData();

const dataDrawerRef = ref(null);
const orderDataDrawerRef = ref(null);
const dataDrawerOpen = (id, type = 'user') => {
  type == 'user' ? dataDrawerRef.value.openDrawer(id) : orderDataDrawerRef.value.openDrawer(id);
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
