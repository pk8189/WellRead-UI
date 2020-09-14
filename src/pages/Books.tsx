import React from 'react';
import _ from 'lodash';
import { EllipsisOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Menu, Dropdown } from 'antd';
import { useModel } from 'umi';
import { removeBook } from '@/services/books';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

const { Meta } = Card;

const exploreLayout = {
  'paddingTop': '30px',
  'paddingLeft': '30px',
  'paddingBottom': '30px',
}


type BookMenuProps = {
  bookId: string,
  removeBook: Function,
}
const BookMenu: React.ReactNode = (props: BookMenuProps) => (
  <Menu style={{ 'backgroundColor': '#fafafa' }}>
    <Menu.Item danger onClick={() => props.removeBook(props.bookId)}>Remove From My Books</Menu.Item>
  </Menu>
)

type BookCardProps = {
  bookId: string,
  title: string,
  authors: string,
  imageLink: string,
  removeBook: Function,
}
const BookCard: React.ReactNode = (props: BookCardProps) => (
  <Card
    size="small"
    style={{ width: 200, height: 350 }}
    hoverable
    cover={
      <img
        style={{width: 200, height: 280}}
        alt={`image_${props.id}`}
        src={props.imageLink}
      />
    }
    actions={[
      <Dropdown
        placement="topCenter"
        arrow
        overlay={
          <BookMenu bookId={props.bookId}
            removeBook={props.removeBook}
          />}>
        <EllipsisOutlined key="ellipsis" />
      </Dropdown>
    ]}
  >
    <Meta
      title={props.title}
      description={<Ellipsis length={15} tooltip>{props.authors}</Ellipsis>}
    />
  </Card>
)

const Books: React.FC<{}> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { books } = initialState || {};

  const removeBookUpdateState = async (bookId: string) => {
    await removeBook(bookId);
    const newUserBooks = books.filter(book => book.id !== bookId)
    setInitialState({ ...initialState, books: newUserBooks })
  }


  return (
    <PageContainer>
      <Row gutter={[32, 32]} style={exploreLayout}>
        {books.map(book => {
          const title = _.get(book, 'googleBook.volumeInfo.title', '')
          const authors = _.get(book, 'googleBook.volumeInfo.authors', ['Unknown Author']).toString(' ')
          const imageLink = _.get(book, 'googleBook.volumeInfo.imageLinks.thumbnail', '')
          return <Col key={book.id}>
            <BookCard
              bookId={book.id}
              title={title}
              authors={authors}
              imageLink={imageLink}
              removeBook={removeBookUpdateState}
            />
          </Col>
        })}
      </Row>
    </PageContainer>
  )
};

export default Books;
