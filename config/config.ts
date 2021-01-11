// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'luxondata',
    locale: true,
    siderWidth: 208,
    logo:'https://www.luxondata.com/img/logo.svg',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
      ],
    },
    {
      path: '/welcome',
      name: 'welcome',
      icon: 'smile',
      component: './Welcome',
    },
    {
      path: '/admin',
      name: 'admin',
      icon: 'crown',
      access: 'canAdmin',
      component: './Admin',
      routes: [
        {
          path: '/admin/sub-page',
          name: 'sub-page',
          icon: 'smile',
          component: './Welcome',
        },
      ],
    },
    {
      name: 'list.table-list',
      icon: 'delete',
      path: '/list',
      access:'isMenu',
      component: './ListTableList',
    },
    {
      path: '/',
      redirect: '/welcome',
    },
    {
      name: 'list.table-task',
      icon: 'profile',
      path: '/task',
      //access:'isMenu',
      component: './Task',
    },
    {
      name: 'list.table-detail',
      icon: 'read',
      path: '/detail',
      //access:'isMenu',
      component: './Detail',
    },
    {
      name: 'list.table-log',
      icon: 'form',
      path: '/log',
      access:'isMenu',
      component: './Log',
    },
    {
      name: 'list.table-user',
      icon: 'user',
      path: '/userManager',
      access:'isMenu',
      component: './UserManager',
    },
    {
      name: 'account',
      icon: 'solution',
      path: '/account',
      routes: [
        {
          name: 'settings',
          icon: 'sync',
          path: '/account/settings',
          component: './account/settings',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
