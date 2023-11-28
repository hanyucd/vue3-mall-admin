import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import eslintPlugin from 'vite-plugin-eslint';

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 8080,
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      // https://vueschool.io/articles/vuejs-tutorials/globally-load-sass-into-your-vue-js-applications/
      scss: {
        // 这样就可以在全局中使用 mixin.scss中预定义的变量了 | 给导入的路径最后加上 ; 
        additionalData: `
          @import "@/common/style/common.scss";
        `
      }
    }
  },
  plugins: [
    vue(),
    eslintPlugin(),
    WindiCSS()
  ],
});
