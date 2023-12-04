<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex items-center justify-between text-sm">
        <span>订单统计</span>
        <div>
          <el-check-tag v-for="(item, index) in tagTypeOptions" :key="index" :checked="curTagType == item.type" size="small" color="red" class="ml-2" @click="changeTagType(item.type)">
            {{ item.value }}
          </el-check-tag>
        </div>
      </div>
    </template>

    <!-- 条形图 -->
    <div id="echarts-bar" ref="chartBarRef" style="height: 300px; width: 100%;"></div>
  </el-card>
</template>

<script setup>
import * as echarts from 'echarts';
import { useResizeObserver } from '@vueuse/core';
import { ref, shallowRef, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const curTagType = ref('week');
const tagTypeOptions = [
  { type: 'month', value: '近1个月' },
  { type: 'week', value: '近1周' },
  { type: 'hour', value: '近24小时' }
];

const chartBarRef = ref(null); // 图表节点引用
let barChart = shallowRef(null); // 初始化一个 echarts 实例

onMounted(() => {
  barChart.value = echarts.init(chartBarRef.value);

  _getHomeEchartData();

  // 窗口变化重置
  useResizeObserver(chartBarRef, entries => {
    barChart.value.resize();
  });
  // window.addEventListener('resize', function () {
  //   barChart.value.resize();
  // });
});

// 在组件实例被卸载之前 销毁图表实例
onBeforeUnmount(() => barChart.value && echarts.dispose(barChart.value));

/**
 * 获取图表数据
 */
const _getHomeEchartData = (type = 'week') => {
  barChart.value.showLoading();

  proxy.$api.getHomeStatistics3Api({ type }).then(res => {
    const { data: orderData } = res;
    _setBarLineEcharts(orderData);
  });
};

// 切换图表tag
const changeTagType = tagType => {
  curTagType.value = tagType;
  _getHomeEchartData(curTagType.value);
};

/**
 * 设置条形图表
 */
const _setBarLineEcharts = orderData => {
  const barOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: orderData.x
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: orderData.y,
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  };

  barChart.value.setOption(barOption);
  barChart.value.hideLoading();
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
