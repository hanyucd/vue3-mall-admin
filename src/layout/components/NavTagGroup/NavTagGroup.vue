<template>
  <div class="nav-tag-group">
    <el-tabs v-model="activeNavTagTab" type="card" class="tag-tabs" @tab-change="onNavTagTabChangeEvt" @tab-remove="onNavTagTabRemoveEvt">
      <el-tab-pane v-for="item in navTagTabList" :key="item.path" :label="item.title" :name="item.path" :closable="item.path != '/'">
        {{ item.content }}
      </el-tab-pane>
    </el-tabs>

    <div class="el-dropdown-div">
      <el-dropdown @command="onDropdownCommandEvt">
        <span class="el-dropdown-link">
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
            <el-dropdown-item command="closeAll">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import useNavTagHook from '@/hooks/useNavTagHook';

const { activeNavTagTab, navTagTabList, onNavTagTabChangeEvt, onNavTagTabRemoveEvt, onDropdownCommandEvt } = useNavTagHook();
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
