<template>
  <div>
    <el-row :gutter="20" class="mb-5">
      <template v-if="isLoading">
        <el-col v-for="i in 4" :key="i" :span="6" :offset="0">
          <el-card shadow="never">
            <el-skeleton style="width: 100%" animated loading class="flex items-center">
              <template #template>
                <el-skeleton-item variant="image" style="width: 40px; height: 40px" />
                <div class="ml-3 flex-1 flex flex-col">
                  <el-skeleton-item variant="text" style="width: 30px" />
                  <el-skeleton-item variant="text" style="width: 40%" class="mt-2" />
                </div>
              </template>
            </el-skeleton>
          </el-card> 
        </el-col>
      </template>
      
      <el-col v-for="(item, index) in list" :key="index" :span="6" :offset="0">
        <el-card shadow="never">
          <div class="flex items-center">
            <div :class="item.color" class="text-white w-[40px] h-[40px] rounded-full flex items-center justify-center">
              <el-icon :size="20">
                <User v-if="index==0" />
                <ShoppingCart v-if="index==1" />
                <PriceTag v-if="index==2" />
                <Timer v-if="index==3" />
              </el-icon>
            </div>
            <div class="ml-3 ">
              <h2 class="text-lg font-bold leading-snug">{{ item.value }}</h2>
              <small class="text-xs text-gray-400">{{ item.label }}</small>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
// import {
//   get_statistics
// } from '~/api/distribution.js';

const { proxy } = getCurrentInstance();

const list = ref([]);
const isLoading = ref(false);

const getCardData = () => {
  isLoading.value = true;
  proxy.$api.getDistributionStatisticsApi().then(res => {
    list.value = res.data.panels;
    console.log(list.value);
  }).finally(() => {
    isLoading.value = false;
  });
};

getCardData();

</script>

<style lang="scss" scoped>

</style>
