<template>
  <el-card shadow="never" class=" border-0 h-full">
    <TableHeader @createEvt="openFormDrawer" @refreshEvt="getTableData(tablePage)" />

    <el-table v-loading="tableIsLoading" :data="tableDataList" border stripe>
      <el-table-column prop="name" label="角色列表" />

      <el-table-column prop="desc" label="角色描述" />
      
      <el-table-column label="角色状态">
        <template #default="{ row }">
          <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" :loading="row.isLoading" @change="switchChange($event, row)" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="openAccessFormDrawerEvt(scope.row)">配置权限</el-button>
          <el-button size="small" type="primary" @click="handleEditTableItem(scope.row)">修改</el-button>
          <el-popconfirm title="是否删除此角色?" width="160" confirm-button-text="删除" cancel-button-text="取消" @confirm="handleTableItemDelete(scope.row)">
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

    <!-- 新增角色 表单 Drawer -->
    <FormDrawer ref="formDrawerRef" :title="formDrawerTitle" destroy-on-close @formDrawerSubmitEvt="onFormDrawerSubmitEvt" @formDrawerCloseEvt="onFormDrawerCloseEvt">
      <el-form ref="formRef" :model="tableFormData" :rules="tableFormRules" label-width="80px" size="large" class="flex flex-col min-h-full">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="tableFormData.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="tableFormData.desc" placeholder="角色描述" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="tableFormData.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
    </FormDrawer>

    <!-- 配置权限 表单 Drawer -->
    <FormDrawer ref="accessFormDrawerRef" title="配置权限" destroy-on-close @formDrawerSubmitEvt="onAccessFormDrawerSubmitEvt" @formDrawerCloseEvt="onAccessFormDrawerCloseEvt">
      <!-- 虚拟化树形控件 -->
      <el-tree-v2
        ref="treeV2Ref" 
        :data="ruleTreeList"
        :props="{ label: 'name', children: 'child' }"
        show-checkbox
        :height="treeHeight"
        :default-expanded-keys="defaultExpandedKeys" 
        :check-strictly="checkStrictly"
      >
        <template #default="{ data }">
          <div class="flex items-center">
            <el-tag :type="data.menu ? '' : 'info'" size="small">{{ data.menu ? '菜单' : '权限' }}</el-tag>
            <span class="ml-2 text-sm">{{ data.name }}</span>
          </div>
        </template>
      </el-tree-v2>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import TableHeader from '@/components/TableHeader/TableHeader.vue';
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';

import { ref, getCurrentInstance } from 'vue';
import * as useTableHook from '@/hooks/useTableHook';

const { proxy } = getCurrentInstance();

const {
  tableIsLoading,
  tablePage,
  tableLimit,
  tableTotal,
  tableDataList,
  getTableData,
  switchChange,
  onTableCurPaginationChangeEvt,
  handleTableItemDelete
} = useTableHook.useBaseTableHook({
  getTableDataApi: proxy.$api.getRoleLisApi,
  deleteApi: proxy.$api.deleteRoleApi,
  updateStatusApi: proxy.$api.updateRoleStatusApi,
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
    desc: '',
    status: 1
  },
  formRules: {
    name: [ { required: true, message: '请填写角色名称', trigger: 'blur' } ],
    desc: [ { required: true, message: '请填写角色描述', trigger: 'blur' } ]
  },
  createApi: proxy.$api.createRoleApi,
  updateApi: proxy.$api.updateRoleApi,
  tablePage,
  getTableData,
});

getTableData();

// 权限配置 表单 节点引用
const accessFormDrawerRef = ref(null);
// 权限配置树节点
const treeV2Ref = ref(null);
// 选中的 角色 id
const roleId = ref(0);
// 权限规则列表
let ruleTreeList = ref([]);
// 权限规则树高度
const treeHeight = ref(0);
// 默认展开的节点的 key 的数组
const defaultExpandedKeys = ref([]);
// 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
const checkStrictly = ref(false);

/**
 * 监听配置权限 表单 提交事件
 */
const openAccessFormDrawerEvt = tableItem => {
  treeHeight.value = window.innerHeight - 200;
  roleId.value = tableItem.id;
  checkStrictly.value = true;
  
  proxy.$api.getAccessRuleLisApi(1).then(res => {
    ruleTreeList.value = res.data.list;
    defaultExpandedKeys.value = res.data.list.map(item => item.id);
    accessFormDrawerRef.value.openFormDrawer();

    setTimeout(() => {
      // 通过 keys 设置目前勾选的节点
      treeV2Ref.value.setCheckedKeys(tableItem.rules.map(item => item.id));
      checkStrictly.value = false;
    }, 100);
  });
};

/**
 * 监听配置权限 表单 提交事件
 */
const onAccessFormDrawerSubmitEvt = () => {
  accessFormDrawerRef.value.showSubmitBtnLoading();
    // 返回目前被选中的节点的 key 所组成的数组
    const checkedKeys = treeV2Ref.value.getCheckedKeys();
    // 返回目前半选中的节点的 key 所组成的数组, 就是子节点没有全选的父节点
    const halfCheckedKeys = treeV2Ref.value.getHalfCheckedKeys();
    console.log('选择', checkedKeys);
    console.log('未选的父节点', halfCheckedKeys);
    
    
    proxy.$api.setRoleAccessApi({
      id: roleId.value,
      rule_ids: [...checkedKeys, ...halfCheckedKeys]
    }).then(res => {
      accessFormDrawerRef.value.closeFormDrawer();
      proxy.$commonUtil.elNotify(`配置权限成功`);
      getTableData();
    }).finally(() => {
      accessFormDrawerRef.value.hideSubmitBtnLoading();
    });
};

/**
 * 监听配置权限 表单 关闭事件
 */
const onAccessFormDrawerCloseEvt = () => {
  ruleTreeList.value = [];
  treeHeight.value = 0;
  roleId.value = 0;
};

</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
