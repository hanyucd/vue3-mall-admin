<template>
  <el-card shadow="never" class=" border-0 h-full">
    <TableHeader @createEvt="openFormDrawer" @refreshEvt="getTableData(tablePage)" />

    <el-tree v-loading="tableIsLoading" class="el-tree-container" :data="tableDataList" :props="treeProps" node-key="id" :default-expanded-keys="defaultExpandedKeys">
      <!-- 自定义节点 -->
      <template #default="{ node, data }">
        <div class=" flex items-center flex-1">
          <el-tag class="mr-2" :type="data.menu ? '' : 'info'" size="small">{{ data.menu ? '菜单' : '权限' }}</el-tag>
          <el-icon v-if="data.icon" class="mr-2">
            <component :is="data.icon" />
          </el-icon>
          <span>{{ node.label }}</span>
          <div class="ml-auto mr-4">
            <el-switch :model-value="data.status" :active-value="1" :inactive-value="0" class="mr-3" :loading="data.isLoading" @change="switchChange($event, data)" />
            <el-button type="primary" size="small" text @click.stop="handleEditTableItem(data)">修改</el-button>
            <el-button type="primary" size="small" text @click.stop="addChildMenu(data)">增加</el-button>
            <el-button type="primary" size="small" text @click.stop="handleTableItemDelete(data)">删除</el-button>
          </div>
        </div>
      </template>
    </el-tree>

    <!-- 表单Drawer -->
    <FormDrawer ref="formDrawerRef" :title="formDrawerTitle + '权限'" destroy-on-close @formDrawerSubmitEvt="onFormDrawerSubmitEvt" @formDrawerCloseEvt="onFormDrawerCloseEvt">
      <el-form ref="formRef" :model="tableFormData" :rules="tableFormRules" label-width="80px" :inline="false" size="default">
        <el-form-item label="上级菜单" prop="rule_id">
          <el-cascader 
            v-model="tableFormData.rule_id"
            placeholder="请选择上级菜单" 
            :options="ruleOptions" 
            :props="{ checkStrictly: true, emitPath: false, label: 'name', children: 'child', value: 'id' }" 
            clearable 
            filterable
          />
        </el-form-item>

        <el-form-item label="菜单/规则" prop="menu">
          <el-radio-group v-model="tableFormData.menu">
            <el-radio :label="1" border>菜单</el-radio>
            <el-radio :label="0" border>规则</el-radio>
          </el-radio-group>
        </el-form-item>
                
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="tableFormData.name" placeholder="请输入权限名称" />
        </el-form-item>

        <el-form-item v-if="tableFormData.menu == 1" label="菜单图标" prop="icon">
          <IconSelect v-model="tableFormData.icon" />
        </el-form-item>

        <el-form-item v-if="tableFormData.menu == 1 && tableFormData.rule_id > 0" label="前端路由" prop="frontpath">
          <el-input v-model="tableFormData.frontpath" placeholder="请输入前端路由" />
        </el-form-item>

        <el-form-item v-if="tableFormData.menu == 0" label="后端规则" prop="condition">
          <el-input v-model="tableFormData.condition" placeholder="请输入后端规则" />
        </el-form-item>

        <el-form-item v-if="tableFormData.menu == 0" label="请求方式" prop="method">
          <el-select v-model="tableFormData.method" placeholder="请选择请求方式" clearable filterable>
            <el-option v-for="item in ['GET', 'POST', 'PUT', 'DELETE']" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="order">
          <el-input-number v-model="tableFormData.order" :min="0" :max="1000" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import TableHeader from '@/components/TableHeader/TableHeader.vue';
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';
import IconSelect from '@/components/IconSelect/IconSelect.vue';
import { ref, getCurrentInstance } from 'vue';
import * as useTableHook from '@/hooks/useTableHook';

const { proxy } = getCurrentInstance();

// 配置选项
const treeProps = { label: 'name', children: 'child' };
// 默认展开节点 key值
const defaultExpandedKeys = ref([]);
// 规则选项
const ruleOptions = ref([]);

const {
  tableIsLoading,
  tablePage,
  tableDataList,
  getTableData,
  switchChange,
  handleTableItemDelete
} = useTableHook.useBaseTableHook({
  getTableDataApi: proxy.$api.getAccessRuleLisApi,
  deleteApi: proxy.$api.deleteAccessRuleApi,
  updateStatusApi: proxy.$api.updateAccessRuleStatusApi,
  onGetListSuccess: tableDataRes => {
    tableDataList.value = tableDataRes.list;
    defaultExpandedKeys.value = tableDataRes.list.map(item => item.id);
    ruleOptions.value = tableDataRes.rules;
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
    rule_id: 0,
    menu: 1,
    name: '',
    condition: '', 
    method: 'GET', 
    status: 1, 
    order: 0, 
    icon: '', 
    frontpath: ''
  },
  createApi: proxy.$api.createAccessRuleApi,
  updateApi: proxy.$api.updateAccessRuleApi,
  tablePage,
  getTableData,
});

getTableData();

/**
 * 直接添加子菜单
 */
const addChildMenu = ruleItem => {
  tableFormData.rule_id = ruleItem.id;
  openFormDrawer();
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
