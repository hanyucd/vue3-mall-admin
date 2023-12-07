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
  // 获取图片分类下 图片列表
  getImageListApi: (imageClassId, page, param) => httpRequest(`/admin/image_class/${ imageClassId }/image/${ page }`, param),
  // 更新图片名称
  updateImageNameApi: (imageId, param) => httpRequest(`/admin/image/${ imageId }`, param, 'post'),
  // 删除图片
  delImageApi: param => httpRequest(`/admin/image/delete_all`, param, 'post'),
  // 上传图片
  uploadImageApi: import.meta.env.VITE_APP_BASE_API + '/admin/image/upload',
  // 获取公告列表
  getNoticeListApi: page => httpRequest(`/admin/notice/${ page }`),
  // 创建公告
  createNoticeApi: param => httpRequest(`/admin/notice`, param, 'post'),
  // 更新公告
  updateNoticeApi: (noticeId, param) => httpRequest(`/admin/notice/${ noticeId }`, param, 'post'),
  // 删除公告
  deleteNoticeApi: noticeId => httpRequest(`/admin/notice/${ noticeId }/delete`, {}, 'post'),
  // 获取管理员 图片列表
  getManagerListApi: (page, param) => httpRequest(`/admin/manager/${ page }`, param),
};
