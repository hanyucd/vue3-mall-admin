<template>
  <div v-loading="isLoading" class="bg-white p-4 rounded">
    <el-form ref="BuyFormRef" :model="buyForm" label-width="160px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="支付设置" name="first">
          <el-table :data="tableData" border>
            <el-table-column label="支付方式" align="left">
              <template #default="{ row }">
                <div class="flex items-center">
                  <el-image :src="row.src" fit="fill" :lazy="true" style="width: 40px;height: 40px;" class="rounded mr-2" />
                  <div>
                    <h6>{{ row.name }}</h6>
                    <small class="flex text-gray-500 text-xs">{{ row.desc }}</small>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template #default="{ row }">
                <el-button type="primary" @click="openConfigDrawer(row.key)">配置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="购物设置" name="second">
          <el-form-item label="未支付订单">
            <el-input v-model="buyForm.close_order_minute" type="number" style="max-width: 300px;">
              <template #append>分钟后自动关闭</template>
            </el-input>
            <span class="text-sm text-gray-400 pl-2 w-full">订单下单未付款，n分钟后自动关闭，设置0不自动关闭</span>
          </el-form-item>
          <el-form-item label="已发货订单">
            <el-input v-model="buyForm.auto_received_day" type="number" style="max-width: 300px;">
              <template #append>天后自动确认收货</template>
            </el-input>
            <span class="text-sm text-gray-400 pl-2 w-full">如果在期间未确认收货，系统自动完成收货，设置0不自动收货</span>
          </el-form-item>
          <el-form-item label="已完成订单">
            <el-input v-model="buyForm.after_sale_day" type="number" style="max-width: 300px;">
              <template #append>天内允许申请售后</template>
            </el-input>
            <span class="text-sm text-gray-400 pl-2 w-full">订单完成后，用户在n天内可以发起售后申请，设置0不允许申请售后</span>
          </el-form-item>
          <el-form-item class="mt-3">
            <el-button type="primary" @click="submitUpdateConfig">保存</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <FormDrawer ref="formDrawerRef" title="配置" @formDrawerSubmitEvt="submitUpdateConfig">
      <el-form v-if="drawerType == 'alipay'" :model="buyForm" label-width="130px">
        <el-form-item label="app_id">
          <el-input v-model="buyForm.alipay.app_id" placeholder="app_id" style="width: 90%;">
            <template #a>
              <div>
              </div>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="ali_public_key">
          <el-input v-model="buyForm.alipay.ali_public_key" placeholder="ali_public_key" type="textarea" :rows="4" style="width: 90%;" />
        </el-form-item>
        
        <el-form-item label="private_key">
          <el-input v-model="buyForm.alipay.private_key" placeholder="private_key" type="textarea" :rows="4" style="width: 90%;" />
        </el-form-item>
      </el-form>

      <el-form v-if="drawerType == 'wxpay'" :model="buyForm" label-width="80px">
        <el-form-item label="公众号 APPID">
          <el-input v-model="buyForm.wxpay.app_id" placeholder="公众号 APPID" style="width: 90%;" />
        </el-form-item>

        <el-form-item label="小程序 APPID">
          <el-input v-model="buyForm.wxpay.miniapp_id" placeholder="小程序 APPID" style="width: 90%;" />
        </el-form-item>

        <el-form-item label="小程序 secret">
          <el-input v-model="buyForm.wxpay.secret" placeholder="小程序 secret" style="width: 90%;" />
        </el-form-item>

        <el-form-item label="appid">
          <el-input v-model="buyForm.wxpay.appid" placeholder="appid" style="width: 90%;" />
        </el-form-item>

        <el-form-item label="商户号">
          <el-input v-model="buyForm.wxpay.mch_id" placeholder="商户号" style="width: 90%;" />
        </el-form-item>

        <el-form-item label="API 密钥">
          <el-input v-model="buyForm.wxpay.key" placeholder="API 密钥" style="width: 90%;" />
        </el-form-item>

        <el-form-item label="cert_client">
          <el-upload ref="uploadRef" class="upload-demo" :action="$api.uploadSysConfigFileApi" :headers="{ token }" :limit="1" accept=".pem" :on-success="uploadCertSuccess">
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <p class="text-red-500">{{ buyForm.wxpay.cert_client ? buyForm.wxpay.cert_client : '还未配置' }}</p>
              <div class="el-upload__tip">
                只能上传后缀.pem文件,例如:apiclient_cert.pem
              </div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="cert_key">
          <el-upload ref="uploadRef" class="upload-demo" :action="$api.uploadSysConfigFileApi" :headers="{ token }" :limit="1" accept=".pem" :on-success="uploadKeySuccess">
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <p class="text-red-500">{{ buyForm.wxpay.cert_key ? buyForm.wxpay.cert_key : '还未配置' }}</p>
              <div class="el-upload__tip">
                只能上传后缀.pem文件,例如:apiclient_key.pem
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, getCurrentInstance } from 'vue';
import authUtil from '@/common/utils/authUtil';
import FormDrawer from '@/components/FormDrawer/FormDrawer.vue';

const { proxy } = getCurrentInstance();

const isLoading = ref(false);
const token = authUtil.getUserToken();

const tableData = [{
  name: '支付宝支付',
  desc: '该系统支持即时到账接口',
  src: '/alipay.png',
  key: 'alipay'
}, {
  name: '微信支付',
  desc: '该系统支持微信网页支付喝扫码支付',
  src: '/wepay.png',
  key: 'wxpay'
}];

const buyForm = reactive({
  'close_order_minute': 30,
  'auto_received_day': 7,
  'after_sale_day': 23,
  'alipay': {
    'app_id': '...',
    'ali_public_key': '...',
    'private_key': '...'
  },
  'wxpay': {
    'app_id': '...',
    'miniapp_id': '...',
    'secret': '...',
    'appid': '...',
    'mch_id': '...',
    'key': '...',
    'cert_client': '....pem',
    'cert_key': '....pem'
  }
});


const activeName = ref('first');

/**
 * 获取系统设置
 */
const getSysConfigData = () => {
  isLoading.value = true;
  proxy.$api.getSysConfigApi().then(res => {
    for (let key in buyForm) {
      buyForm[key] = res.data[key];
    }
  }).finally(() => {
    isLoading.value = false;
  });
};

getSysConfigData();

const drawerType = ref('alipay');
const formDrawerRef = ref(null);

/**
 * 打开配置 drawer
 */
const openConfigDrawer = (type = 'alipay') => {
  drawerType.value = type;
  formDrawerRef.value.openFormDrawer();
};

// 上传成功
const uploadCertSuccess = (response, uploadFile, uploadFiles) => {
  buyForm.wxpay.cert_client = response.data;
};

const uploadKeySuccess = (response, uploadFile, uploadFiles) => {
  buyForm.wxpay.cert_key = response.data;
};

/**
 * 提交修改
 */
const submitUpdateConfig = () => {
  isLoading.value = true;
  proxy.$api.updateSysConfigApi(buyForm).then(res => {
    proxy.$commonUtil.elNotify(`修改成功`);
  }).finally(() => {
    isLoading.value = false;
  });
};
</script>

<style lang="scss" scoped>

</style>
