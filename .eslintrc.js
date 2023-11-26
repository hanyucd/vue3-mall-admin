module.exports = {
  root: true, // 当前配置为根配置，将不再从上级文件夹查找配置 
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  globals: {},
  extends: [ 'eslint:recommended', 'plugin:vue/vue3-recommended' ],
  plugins: ['vue'],
  // parser: 'vue-eslint-parser', // 因为需要校验vue模板文件里面的html，所以这里使用vue-eslint-parser这个parser作为解释器
  parserOptions: {
    // 因为上面使用了 vue-eslint-parser，它只会校验模板里面的html，对于script里面的 js/ts，仍然需要其他解释器去处理
    // 所以vue-eslint-parser就预留了parser选项让我们传进去解释器
    parser: '@babel/eslint-parser', // ESLint核心规则不支持 ECMAScript 实验性语法，因此可能无法正常工作，需要使用 @babel/eslint-parser | 注： @babel/eslint-parser 是 babel-eslint(不再维护和更新) 的替代品
    ecmaVersion: 'latest', // 指定要使用的 ECMAScript 语法版本，可设为 “latest”，以使用最新支持的版本
    sourceType: 'module' // 默认是script，但我们现在都是模块，所以将它指定为module
  },
  /**
   * off 或 0 - 关闭规则
   * warn 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
   * error 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
   */
  rules: {
    // 控制一/多行可接受的属性量
    'vue/max-attributes-per-line': ['error', {
      'singleline': { 'max': 10 },
      'multiline': { 'max': 1, }
    }],
    "vue/singleline-html-element-content-newline": 'off', // 在单行元素的内容前后需要换行符
    'vue/require-default-prop': 'off', // 关闭 props 需要默认值
    'vue/no-v-html': 'off', // 关闭 Disallow use of v-html to prevent XSS attack
    'semi': ['error', 'always'], // 强制在语句末尾使用分号
    'no-unused-vars': 'off', // 禁止使用未声明的变量
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }], // 强制使用单引号 & 允许字符串使用反勾号
  }
}
