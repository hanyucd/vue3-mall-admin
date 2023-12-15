<template>
  <el-drawer v-model="isShowExportDrawer" title="订单详情" size="50%" destroy-on-close :show-close="true">
    <el-card shadow="never" class="mb-3">
      <template #header>
        <strong class="text-sm">订单详情</strong>
      </template>

      <el-form label-width="90px">
        <el-form-item label="订单号：">
          {{ orderDetail.no }}
        </el-form-item>

        <el-form-item label="付款方式：">
          {{ paymentMethod(orderDetail.payment_method) }}
        </el-form-item>

        <el-form-item label="付款时间：">
          {{ paymentTime(orderDetail.paid_time) }}
        </el-form-item>
        
        <el-form-item label="创建时间：">
          {{ orderDetail.create_time }}
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="orderDetail.ship_data" shadow="never" class="mb-3">
      <template #header>
        <strong class="text-sm">发货信息</strong>
      </template>
      
      <el-form label-width="90px">
        <el-form-item label="物流公司：">
          {{ orderDetail.ship_data.express_company }}
        </el-form-item>

        <el-form-item label="运单号：">
          {{ orderDetail.ship_data.express_no }}
          <el-button text class="ml-4" type="primary" :loading="shipInfoLoading" @click="openShipInfo(orderDetail.id)">查看物流</el-button>
        </el-form-item>
        
        <el-form-item label="发货时间：">
          {{ paymentTime(orderDetail.ship_data.express_time) }}
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-if="orderDetail.order_items" shadow="never" class="mb-3">
      <template #header>
        <strong class="text-sm">商品信息</strong>
      </template>
      <div>
        <div v-for="(item, index) in orderDetail.order_items" :key="index" class="mb-2">
          <div class="flex ">
            <el-image :src="item.goods_item?.cover ?? ''" fit="cover" :lazy="true" style="width: 70px;height:70px;" class="rounded mr-3" />
            <div>
              <h3 class="text-sm mb-1">{{ item.goods_item?.title ?? '商品已被删除' }}</h3>
              <el-tag v-if="item.skus_type == 1 && item.goods_skus" type="info" class="mb-1">
                {{ skusTagCon(item.goods_skus.skus) }}
              </el-tag>
              <div class="flex text-sm text-gray-400"><span class=" font-bold text-red-400 ">￥{{ item.price }}</span><span class="px-2">x</span>{{ item.num }} </div>
            </div>
          </div>

          <div class="flex mt-3">
            <span class="text-gray-400">成交价：</span>
            <span class="pl-5 text-red-600 font-bold">￥{{ (item.price * item.num).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <el-card v-if="orderDetail.address" shadow="never" class="mb-3">
      <template #header>
        <strong class="text-sm">收货信息</strong>
      </template>

      <el-form label-width="90px">
        <el-form-item label="收货人：">
          {{ orderDetail.address.name }}
        </el-form-item>

        <el-form-item label="联系方式：">
          {{ orderDetail.address.phone }}
        </el-form-item>

        <el-form-item label="收货地址：">
          {{ orderDetail.address.province + ' ' + orderDetail.address.city + ' ' + orderDetail.address.district + ' ' + orderDetail.address.address }}
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="orderDetail.refund_status != 'pending'" shadow="never">
      <template #header>
        <div class="w-full flex items-center justify-between">
          <strong class="text-sm">退款信息</strong>
          <el-button text disabled>{{ refund_status }}</el-button>
        </div>
      </template>

      <el-form label-width="90px">
        <el-form-item label="退款理由：">
          {{ orderDetail.extra.refund_reason }}
        </el-form-item>
      </el-form>
    </el-card>
  </el-drawer>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from 'vue';

const props = defineProps({
  orderDetail: { type: Object, default: () => ({}) }
});

const isShowExportDrawer = ref(false); // 是否显示导出 drawer

// 支付方式
const paymentMethod = (text) => {
  switch (text) {
    case 'alipay':
      return '支付宝';
    case 'wechat':
      return '微信';
    default:
      return text;
  }
};

const paymentTime = time => {
  let date = new Date(time * 1000);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  return year + '-' + formatTime(month) + '-' + formatTime(day) + ' ' + formatTime(hour) + ':' + formatTime(minute) + ':' + formatTime(second); 
};

const formatTime = (time) => {
  return parseInt(time) < 10 ? '0' + time : time;
};

const skusTagCon = (obj) => {
  let arr = [];
  for (const key in obj) {
      arr.push(obj[key].value);
  }
  return arr.join(',');
};

const refund_status = computed(() => {
  const opt = {
    pending: '未退款',
    applied: '已申请，等待审核',
    processing: '退款中',
    success: '退款成功',
    failed: '退款失败'
  };
  return props.info.refund_status ? opt[props.info.refund_status] : '';
});

/**
 * 打开详情 drawer
 */
const openDetailDrawer = () => isShowExportDrawer.value = true;

defineExpose({
  openDetailDrawer
});
</script>

<style lang="scss" scoped>

</style>
