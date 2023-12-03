import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useStore } from 'vuex';
import { ref } from 'vue';
import { useCookies } from '@vueuse/integrations/useCookies';
// import * as commonUtil from '@/common/utils';

const NavTagTabKey = 'nav-tag-tab';

const useNavTagHook = () => {
  const cookie = useCookies();
  const router = useRouter();
  const route = useRoute();
  const store = useStore();

  // 激活的导航tab
  const activeNavTagTab = ref(route.fullPath);
  // 导航tab列表
  const navTagTabList = ref([
    { title: '后台首页', path: '/' }
  ]);

  // 初始化导航tab列表
  const cookieNavTagTabList = cookie.get(NavTagTabKey);
  cookieNavTagTabList && (navTagTabList.value = cookieNavTagTabList);
  // console.log('cookie', cookieNavTagTabList);

  /**
   * vue-router 组件内路由守卫
   */
  onBeforeRouteUpdate((to, from) => {
    // console.log('下一步:', to);
    activeNavTagTab.value = to.path;
    _addNavTabTag({ title: to.meta.title, path: to.path });
  });

  /**
   * 添加导航标签
   */
  const _addNavTabTag = (navTabTag) => {
    const _findTagIndex = navTagTabList.value.findIndex(item => item.path === navTabTag.path);
    if (_findTagIndex == -1) {
      navTagTabList.value.push(navTabTag);
      cookie.set(NavTagTabKey, navTagTabList.value);
    }
  };

  /**
   * 监听导航标签 change 事件
   */
  const onNavTagTabChangeEvt = changeTabPaneName => {
    router.push({ path: changeTabPaneName });
  };

  /**
   * 监听导航标签 remove 事件
   */
  const onNavTagTabRemoveEvt = removeTabPaneName => {
    let curActiveTabPath = activeNavTagTab.value;
    const navTagTabs = navTagTabList.value;

    if (curActiveTabPath == removeTabPaneName) {
      const curActiveTabIndex = navTagTabs.findIndex(item => item.path == curActiveTabPath);
      // 下一个tab | 上一个tab 
      const nextTab = navTagTabs[curActiveTabIndex + 1] || navTagTabs[curActiveTabIndex - 1];
      if (nextTab) {
        curActiveTabPath = nextTab.path;
        router.push({ path: curActiveTabPath });
      }
    }

    // 重新附上新的激活 tab
    activeNavTagTab.value = curActiveTabPath;
    // 重新附上过滤后的 tab
    navTagTabList.value = navTagTabList.value.filter(item => item.path != removeTabPaneName);
    // 重新修改cookie中的值
    cookie.set(NavTagTabKey, navTagTabList.value);
  };

  /**
   * 点击菜单项触发的事件回调
   */
  const onDropdownCommandEvt = commond => {
    console.log(commond);

    if (commond === 'closeOther') {
      // 留下首页、当前激活的 tab
      navTagTabList.value = navTagTabList.value.filter(item => item.path == '/' || item.path == activeNavTagTab.value);
    } else if (commond === 'closeAll') {
      // 切换回首页
      activeNavTagTab.value = '/';
      router.push({ path: '/' });
      // 清除所有，留下首页
      navTagTabList.value = [{ title: '后台首页', path: '/' }];
    }
    // 重新修改cookie中的值
    cookie.set(NavTagTabKey, navTagTabList.value);
  };

  return {
    activeNavTagTab,
    navTagTabList,
    onNavTagTabChangeEvt,
    onNavTagTabRemoveEvt,
    onDropdownCommandEvt
  };
};

export default useNavTagHook;
