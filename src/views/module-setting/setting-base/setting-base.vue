<template>
  <div v-loading="isLoading" class="bg-white p-4 rounded">
    <el-form ref="BaseFormRef" :model="BaseForm" label-width="160px">
      <el-tabs v-model="activeName">
        <!-- 注册与访问 -->
        <el-tab-pane label="注册与访问" name="first">
          <el-form-item label="是否允许注册会员">
            <el-radio-group v-model="BaseForm.open_reg">
              <el-radio :label="0" border> 关闭 </el-radio>
              <el-radio :label="1" border> 开启 </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="注册类型">
            <el-radio-group v-model="BaseForm.reg_method">
              <el-radio label="username" border> 普通注册 </el-radio>
              <el-radio label="phone" border> 手机注册 </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="密码最小长度">
            <el-input v-model="BaseForm.password_min" placeholder="密码最小长度" type="number" style="max-width: 300px;" />
          </el-form-item>

          <el-form-item label="强制密码复杂度">
            <el-checkbox-group v-model="password_encrypt_arr">
              <el-checkbox v-for="item in passwordEncryptText" :key="item.key" :label="item.key" border>
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>

        <!-- 上传设置 -->
        <el-tab-pane label="上传设置" name="second">
          <el-form-item label="默认上传方式">
            <el-radio-group v-model="BaseForm.upload_method">
              <el-radio label="oss" border> 阿里oss </el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="Bucket">
            <el-input v-model="BaseForm.upload_config.Bucket" placeholder="Bucket" style="max-width: 300px;" />
          </el-form-item>

          <el-form-item label="ACCESS_KEY">
            <el-input v-model="BaseForm.upload_config.ACCESS_KEY" placeholder="ACCESS_KEY" type="password" show-password style="max-width: 300px;" />
          </el-form-item>

          <el-form-item label="SECRET_KEY">
            <el-input v-model="BaseForm.upload_config.SECRET_KEY" placeholder="SECRET_KEY" type="password" show-password style="max-width: 300px;" />
          </el-form-item>

          <el-form-item label="空间域名">
            <el-input v-model="BaseForm.upload_config.http" placeholder="http" style="max-width: 300px;" />
            <span class="text-sm text-gray-400 pl-2">请补全http:// 或 https://</span>
          </el-form-item>
        </el-tab-pane>

        <!-- Api安全 -->
        <el-tab-pane label="Api安全" name="third">
          <el-form-item label="默认上传方式">
            <el-radio-group v-model="BaseForm.api_safe">
              <el-radio :label="1" border> 是 </el-radio>
              <el-radio :label="0" border> 否 </el-radio>
            </el-radio-group>
            <span class="text-sm text-gray-400 pl-3">api安全功能开启之后调用前端api需要传输签名串</span>
          </el-form-item>

          <el-form-item label="密钥">
            <el-input v-model="BaseForm.api_secret" placeholder="密钥" style="max-width: 300px;" />
            <p class="text-sm text-gray-400 w-full mt-2">密钥设置关系系统中api调用传输签名串的编码规则,以级会员token解析,请慎重设置,注意设置之后对应会员要求重新登陆获取token</p>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <el-form-item class="mt-3">
        <el-button type="primary" @click="submitUpdateConfig">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

const BaseForm = reactive({
  //开启注册，0关闭1开启
  'open_reg': 1,
  // 注册方式， username普通 phone 手机
  'reg_method': 'username',
  // 密码最小长度
  'password_min': 7,
  // 密码复杂度，0数字，1小写字母，2大写字母，3符号： 例如：1,2,3
  'password_encrypt': '0,1,2',
  // 上传方式, local本地，oss对象存储
  'upload_method': 'oss',
  'upload_config': {
    'Bucket': '',
    'ACCESS_KEY': '1',
    'SECRET_KEY': '2',
    'http': ''
  },
  'api_safe': 1,
  'api_secret': '',
});

const password_encrypt_arr = ref([]);

const activeName = ref('first');

const passwordEncryptText = reactive([
  { name: '数字', key: '0' },
  { name: '小写字母', key: '1' },
  { name: '大写字母', key: '2' },
  { name: '符号', key: '3' },
]);

const isLoading = ref(false);

watch(password_encrypt_arr, (newValue) => {
  BaseForm.password_encrypt = newValue.join(',');
});

/**
 * 获取系统配置信息
 */
const getSysConfigData = () => {
  isLoading.value = true;
  proxy.$api.getSysConfigApi().then(res => {
    for (let key in BaseForm) {
      BaseForm[key] = res.data[key];
    }
    password_encrypt_arr.value = BaseForm.password_encrypt.split(',');
  }).finally(() => {
    isLoading.value = false;
  });
};

getSysConfigData();

/**
 * 提交修改
 */
const submitUpdateConfig = () => {
  isLoading.value = true;
  proxy.$api.updateSysConfigApi(BaseForm).then(res => {
    proxy.$commonUtil.elNotify(`修改成功`);
  }).finally(() => {
    isLoading.value = false;
  });
};

</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
