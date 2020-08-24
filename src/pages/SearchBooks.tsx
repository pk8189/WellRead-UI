import React from 'react';
import { Input } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

const { Search } = Input;

export default (): React.ReactNode => (
  <PageContainer>
    <Search
      placeholder="Search by book title or author"
      enterButton="Search"
      size="large"
      onSearch={value => console.log(value)}
    />

  </PageContainer>
);
