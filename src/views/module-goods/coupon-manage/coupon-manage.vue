<template>
  <el-card shadow="never" class="border-0">
    <TableHeader @createEvt="openFormDrawer" @refreshEvt="getTableData(tablePage)" />
    
    <!-- 表格数据 -->
    <el-table v-loading="tableIsLoading" :data="tableDataList" border stripe>
      <el-table-column label="优惠券名称" width="320">
        <template #default="{ row }">
          <div class="border border-dashed py-2 px-4 rounded" :class="row.statusText == '领取中' ? 'coupon-active' : 'coupon-inactive'">
            <h5 class="font-bold text-md">{{ row.name }} </h5>
            <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="statusText" label="状态" />

      <el-table-column label="优惠">
        <template #default="{ row }">
          <div>{{ row.type == 0 ? `满减 ￥${ row.value }` : `折扣 ${ row.value }折` }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="min_price" label="最低使用价格" />
      
      <el-table-column prop="desc" label="描述" />

      <el-table-column prop="order" label="排序" />

      <el-table-column prop="total" label="发放数量" />

      <el-table-column prop="used" label="已使用" />

      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button v-if="scope.row.statusText == '未开始'" size="small" type="primary" @click="handleEditTableItem(scope.row)">修改</el-button>

          <el-popconfirm v-if="scope.row.statusText == '领取中'" title="是否让此优惠券失效?" width="160" confirm-button-text="失效" cancel-button-text="取消" @confirm="switchChange(0, scope.row)">
            <template #reference>
              <el-button size="small" type="warning">失效</el-button>
            </template>
          </el-popconfirm>
          
          <el-popconfirm title="是否删除此优惠券?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleTableItemDelete(scope.row)">
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

    <!-- 表单Drawer -->
    <FormDrawer ref="formDrawerRef" :title="formDrawerTitle" destroy-on-close @formDrawerSubmitEvt="onFormDrawerSubmitEvt" @formDrawerCloseEvt="onFormDrawerCloseEvt">
      <el-form ref="formRef" :model="tableFormData" :rules="tableFormRules" label-width="120px" size="default" class="flex flex-col min-h-full">
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="tableFormData.name" placeholder="优惠券名称" />
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="tableFormData.type">
            <el-radio :label="0" border>满减</el-radio>
            <el-radio :label="1" border>折扣</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="面值" prop="value">
          <el-input v-model="tableFormData.value" placeholder="面值">
            <template #append>{{ tableFormData.type ? '折' : '元' }}</template>
          </el-input>
        </el-form-item>

        <el-form-item label="发行量" prop="total">
          <el-input-number v-model="tableFormData.total" :min="0" :max="10000" />
        </el-form-item>

        <el-form-item label="最低使用价格" prop="min_price">
          <el-input v-model="tableFormData.min_price" placeholder="最低使用价格" type="number">
            <template #append>元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="选择时间">
          <el-date-picker
            v-model="dateTimeRanger"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetimerange"
            :editable="false"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>

        <el-form-item label="排序" prop="order">
          <el-input-number v-model="tableFormData.order" :min="0" :max="10000" />
        </el-form-item>

        <el-form-item label="描述" prop="desc">
          <el-input v-model="tableFormData.desc" placeholder="描述" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import TableHeader from '@/components/TableHeader/TableHeader.vue';
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import { computed, getCurrentInstance } from 'vue';
import * as useTableHook from '@/hooks/useTableHook';

const { proxy } = getCurrentInstance();

// 加工优惠券状态
const _formatStatus = row => {
  let s = '领取中';
  let start_time = (new Date(row.start_time)).getTime();
  let now = (new Date()).getTime();
  let end_time = (new Date(row.end_time)).getTime();
  if (start_time > now) {
    s = '未开始';
  } else if (end_time < now) {
    s = '已结束';
  } else if (row.status == 0) {
    s = '已失效';
  }
  return s;
};

const {
  tableIsLoading,
  tablePage,
  tableLimit,
  tableTotal,
  tableDataList,
  getTableData,
  onTableCurPaginationChangeEvt,
  handleTableItemDelete,
  switchChange,
} = useTableHook.useBaseTableHook({
  getTableDataApi: proxy.$api.getCouponLisApi,
  deleteApi: proxy.$api.deleteCouponApi,
  updateStatusApi: proxy.$api.updateCouponStatusApi,
  onGetListSuccess: tableDataRes => {
    tableDataList.value = tableDataRes.list.map(item => {
      // 转化优惠券状态
      item.statusText = _formatStatus(item);
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
    name: '',
    type: 0,
    value: 0,
    total: 100,
    min_price: 0,
    start_time: null,
    end_time: null,
    order: 50,
    desc: ''
  },
  formRules: {
    name: [{ required: true, message: '请填写优惠券名称', trigger: 'blur' }],
  },
  createApi: proxy.$api.createCouponApi,
  updateApi: proxy.$api.updateCouponApi,
  tablePage,
  getTableData,
  beforeSubmit: data => {
    console.log('beforeSubmit', data);
    // 字符串时间 转换成 时间戳
    if (typeof data.start_time != 'number') {
      data.start_time = new Date(data.start_time).getTime();
      data.end_time = new Date(data.end_time).getTime();
    }
    return data;
  }
});

// 时间范围
const dateTimeRanger = computed({
  get() {
    return tableFormData.start_time && tableFormData.end_time ? [tableFormData.start_time, tableFormData.end_time] : [];
  },
  set(newVal) {
    console.log(newVal);
    tableFormData.start_time = newVal[0];
    tableFormData.end_time = newVal[1];
  }
});
// 获取公告数据
getTableData();
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
