<template>
  <div class="slidebar-menu" :style="{ width: $store.state.isCollapseSidebarMenu ? '64px' : '250px' }">
    <el-menu
      class="el-menu-vertical"
      :default-active="$route.path"
      :collapse="$store.state.isCollapseSidebarMenu"
      :collapse-transition="false"
      unique-opened
      active-text-color="#6366f1"
      @select="onSidebarMenuSelectEvt"
    >
      <template v-for="(item, index) in menuList" :key="index">
        <!-- 含有二级菜单 -->
        <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
          <template #title>
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <!-- 二级菜单项 -->
          <el-menu-item v-for="(twoItem, twoIndex) in item.child" :key="twoIndex" :index="twoItem.frontpath">
            <el-icon>
              <component :is="twoItem.icon" />
            </el-icon>
            <span>{{ twoItem.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        
        <!-- 一级菜单 | 不含二级菜单 -->
        <el-menu-item v-else :index="item.frontpath">
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

// 侧边栏菜单列表
const menuList = computed(() => store.getters['userModule/sidebarMenuList']);

/**
 * 路由跳转
 */
const onSidebarMenuSelectEvt = (menuItemindex, indexPath, item, routeResult) => {
  router.push({ path: menuItemindex });
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
