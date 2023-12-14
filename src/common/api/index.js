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
  // 更新管理员 状态
  updateManagerStatusApi: (managerId, param) => httpRequest(`/admin/manager/${ managerId }/update_status`, param, 'post'),
  // 创建管理员
  createManagerApi: param => httpRequest(`/admin/manager`, param, 'post'),
  // 更新管理员
  updateManagerApi: (managerId, param) => httpRequest(`/admin/manager/${ managerId }`, param, 'post'),
  // 删除管理员
  deleteManagerApi: managerId => httpRequest(`/admin/manager/${ managerId }/delete`, {}, 'post'),
  // 获取权限规则列表
  getAccessRuleLisApi: page => httpRequest(`/admin/rule/${ page }`),
  // 创建权限规则
  createAccessRuleApi: param => httpRequest(`/admin/rule`, param, 'post'),
  // 更新权限规则
  updateAccessRuleApi: (ruleId, param) => httpRequest(`/admin/rule/${ ruleId }`, param, 'post'),
  // 删除权限规则
  deleteAccessRuleApi: ruleId => httpRequest(`/admin/rule/${ ruleId }/delete`, {}, 'post'),
  // 更新权限规则 状态
  updateAccessRuleStatusApi: (ruleId, param) => httpRequest(`/admin/rule/${ ruleId }/update_status`, param, 'post'),
  // 获取角色列表
  getRoleLisApi: page => httpRequest(`/admin/role/${ page }`),
  // 创建角色
  createRoleApi: param => httpRequest(`/admin/role`, param, 'post'),
  // 更新角色
  updateRoleApi: (roleId, param) => httpRequest(`/admin/role/${ roleId }`, param, 'post'),
  // 删除角色
  deleteRoleApi: roleId => httpRequest(`/admin/role/${ roleId }/delete`, {}, 'post'),
  // 更新角色 状态
  updateRoleStatusApi: (roleId, param) => httpRequest(`/admin/role/${ roleId }/update_status`, param, 'post'),
  // 创建角色权限
  setRoleAccessApi: param => httpRequest(`/admin/role/set_rules`, param, 'post'),
  // 获取规格列表
  getSkuLisApi: page => httpRequest(`/admin/skus/${ page }`),
  // 创建规格
  createSkuApi: param => httpRequest(`/admin/skus`, param, 'post'),
  // 更新规格
  updateSkuApi: (skuId, param) => httpRequest(`/admin/skus/${ skuId }`, param, 'post'),
  // 批量删除规格
  batchDeleteSkuApi: param => httpRequest(`/admin/skus/delete_all`, param, 'post'),
  // 更新规格 状态
  updateSkuStatusApi: (skuId, param) => httpRequest(`/admin/skus/${ skuId }/update_status`, param, 'post'),
  // 获取优惠券列表
  getCouponLisApi: page => httpRequest(`/admin/coupon/${ page }`),
  // 创建优惠券
  createCouponApi: param => httpRequest(`/admin/coupon`, param, 'post'),
  // 更新优惠券
  updateCouponApi: (couponId, param) => httpRequest(`/admin/coupon/${ couponId }`, param, 'post'),
  // 删除优惠券
  deleteCouponApi: couponId => httpRequest(`/admin/coupon/${ couponId }/delete`, {}, 'post'),
  // 更新优惠券 状态
  updateCouponStatusApi: (couponId, param) => httpRequest(`/admin/coupon/${ couponId }/update_status`, param, 'post'),

  // 获取商品列表
  getGoodsLisApi: (page, param) => httpRequest(`/admin/goods/${ page }`, param),
  // 创建商品
  createGoodsApi: param => httpRequest(`/admin/goods`, param, 'post'),
  // 批量删除商品
  batchDeleteGoodsApi: param => httpRequest(`/admin/goods/delete_all`, param, 'post'),
  // 批量更新商品 上下架状态
  batchUpdateGoodsStatusApi: param => httpRequest(`/admin/goods/changestatus`, param, 'post'),
  // 获取商品分类列表
  getGoodsCategoryLisApi: () => httpRequest(`/admin/category`),
  // 获取商品详情信息
  getGoodsDetailApi: goodsId => httpRequest(`/admin/goods/read/${ goodsId }`),
  // 更新商品轮播图
  updateGoodBannerApi: (goodsId, param) => httpRequest(`/admin/goods/banners/${ goodsId }`, param, 'post'),
  // 更新商品信息
  updateGoodsApi: (goodsId, param) => httpRequest(`/admin/goods/${ goodsId }`, param, 'post'),
};
