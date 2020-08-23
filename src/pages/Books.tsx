import React from 'react';
import { Card, Typography, Alert } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

export default (): React.ReactNode => (
  <PageContainer>
    <Card>
      <Typography.Title level={2} style={{ textAlign: 'center' }}>
        No Books
      </Typography.Title>
    </Card>
  </PageContainer>
);
