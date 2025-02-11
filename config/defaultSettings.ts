import { Settings as LayoutSettings } from '@ant-design/pro-layout';

export default {
  navTheme: 'light',
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'Well-Read',
  //logo: 'http://%PUBLIC_URL%/logo.png',
  logo: 'http://localhost:8001/logo.png',
  pwa: false,
  iconfontUrl: '',
} as LayoutSettings & {
  pwa: boolean;
};
