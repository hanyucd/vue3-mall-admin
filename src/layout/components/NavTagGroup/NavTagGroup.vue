<template>
  <div class="nav-tag-group">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      class="tag-tabs"
      @edit="handleTabsEdit"
    >
      <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
        {{ item.content }}
      </el-tab-pane>
    </el-tabs>

    <div class="el-dropdown-div">
      <el-dropdown @command="handleClose">
        <span class="el-dropdown-link">
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
            <el-dropdown-item command="clearAll">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const editableTabsValue = ref('2');
const editableTabs = ref([
  {
    title: 'Tab 1',
    name: '1',
    content: 'Tab 1 content',
  },
  {
    title: 'Tab 2',
    name: '2',
    content: 'Tab 2 content',
  },
]);


const handleClose = (commond) => { console.log(commond); };
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
