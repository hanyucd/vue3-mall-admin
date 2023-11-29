import { ElNotification, ElMessageBox } from 'element-plus';

// elemmentPlus 通知提示提示
export const elNotify = (message = '成功', type = 'success', dangerouslyUseHTMLString = true) => {
  ElNotification({ message, type, dangerouslyUseHTMLString, duration: 3000 });
};

// elemmentPlus 确定提示弹框
export const elMsgBoxConfirm = (message = '提示内容', type = 'warning', title = '', confirmButtonText = '确定', cancelButtonText = '取消') => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(message, title, { confirmButtonText, cancelButtonText, type } )
      .then(() => {
        resolve('确定');
      })
      .catch(() => {
        reject('取消');
      });
  });
};
