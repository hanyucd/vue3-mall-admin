<template>
  <div>
    <!-- 面板骨架屏 -->
    <el-row v-permission="['getStatistics1,GET']" :gutter="20">
      <template v-if="!panelsDataList.length">
        <el-col v-for="i in 4" :key="i" :span="6" :offset="0">
          <el-skeleton style="width: 100%" animated loading>
            <template #template>
              <el-card shadow="hover" class="border-0">
                <template #header>
                  <div class="flex items-center justify-between text-sm">
                    <el-skeleton-item variant="text" style="width: 50%" />
                    <el-skeleton-item variant="text" style="width: 10%" />
                  </div>
                </template>
                <el-skeleton-item variant="h3" style="width: 80%" />
                <el-divider />
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>
      
      <!-- 面板数据 -->
      <el-col v-for="(item, index) in panelsDataList" :key="index" :span="6" :offset="0">
        <el-card shadow="hover" class="border-0">
          <!-- card header -->
          <template #header>
            <div class="flex items-center justify-between text-sm">
              <span>{{ item.title }}</span>
              <el-tag size="default" effect="plain" :type="item.unitColor">{{ item.unit }}</el-tag>
            </div>
          </template>
          <!-- card body -->
          <span class="text-3xl font-bold text-gray-600">
            <!-- {{ item.value }} -->
            <NumCountTo :value="item.value" />
          </span>
          <el-divider />
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>{{ item.subTitle }}</span>
            <span>{{ item.subValue }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <NavCardList />

    <el-row :gutter="20" class="mt-5">
      <el-col :span="12" :offset="0">
        <OrderChart />
      </el-col>
      <el-col :span="12" :offset="0">
        <RemindCard title="店铺及商品提示" tip="店铺及商品提示" :res-data="goodsDataList" />
        <RemindCard class=" mt-4" title="交易提示" tip="需要立即处理的订单" :res-data="orderDataList" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import NumCountTo from '@/components/NumCountTo/NumCountTo.vue';
import NavCardList from './components/NavCardList/NavCardList.vue';
import OrderChart from './components/OrderChart/OrderChart.vue';
import RemindCard from './components/RemindCard/RemindCard.vue';
import { ref, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
// 面板数据
const panelsDataList = ref([]);
// 商品数据
const goodsDataList = ref([]);
// 订单数据
const orderDataList = ref([]);

// 获取首页统计数据-1
proxy.$api.getHomeStatistics1Api().then(res => {
  const { data: panelsData } = res;
  panelsDataList.value = panelsData.panels;
});

// 获取首页统计数据-2
proxy.$api.getHomeStatistics2Api().then(res => {
  const { data: remindData } = res;
  goodsDataList.value = remindData.goods;
  orderDataList.value = remindData.order;
});
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
