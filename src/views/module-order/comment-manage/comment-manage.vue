<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 -->
    <SearchWrap :form-model="searchForm" @searchEvt="getTableData" @resetEvt="resetSearchForm">
      <SearchItem label="关键词">
        <el-input v-model="searchForm.title" clearable placeholder="请输入关键词" />
      </SearchItem>
    </SearchWrap>
    
    <TableHeader @createEvt="openFormDrawer" @refreshEvt="getTableData(tablePage)" />
    
    <!-- 表格数据 -->
    <el-table v-loading="tableIsLoading" default-expand-all :data="tableDataList" border stripe>
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="flex pl-18">
            <el-avatar :size="50" :src="row.user.avatar" fit="fill" class="mr-3" />
            <div class="flex-1">
              <h6 class="flex items-center">
                {{ row.user.nickname || row.user.username }}
                <small class=" text-gray-400 ml-2">{{ row.review_time }}</small>
                <el-button v-if="!row.textareaEdit && !row.extra" size="small" class="ml-auto" @click="openTextarea(row)">
                  回复
                </el-button>
              </h6>
              {{ row.review.data }}
              <div class="py-2">
                <el-image v-for="(item,index) in row.review.image" :key="index" :src="item" fit="cover" :lazy="true" style="width: 100px;height: 100px;" class="rounded" />
              </div>

              <div v-if="row.textareaEdit">
                <el-input v-model="textarea" placeholder="请输入评价内容" type="textarea" :rows="2" />
                <div class="py-2">
                  <el-button type="primary" size="small" @click="replyGoodsComment(row)">回复</el-button>
                  <el-button size="small" class="ml-2" @click="row.textareaEdit = false">取消</el-button>
                </div>
              </div>

              <template v-else>
                <div v-for="(item,index) in row.extra" :key="index" class="mt-3 bg-gray-100 p-3 rounded">
                  <h6 class="flex font-bold">
                    客服
                    <el-button type="info" size="small" class="ml-auto" @click.stop="openTextarea(row, item.data)">修改</el-button>
                  </h6>
                  <p>{{ item.data }}</p>
                </div>
              </template>
            </div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="id" label="ID" align="center" width="70" />

      <el-table-column label="商品" width="300">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image :src="row.goods_item ? row.goods_item.cover : ''" fit="fill" :lazy="true" style="width: 50px;height: 50px;" class="rounded" />
            <div class="ml-2 leading-normal">
              <h3>{{ row.goods_item?.title ?? '商品已被删除' }}</h3>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="评价信息">
        <template #default="{ row }">
          <div>
            <p>用户: {{ row.user.nickname || row.user.username }}</p>
            <p class="flex items-center">
              <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
            </p>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="create_time" label="评价时间" align="center" />

      <el-table-column label="是否显示" width="170">
        <template #default="{ row }">
          <el-switch :disabled="row.super == 1" :model-value="row.status" :active-value="1" :inactive-value="0" :loading="row.isLoading" @change="switchChange($event, row)" />
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
import TableHeader from '@/components/TableHeader/TableHeader.vue';
import SearchWrap from '@/components/SearchWrap/SearchWrap.vue';
import SearchItem from '@/components/SearchItem/SearchItem.vue';

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
  switchChange,
  getTableData,
  onTableCurPaginationChangeEvt,
} = useTableHook.useBaseTableHook({
  searchForm: { title: '' },
  getTableDataApi: proxy.$api.getGoodsCommentLisApi,
  updateStatusApi: proxy.$api.updateGoodsCommentStatusApi,
  // 回调函数
  onGetListSuccess: tableDataRes => {
    tableDataList.value = tableDataRes.list.map(item => {
      item.isLoading = false;
      item.textareaEdit = false;
      return item;
    });
    tableTotal.value = tableDataRes.totalCount;
  },
});

getTableData();

const textarea = ref('');
const openTextarea = (row, data = '')=>{
  textarea.value = data;
  row.textareaEdit = true;
};

/**
 * 回复商品评论
 */
const replyGoodsComment = row => {
  if (!textarea.value) return proxy.$commonUtil.elNotify('回复内容不能为空', 'error');

  proxy.$api.replyGoodsCommentApi(row.id, { data: textarea.value }).then(res => {
    row.textareaEdit = false;
    proxy.$commonUtil.elNotify('回复成功');
    getTableData();
  });
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
