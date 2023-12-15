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
          <SearchItem label="收货人">
            <el-input v-model="searchForm.name" clearable placeholder="收货人" />
          </SearchItem>

          <SearchItem label="手机号">
            <el-input v-model="searchForm.phone" clearable placeholder="手机号" />
          </SearchItem>

          <SearchItem label="开始日期">
            <el-date-picker v-model="searchForm.starttime" type="date" value-format="YYYY-MM-DD" placeholder="开始日期" />
          </SearchItem>
          <SearchItem label="结束日期">
            <el-date-picker v-model="searchForm.endtime" type="date" value-format="YYYY-MM-DD" placeholder="结束日期" />
          </SearchItem>
        </template>
      </SearchWrap>
      
      <!-- 头部 -->
      <TableHeader btn-list="refresh, delete, download" title="订单" @downloadEvt="openDownExportDrawer" @refreshEvt="getTableData(tablePage)" @deleteEvt="handleBatchTableItemDelete" />
      
      <!-- 表格数据 -->
      <el-table v-loading="tableIsLoading" :data="tableDataList" border stripe @selection-change="handleTableSelectionChangeEvt">
        <el-table-column type="selection" width="55" />

        <el-table-column label="商品">
          <template #default="{ row }">
            <div class="flex text-sm">
              <div class="flex-1">
                <p>订单号:</p>
                <small>{{ row.no }}</small>
              </div>
              <div>
                <p>下单时间:</p>
                <small>{{ row.create_time }}</small>
              </div>
            </div>
            <div v-for="(item, index) in row.order_items" :key="index" class="flex items-center">
              <el-image :src="item.goods_item ? item.goods_item.cover : ''" fit="cover" :lazy="true" style="width: 50px;height: 50px;" />
              <p class=" text-blue-400 pl-2">
                {{ item.goods_item ? item.goods_item.title : '商品已被删除' }}
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="total_price" label="实际付款" align="center" />

        <el-table-column label="买家信息" align="center">
          <template #default="{ row }">
            <div class="text-gray-500">
              {{ row.user.nickname || row.user.username }}
              <p class=" text-xs">用户ID: {{ row.user.id }}</p>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="交易状态" align="center">
          <template #default="{ row }">
            <div>
              <el-tag v-if="row.payment_method == 'wechat'" type="success" size="small">微信支付</el-tag>
              <el-tag v-else-if="row.payment_method == 'alipay'" size="small">支付宝支付</el-tag>
              <el-tag v-else type="info" size="small">未支付</el-tag>
            </div>
            <div>
              <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{ row.ship_data ? '已发货' : '未发货' }}</el-tag>
            </div>
            <div>
              <el-tag :type="row.ship_status == 'received' ? 'success' : 'info'" size="small">{{ row.ship_status == 'received' ? '已收货' : '未收货' }}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="openOrderDetailDrawer(row)">订单详情</el-button>
            <el-button v-if="searchForm.tab === 'noship'" size="small" type="primary">订单发货</el-button>
            <el-button v-if="searchForm.tab === 'refunding'" size="small" type="success" @click="handleRefund(row.id, 1)">同意退款</el-button>
            <el-button v-if="searchForm.tab === 'refunding'" size="small" type="danger" @click="handleRefund(row.id, 0)">拒绝退款</el-button>
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

    <!-- 导出 弹窗 -->
    <ExportDrawer ref="exportDrawerRef" :tabs="tabbars" />
    <!-- 详情 弹窗 -->
    <DetailDrawer ref="detailDrawerRef" :order-detail="orderDetail" @reloadDataEvt="getTableData(tablePage)" />
  </div>
</template>

<script setup>
import TableHeader from '@/components/TableHeader/TableHeader.vue';
import SearchWrap from '@/components/SearchWrap/SearchWrap.vue';
import SearchItem from '@/components/SearchItem/SearchItem.vue';
import ExportDrawer from './components/ExportDrawer/ExportDrawer.vue';
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
  tableRef,
  selectTabItemIds,
  searchForm,
  resetSearchForm,
  getTableData,
  onTableCurPaginationChangeEvt,
  handleTableSelectionChangeEvt,
  handleBatchTableItemDelete,
} = useTableHook.useBaseTableHook({
  searchForm: {
    tab: 'all',
    no: null,
    starttime: null,
    endtime: null,
    name: null,
    phone: null
  },
  getTableDataApi: proxy.$api.getOrderLisApi,
  batchDeleteApi: proxy.$api.batchDeleteOrderApi,
});


// tab 标签页
const tabbars = [
  { key: 'all', name: '全部' },
  { key: 'nopay', name: '待支付' },
  { key: 'noship', name: '待发货' },
  { key: 'shiped', name: '待收货' },
  { key: 'received', name: '已收货' },
  { key: 'finish', name: '已完成' },
  { key: 'closed', name: '已关闭' },
  { key: 'refunding', name: '退款中' }
];

getTableData();

/**
 * tab 改变时触发
 */
const onTabChangeEvt = activeTabName => {
  console.log(activeTabName);
  getTableData();
};

const exportDrawerRef = ref(null);
/**
 * 打开导出 drawer
 */
const openDownExportDrawer = () => {
  exportDrawerRef.value.openExportDrawer();
};

const detailDrawerRef = ref(null);
const orderDetail = ref(null);
/**
 * 打开订单详情 drawer
 */
const openOrderDetailDrawer = tableItem => {
  orderDetail.value = tableItem;
  detailDrawerRef.value.openDetailDrawer();
};

// 同意/拒绝退款
const handleRefund = (orderId, agree) => {
  (agree ? proxy.$commonUtil.elMsgBoxConfirm('是否要同意该订单退款') : proxy.$commonUtil.elMsgBoxPrompt('请输入拒绝的理由'))
  .then(( { value } ) => {
    let param = { agree };
    if (!agree) param.disagree_reason = value;

    proxy.$api.refundOrderApi(orderId, param)
    .then(res => {
      getTableData();
      proxy.$commonUtil.elNotify('操作成功');
    });
  });
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
