import permission from './permission';

// 自定义指令
const directives = {
  ...permission,
};

export default (app) => {
  Object.keys(directives).forEach((key) => {
    app.directive(key, directives[key]);
  });
};
