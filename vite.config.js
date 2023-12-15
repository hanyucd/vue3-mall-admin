import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import eslintPlugin from 'vite-plugin-eslint';

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://ceshi13.dishait.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      // https://vueschool.io/articles/vuejs-tutorials/globally-load-sass-into-your-vue-js-applications/
      scss: {
        // 这样就可以在全局中使用 common.scss中预定义的变量了 | 给导入的路径最后加上 ; 
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
