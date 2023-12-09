import { reactive, ref, computed } from 'vue';
import * as commonUtil from '@/common/utils';

/**
 * 表格查询、删除表格项、修改表格项状态
 */
export const useBaseTableHook = (options = {}) => {
  const tableIsLoading = ref(false); // 表格数据是否加载
  const tablePage = ref(1); // 表格当前页
  const tableLimit = ref(10); // 表格一页数据量
  const tableTotal = ref(0); // 表格数据总数
  const tableDataList = ref([]); // 表格数据
  // 搜索表单
  let searchForm = null;
  // 重置搜索框
  let resetSearchForm = null;

  // 赋值搜索 双向绑定 表单值
  if (options.searchForm) {
    searchForm = reactive({ ...options.searchForm });
    // 添加重置表单方法
    resetSearchForm = () => {
      for (const key in searchForm) {
        if (key !== 'user_id') {
          searchForm[key] = options.searchForm[key];
        }
      }
      // 重置后重新调取第一页数据
      getTableData();
    };
  }

  // 获取目标表格数据
  const getTableData = async (page = 1) => {
    tableIsLoading.value = true;

    const param = {
      limit: tableLimit.value,
      ...searchForm // 搜索参数
    };

    try {
      const { data: tableData } = await options.getTableDataApi(page, param);

      if (options.onGetListSuccess && typeof options.onGetListSuccess == 'function') {
        options.onGetListSuccess(tableData);
      } else {
        tableTotal.value = tableData.totalCount;
        // tableDataList.value = tableData.list.map(item => { item.isLoading = false; return item; });
        tableDataList.value = tableData.list;
      }
      
      // console.log('表格数据', tableData);
      tableIsLoading.value = false;
    } catch (error) {
      tableIsLoading.value = false;
      console.log(error);
    }
  };

  // 表格底部分页器页码变化
  const onTableCurPaginationChangeEvt = page => {
    getTableData(page);
  };

  // 删除表格项
  const handleTableItemDelete = tableRow => {
    tableIsLoading.value = true;

    const deleteItemId = tableRow.id;
    options.deleteApi(deleteItemId).then(res => {
      commonUtil.elNotify(`删除成功`);
      getTableData(tablePage.value);
    }).finally(() => {
      tableIsLoading.value = false;
    });
};

// switch状态切换
const switchChange = (status, row) => {
  row.isLoading = true;
  options.updateStatusApi(row.id, { status }).then(res => {
    commonUtil.elNotify(`修改状态成功`);
    row.status = status;
  }).finally(() => {
    row.isLoading = false;
  });
};

  return {
    tableIsLoading,
    tablePage,
    tableLimit,
    tableTotal,
    tableDataList,
    searchForm,
    getTableData,
    resetSearchForm,
    switchChange,
    onTableCurPaginationChangeEvt,
    handleTableItemDelete
  };
};

/**
 * 表格表单操作行为
 */
export const useFormTableHook = (options = {}) => {
  // 编辑表格项 id
  const editTableItemId = ref(0);
  // 抽屉标题
  const formDrawerTitle = computed(() => editTableItemId.value == 0 ? '添加' : '修改');
  // 表单数据
  const tableFormData = reactive({});
  // 表单验证规则
  const tableFormRules = options.formRules || {};

  const formDrawerRef = ref(null);
  const formRef = ref(null);

  // 重置 formData
  const _resetFormData = () => {
    if (options.formData && typeof options.formData == 'object') {
      for (const key in options.formData) {
        tableFormData[key] = options.formData[key];
      }
    }
  };
  // 默认首次调取一次 重置方法
  _resetFormData();

  // 打开表单 drawer
  const openFormDrawer = () => formDrawerRef.value.openFormDrawer();

  // 表单 drawer 提交事件
  const onFormDrawerSubmitEvt = () => {
    formRef.value.validate(valid => {
      if (!valid) return;

      formDrawerRef.value.showSubmitBtnLoading();
      // 目标接口 新增/编辑
      const targetReqApi = editTableItemId.value == 0
        ? options.createApi({ ...tableFormData })
        : options.updateApi(editTableItemId.value, { ...tableFormData });

        targetReqApi.then(res => {
          console.log(res);
          options.getTableData(editTableItemId.value == 0 ? 1 : options.tablePage.value);

          commonUtil.elNotify(`${ formDrawerTitle.value }成功`);
          formDrawerRef.value.closeFormDrawer();
        }).finally(() => {
          formDrawerRef.value.hideSubmitBtnLoading();
        });
    });
  };

  // 监听表单 drawer 关闭事件
  const onFormDrawerCloseEvt = () => {
    editTableItemId.value = 0;
    _resetFormData(); // 重置
  };

  // 编辑 table 项
  const handleEditTableItem = tableRow => {
    for (const key in tableFormData) {
      tableFormData[key] = tableRow[key];
    }
    editTableItemId.value = tableRow.id;
    openFormDrawer();
  };
  
  return {
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
  };
};
