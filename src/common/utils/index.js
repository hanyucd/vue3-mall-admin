import { ElNotification, ElMessageBox } from 'element-plus';

// elemmentPlus 通知提示提示
export const elNotify = (message = '成功', type = 'success', dangerouslyUseHTMLString = true) => {
  ElNotification({ message, type, dangerouslyUseHTMLString, duration: 3000 });
};
