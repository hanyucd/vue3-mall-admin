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
              <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </SearchItem>
        </template>
      </SearchWrap>
      
      <!-- 头部 -->
      <TableHeader btn-list="create, refresh, delete" title="商品" @createEvt="openFormDrawer" @refreshEvt="getTableData(tablePage)" @deleteEvt="handleBatchTableItemDelete">
        <el-button v-if="searchForm.tab == 'delete'" type="warning" @click="handleMultiRestore">恢复商品</el-button>

        <el-popconfirm v-if="searchForm.tab == 'delete'" title="是否彻底删除该商品?" width="170" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleMultiDestroy">
          <template #reference>
            <el-button type="danger">彻底删除</el-button>
          </template>
        </el-popconfirm>
        
        <el-button v-if="searchForm.tab == 'all' || searchForm.tab == 'off'" @click="handleGoodsPutaway(1)">上架</el-button>
        <el-button v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'" @click="handleGoodsPutaway(0)">下架</el-button>
      </TableHeader>
      
      <!-- 表格数据 -->
      <el-table v-loading="tableIsLoading" :data="tableDataList" border stripe @selection-change="handleTableSelectionChangeEvt">
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
              <el-button class="px-1" size="small" type="primary" @click="handleEditTableItem(scope.row)">修改</el-button>
              <!-- <el-button class="px-1" size="small" :type="isSetSku(scope.row)" :loading="scope.row.skusLoading" @click="handleSetGoodsSkus(scope.row)">商品规格</el-button> -->
              <el-button class="px-1" size="small" :type="scope.row.goods_banner.length ? 'primary' : 'danger'" :loading="scope.row.bannersLoading" @click="openUpdateBannerDrawer(scope.row)">设置轮播图</el-button>
              <el-button class="px-1" size="small" :type="!(scope.row.content) ? 'danger' : 'primary'" :loading="scope.row.contentLoading" @click="handleSetGoodsContent(scope.row)">商品详情</el-button>
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
          <el-form-item label="商品名称" prop="title">
            <el-input v-model="tableFormData.title" placeholder="请输入商品名称" class="mr-5" />
          </el-form-item>

          <el-form-item label="商品分类" prop="category_id">
            <el-select v-model="tableFormData.category_id" placeholder="请选择商品分类" clearable filterable>
              <el-option label="--请选择商品分类--" value="--" disabled />
              <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="商品封面" prop="cover">
            <ChooseImage v-model="tableFormData.cover" />
          </el-form-item>

          <el-form-item label="描述" prop="desc">
            <el-input v-model="tableFormData.desc" placeholder="请输入商品描述" type="textarea" :rows="4" class="mr-5" />
          </el-form-item>
          
          <el-form-item label="商品单位" prop="unit">
            <el-input v-model="tableFormData.unit" placeholder="请输入商品单位" class="mr-5" />
          </el-form-item>
          
          <el-form-item label="总库存" prop="stock">
            <el-input v-model="tableFormData.stock" type="number" style="max-width: 300px">
              <template #append>{{ tableFormData.unit }}</template>
            </el-input>
          </el-form-item>

          <el-form-item label="库存预警" prop="min_stock">
            <el-input v-model="tableFormData.min_stock" type="number" style="max-width: 300px">
              <template #append>{{ tableFormData.unit }}</template>
            </el-input>
          </el-form-item>

          <el-form-item label="最低销售价" prop="min_price">
            <el-input v-model="tableFormData.min_price" type="number" style="max-width: 300px">
              <template #append>元</template>
            </el-input>
          </el-form-item>

          <el-form-item label="最低原价" prop="min_oprice">
            <el-input v-model="tableFormData.min_oprice" type="number" style="max-width: 300px">
              <template #append>元</template>
            </el-input>
          </el-form-item>

          <el-form-item label="是否上架" prop="status">
            <el-radio-group v-model="tableFormData.status">
              <el-radio :label="0" border>存放仓库</el-radio>
              <el-radio :label="1" border>立即上架</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="库存显示" prop="stock_display">
            <el-radio-group v-model="tableFormData.stock_display">
              <el-radio :label="0" border>隐藏</el-radio>
              <el-radio :label="1" border>显示</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </FormDrawer>
    </el-card>

    <BannerDrawer ref="bannerDrawerRef" @reloadDataEvt="getTableData(tablePage)" />
  </div>
</template>

<script setup>
import TableHeader from '@/components/TableHeader/TableHeader.vue';
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import SearchWrap from '@/components/SearchWrap/SearchWrap.vue';
import SearchItem from '@/components/SearchItem/SearchItem.vue';
import ChooseImage from '@/components/ChooseImage/ChooseImage.vue';
import BannerDrawer from './components/BannerDrawer/BannerDrawer.vue';

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
  switchChange,
  getTableData,
  onTableCurPaginationChangeEvt,
  handleTableSelectionChangeEvt,
  handleTableItemDelete,
  handleBatchTableItemDelete,
} = useTableHook.useBaseTableHook({
  searchForm: {
    title: '',
    tab: 'all',
    category_id: null
  },
  getTableDataApi: proxy.$api.getGoodsLisApi,
  updateStatusApi: proxy.$api.updateManagerStatusApi,
  deleteApi: proxy.$api.deleteManagerApi,
  batchDeleteApi: proxy.$api.batchDeleteGoodsApi,
  // 回调函数
  onGetListSuccess: tableDataRes => {
    tableDataList.value = tableDataRes.list.map(item => {
      item.bannersLoading = false;
      item.contentLoading = false;
      item.skusLoading = false;
      return item;
    });
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
    title: '',
    category_id: null,
    cover: '',
    desc: '',
    unit: '件',
    stock: 0,
    min_stock: 0,
    status: 1,
    stock_display: 1,
    min_price: 0,
    min_oprice: 0
  },
  formRules: {
    title: [ { required: true, message: '请填写商品名称', trigger: 'blur' } ],
  },
  createApi: proxy.$api.createGoodsApi,
  updateApi: proxy.$api.updateGoodsApi,
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

// 商品分类列表
const categoryList = ref([]);
proxy.$api.getGoodsCategoryLisApi().then(res => {
  categoryList.value = res.data;
});

// 处理多选行为 | 复用函数
const _handleMultiAction = (api, params, isClear = false) => {
  return new Promise((resolve, reject) => {
    tableIsLoading.value = true;
    api(params).then(res => {
      if (isClear) {
        tableRef.value && tableRef.value.clearSelection();
        selectTabItemIds.value = [];
      }
      resolve(res);
      getTableData(tablePage.value);
    }).finally(() => {
      tableIsLoading.value = false;
    });
  });
};

/**
 * 处理商品上下架
 */
const handleGoodsPutaway = status => {
  if (!selectTabItemIds.value.length) return proxy.$commonUtil.elNotify(`请先选择商品项`, 'warning');

  _handleMultiAction(proxy.$api.batchUpdateGoodsStatusApi, { ids: selectTabItemIds.value, status }, true).then(res => {
    proxy.$commonUtil.elNotify(status ? `上架成功` : '下架成功');
  });
};

const bannerDrawerRef = ref(null);
/**
 * 打开轮播图 drawer
 */
const openUpdateBannerDrawer = tableItem => {
  bannerDrawerRef.value.openBannerDrawer(tableItem);
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
