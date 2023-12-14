<template>
  <editor v-model="content" tag-name="div" :init="init" />
  <ChooseImage ref="ChooseImageRef" :image-limit="9" :show-btn="false" />
</template>

<script setup>
import ChooseImage from '@/components/ChooseImage/ChooseImage.vue';
import tinymce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
// import { upload_image_api } from '~/api/image.js';
import { ref, watch } from 'vue';
import 'tinymce/themes/silver/theme'; // 引用主题文件
import 'tinymce/icons/default'; // 引用图标文件
import 'tinymce/models/dom';
// tinymce插件可按自己的需要进行导入
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap'; // 特殊字符
import 'tinymce/plugins/code'; // 查看源码
import 'tinymce/plugins/codesample'; // 插入代码
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen'; //全屏
import 'tinymce/plugins/help';
import 'tinymce/plugins/image'; // 插入上传图片插件
import 'tinymce/plugins/importcss'; //图片工具
import 'tinymce/plugins/insertdatetime'; //时间插入
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists'; // 列表插件
import 'tinymce/plugins/media'; // 插入视频插件
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak'; //分页
import 'tinymce/plugins/preview'; // 预览
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save'; // 保存
import 'tinymce/plugins/searchreplace'; //查询替换
import 'tinymce/plugins/table'; // 插入表格插件
import 'tinymce/plugins/template'; //插入模板
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount'; // 字数统计插件
// v-model
const props = defineProps({
  modelValue: String,
});
const emit = defineEmits(['update:modelValue']);
const ChooseImageRef = ref(null);
// 配置
const init = {
  language_url: '/tinymce/langs/zh-Hans.js', // 中文语言包路径
  language: 'zh-Hans',
  skin_url: '/tinymce/skins/ui/oxide', // 编辑器皮肤样式
  content_css: '/tinymce/skins/content/default/content.min.css',
  menubar: false, // 隐藏菜单栏
  autoresize_bottom_margin: 50,
  max_height: (window.innerHeight - 200),
  min_height: (window.innerHeight - 200),
  height: (window.innerHeight - 200),
  toolbar_mode: 'none',
  plugins: 'wordcount visualchars visualblocks template searchreplace save quickbars preview pagebreak nonbreaking media insertdatetime importcss help fullscreen directionality codesample code charmap link code table lists advlist anchor autolink autoresize autosave',
  toolbar: 'formats undo redo fontsizeselect fontselect ltr rtl searchreplace media imageUpload | outdent  indent aligncenter alignleft alignright alignjustify lineheight underline quicklink h2 h3 blockquote numlist bullist table removeformat forecolor backcolor bold italic strikethrough hr link preview fullscreen help ',
  content_style: 'p {margin: 5px 0; font-size: 14px}',
  fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
  font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
  branding: false,
  elementpath: false,
  resize: false, // 禁止改变大小
  statusbar: false, // 隐藏底部状态栏
  images_upload_handler: (blobInfo, progress) => {
    return new Promise((resolve, reject ) => {
      let formdata = new FormData();
      formdata.append('img', blobInfo.blob());
      formdata.append('image_class_id', 168);
      
      // upload_image_api(formdata)
      // .then(res => {
      //     console.log('res', res);
      //     resolve(res.url);
      // })
      // .catch(res => {
      //     reject('error');
      // });
    });
  },
  setup: (editor) => {
    editor.ui.registry.addButton('imageUpload', {
      tooltip: '插入图片',
      icon: 'image',
      onAction: (e) => {
        ChooseImageRef.value.openImageDialog((data) => {
          data.forEach(url => {
            editor.insertContent(`&nbsp;<img src="${ url }" style="width: 100%;" />&nbsp;`);
          });
        });
      }
    });
  }
};
tinymce.init; // 初始化
const content = ref(props.modelValue);
watch(props, (newVal) => content.value = newVal.modelValue);
watch(content, (newVal) => emit('update:modelValue', newVal));
</script>

<style>
.tox-tinymce-aux {
  z-index: 9999 !important;
}
</style>
