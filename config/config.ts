// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'Well-Read',
    locale: true,
    siderWidth: 208,
  },
  locale: {
    // default zh-CN
    default: 'en-US',
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
      ],
    },
    {
      path: '/home',
      name: 'Home',
      icon: 'home',
      component: './Home',
    },
    {
      path: '/books',
      name: 'Books',
      icon: 'read',
      routes: [
        {
          name: 'My Books',
          path: '/books/me',
          component: './Books',
        },
        {
          name: 'Add A Book',
          path: '/books/new',
          component: './SearchBooks',
        },
      ],
    },
    {
      path: '/notes',
      name: 'Notes',
      icon: 'edit',
      routes: [
        {
          name: 'My Notes',
          path: '/notes/me',
          component: './ViewNotes',
        },
        {
          name: 'Add A Note',
          path: '/notes/new',
          component: './Notes',
        },
      ],
    },
    {
      path: '/',
      redirect: '/home',
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
  proxy: proxy['dev'],
  manifest: {
    basePath: '/',
  },
});
