import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { notification } from 'antd';
import { history, RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { ResponseError } from 'umi-request';
import { queryCurrent } from './services/user';
import defaultSettings from '../config/defaultSettings';

export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  settings?: LayoutSettings;
}> {
  if (history.location.pathname !== '/user/login') {
    try {
      const currentUser = await queryCurrent();
      return {
        currentUser,
        settings: defaultSettings,
      };
    } catch (error) {
      history.push('/user/login');
    }
  }
  return {
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.CurrentUser };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      if (!initialState?.currentUser?.id && history.location.pathname !== '/user/login') {
        history.push('/user/login');
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = response.statusText;
    const { status } = response;

    notification.error({
      message: `Error ${status}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: 'There has been an error',
      message: 'There has been an error',
    });
  }
  throw error;
};

export const request: RequestConfig = {
  errorHandler,
};
