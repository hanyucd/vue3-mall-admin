import store from '@/store';

const _hasPermission = (value, el = false) => {
  if (!Array.isArray(value)) {
    throw new Error(`需要配置权限，例如 v-permission="['getStatistics1,GET']"`);
  }
  const hasAuth = value.some(item => store.state.userModule.ruleNames.includes(item));
  if (el && !hasAuth) {
    el.parentNode && el.parentNode.removeChild(el);
  }

  return hasAuth;
};

const permission = {
  mounted (el, binding) {
    _hasPermission(binding.value, el);
    // const btnPermission = binding.value;
    // const permission = store.getters.permission;
    // const hasPermission = permission.includes(btnPermission);
    // if (!hasPermission) {
    //   el.parentNode && el.parentNode.removeChild(el);
    // }
    // if (typeof btnPermission !== 'string') {
    //   throw new Error('value must be a string! e.g. v-permission="\'add-user\'');
    // }
  }
};

export default {
  permission
};
