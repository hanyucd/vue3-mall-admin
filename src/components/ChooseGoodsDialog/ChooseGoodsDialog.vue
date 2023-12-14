<template>
  <el-dialog v-model="dialogVisible" title="商品选择" :destroy-on-close="true" width="80%" top="5vh">
    <el-card shadow="never" class="h-[50vh] border-0 h-full">
      <!-- 搜索 -->
      <SearchWrap :form-model="searchForm" :is-show-reset="false" @searchEvt="getTableData">
        <SearchItem label="关键词">
          <el-input v-model="searchForm.title" clearable placeholder="请输入商品名称" />
        </SearchItem>
      </SearchWrap>

      <el-table ref="tableRef" v-loading="tableIsLoading" :data="tableDataList" stripe @selection-change="handleTableSelectionChangeEvt">
        <el-table-column type="selection" width="55" />

        <el-table-column label="商品">
          <template #default="{ row }">
            <h5 class="font-md font-bold text-dark-300">{{ row.title }}</h5>
            <div class="flex items-center">
              <el-image class="mr-3 rounded" :src="row.cover" fit="cover" :lazy="true" style="width: 50px;height: 50px;" />
              <div class="flex-1">
                <p class="text-gray-400 text-xs mb-1">分类: {{ row.category ? row.category.name : '未分类' }}</p>
                <p class="text-gray-400 text-xs">创建时间: {{ row.create_time }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="stock" label="总库存" width="130" align="center" />

        <el-table-column label="价格(元)" width="350" align="center">
          <template #default="{ row }">
            <span class="text-rose-500 text-sm font-bold">￥{{ row.min_price }}</span>
            <el-divider direction="vertical" />
            <span class="text-gray-500 text-sm">￥{{ row.min_oprice }}</span>
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
    
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRelation">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import SearchWrap from '@/components/SearchWrap/SearchWrap.vue';
import SearchItem from '@/components/SearchItem/SearchItem.vue';
import * as useTableHook from '@/hooks/useTableHook';

import { ref, getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
const dialogVisible = ref(false);

const {
  tableIsLoading,
  tablePage,
  tableLimit,
  tableTotal,
  tableDataList,
  tableRef,
  selectTabItemIds,
  searchForm,
  getTableData,
  onTableCurPaginationChangeEvt,
  handleTableSelectionChangeEvt,
} = useTableHook.useBaseTableHook({
  searchForm: {
    title: '',
  },
  getTableDataApi: proxy.$api.getGoodsLisApi,
});

getTableData();

// 回调函数
const callBackFunction = ref(null);
// 打开关联 dialog
const openChooseGoodsDialog = callBackFunc => {
  callBackFunction.value = callBackFunc;
  dialogVisible.value = true;
};

// 提交商品关联
const submitRelation = () => {
  console.log(selectTabItemIds);
  if (typeof callBackFunction.value == 'function') {
    // 把数据回传回去
    callBackFunction.value(selectTabItemIds.value);
    dialogVisible.value = false;
  }
};

defineExpose({
  openChooseGoodsDialog
});
</script>

<style lang="scss" scoped>

</style>
