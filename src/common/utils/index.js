import { ElNotification, ElMessageBox } from 'element-plus';

// elemmentPlus 通知提示提示
export const elNotify = (message = '成功', type = 'success', dangerouslyUseHTMLString = true) => {
  ElNotification({ message, type, dangerouslyUseHTMLString, duration: 2000 });
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

// elemmentPlus 消息弹出输入框
export const elMsgBoxPrompt = (msg = '', value = '', title = '') => {
  return ElMessageBox.prompt(msg, title, {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: value
  });
};
