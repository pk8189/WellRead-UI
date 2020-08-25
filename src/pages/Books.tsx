import React from 'react';
import _ from 'lodash';
import { SettingOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Link, useModel } from 'umi';
import { Card, Row, Col } from 'antd';

const { Meta } = Card;

const BookCard: React.ReactNode = () => (
  <Card
    size="small"
    style={{ width: 200 }}
    hoverable={true}
    cover={
      <img
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
    actions={[
      <SettingOutlined key="setting" />,
    ]}
  >
    <Meta
      title="Book 1"
      description="By this author"
    />
  </Card>
)

const NewBook: React.ReactNode = () => (
  <Link to="/books/new">
    <Card
      size="small"
      style={{ width: 200 }}
      hoverable={true}
      cover={
        <img
          alt="example"
          src="https://icons.iconarchive.com/icons/thalita-torres/office/1024/school-book-icon.png"
        />
      }
      actions={[
        <PlusCircleOutlined key="setting" />,
      ]}
    >
    <Meta
      title="Add a new book"
      description="Search by book title"
      />
    </Card>
  </Link>
)

const Books: React.FC<{}> = () => {

  const { initialState } = useModel('@@initialState');

  if (!_.get(initialState, 'currentUser.books', []).length) {
    return (
      <Row gutter={[32, 32]}>
        <Col><NewBook /></Col>
        <Col><BookCard /></Col>
      </Row>
    )
  }
};

export default Books;
