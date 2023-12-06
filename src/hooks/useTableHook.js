import { reactive, ref, computed } from 'vue';

/**
 * 表格查询
 */
export const useQueryTableHook = (options = {}) => {
  const tableIsLoading = ref(false); // 表格数据是否加载
  const tablePage = ref(1); // 表格当前页
  const tableLimit = ref(10); // 表格一页数据量
  const tableTotal = ref(0); // 表格数据总数
  const tableDataList = ref([]); // 表格数据

  // 获取目标表格数据
  const getTableDataFetch = async (page = 1) => {
    tableIsLoading.value = true;
    const param = {
      page,
      limit: tableLimit.value,
      ...options
    };

    try {
      const { data: tableData } = await options.getTableDataApi(page, param);

      if (options.onGetListSuccess && typeof options.onGetListSuccess == 'function') {
        // options.onGetListSuccess(res)
      } else {
        tableTotal.value = tableData.totalCount;
        tableDataList.value = tableData.list;
      }
      
      console.log('表格数据', tableData);
      tableIsLoading.value = false;
    } catch (error) {
      tableIsLoading.value = false;
      console.log(error);
    }
  };

  // 表格底部分页器页码变化
  const onTableCurPaginationChangeEvt = page => {
    console.log(page);
    getTableDataFetch(page);
  };

  return {
    tableIsLoading,
    tablePage,
    tableLimit,
    tableTotal,
    tableDataList,
    getTableDataFetch,
    onTableCurPaginationChangeEvt
  };
};

/**
 * 表格操作行为
 */
export const useActionTableHook = () => {
  return {};
};
