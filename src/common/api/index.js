import httpRequest from './httpRequest';

export default {
  // 用户登录
  userLoginApi: param => httpRequest(`/admin/login`, param, 'post'),
  // 拉取用户信息
  fetchUserInfoApi: param => httpRequest(`/admin/getinfo`, param, 'post'),
  // 用户退出登录
  userLogoutApi: param => httpRequest(`/admin/logout`, param, 'post'),
  // 更新用户密码
  updateUserPasswordApi: param => httpRequest(`/admin/updatepassword`, param, 'post'),
  // 获取首页统计数据-1
  getHomeStatistics1Api: () => httpRequest(`/admin/statistics1`),
  // 获取首页统计数据-2
  getHomeStatistics2Api: () => httpRequest(`/admin/statistics2`),
  // 获取首页统计数据-3
  getHomeStatistics3Api: param => httpRequest(`/admin/statistics3`, param),
  // 获取图片分类列表
  getImageClassListApi: (page, param) => httpRequest(`/admin/image_class/${ page }`, param),
  // 创建图片分类
  createImageClassApi: param => httpRequest(`/admin/image_class`, param, 'post'),
  // 更新图片分类
  updateImageClassApi: (imageClassId, param) => httpRequest(`/admin/image_class/${ imageClassId }`, param, 'post'),
  // 删除图片分类
  deleteImageClassApi: imageClassId => httpRequest(`/admin/image_class/${ imageClassId }/delete`, {}, 'post'),
};
