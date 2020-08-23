import React from 'react';
import { GithubOutlined, FacebookOutlined, TwitterOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="2020 Well-Read"
    links={[
    {
        key: 'facebook',
        title: <FacebookOutlined />,
        href: 'https://www.facebook.com/pat.kelly.3158/',
        blankTarget: true,
        },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/pk8189',
        blankTarget: true,
      },
      {
        key: 'twitter',
        title: <TwitterOutlined />,
        href: 'https://twitter.com/PMKellyEng',
        blankTarget: true,
      },
    ]}
  />
);
