<template>
  <div>
    <el-drawer v-model="drawerVisible" :title="drawerTitle" size="60%">
      <el-form :model="searchForm">
        <el-form-item label="时间选择">
          <el-radio-group v-model="searchForm.type">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="today">今天</el-radio-button>
            <el-radio-button label="yesterday">昨天</el-radio-button>
            <el-radio-button label="last7days">最近7天</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="开始日期">
          <el-date-picker v-model="searchForm.starttime" type="date" value-format="YYYY-MM-DD" placeholder="开始日期" />
        </el-form-item>

        <el-form-item label="结束日期">
          <el-date-picker v-model="searchForm.endtime" type="date" value-format="YYYY-MM-DD" placeholder="结束日期" />
        </el-form-item>

        <el-form-item label="用户类型">
          <el-radio-group v-model="searchForm.level">
            <el-radio-button :label="0">全部</el-radio-button>
            <el-radio-button :label="1">一级推广</el-radio-button>
            <el-radio-button :label="2">二级推广</el-radio-button>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="getTableData(1)">搜素</el-button>
          <el-button @click="resetSearchForm">重置</el-button>
        </el-form-item>
      </el-form>
          
      <el-table v-loading="tableIsLoading" :data="tableDataList" border stripe>
        <template v-if="type == 'user'">
          <el-table-column label="UID" prop="id" width="90" align="center" />
          <el-table-column label="头像" width="100">
            <template #default="{ row }">
              <el-avatar :size="40" :src="row.avatar">
                <img
                  src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                />
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="用户信息" prop="username" align="center" /> 
          <el-table-column label="推广数量" prop="share_num" align="center" />
          <el-table-column label="推广订单数量" prop="share_order_num" align="center" />
          <el-table-column label="绑定时间" prop="create_time" align="center" />
        </template>
        
        <template v-else>
          <el-table-column label="订单号" prop="order.no" align="center" />
          <el-table-column label="用户名|昵称|手机" width="280">
            <template #default="{ row }">
              <div v-if="!row.order.user">该用户已被删除</div>
              <div v-else>
                {{ row.order.user.username || '' }} | {{ row.order.user.nickname || '' }} | {{ row.order.user.phone || '' }}
              </div>
            </template>
          </el-table-column>  
          <el-table-column label="时间" prop="create_time" align="center" />
          <el-table-column label="返佣金额" prop="commission" align="center" /> 
        </template>
      </el-table>

      <el-pagination
        v-model:current-page="tablePage"
        v-model:page-size="tableLimit"
        class="mt-6 flex items-center justify-center"
        background
        layout="prev, pager, next" 
        :total="tableTotal"
        @current-change="onTableCurPaginationChangeEvt"
      />
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, ref, getCurrentInstance } from 'vue';
import * as useTableHook from '@/hooks/useTableHook';

const { proxy } = getCurrentInstance();

const props = defineProps({
  type: { type: String, default: 'user' }
});

const drawerTitle = computed(() => {
  return props.type == 'user' ? '推广人列表' : '推广订单列表';
});


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
  getTableDataApi: (() => (props.type == 'user' ? proxy.$api.getDistributionListApi : proxy.$api.getDistributionOrderListApi))(),
  searchForm: {
    level: 0,
    user_id: 0,
    type: 'all',
    starttime: null,
    endtime: null
  },
});

const drawerVisible = ref(false);

/**
 * 打开弹窗
 */
const openDrawer = id => {
  searchForm.user_id = id;
  getTableData();
  drawerVisible.value = true;
};

defineExpose({
  openDrawer
});
</script>

<style lang="scss" scoped>

</style>
