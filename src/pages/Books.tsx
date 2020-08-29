import React, { useEffect, useState, } from 'react';
import _ from 'lodash';
import { SettingOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Link } from 'umi';
import { Card, Row, Col, Menu, Dropdown } from 'antd';
import { getGoogleBook, removeBook } from '@/services/books';
import { queryCurrent } from '@/services/user';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

const { Meta } = Card;

const exploreLayout = {
  'paddingTop': '30px',
  'paddingLeft': '30px',
  'paddingBottom': '30px',
}


type BookMenuProps = {
  wellReadId: string,
  googleBooksId: string,
  removeBook: Function,
}
const BookMenu: React.ReactNode = (props: BookMenuProps) => (
  <Menu style={{ 'backgroundColor': '#fafafa' }}>
    <Menu.Item danger onClick={() => props.removeBook(props.wellReadId, props.googleBooksId)}>Remove From My Books</Menu.Item>
  </Menu>
)

type BookCardProps = {
  wellReadId: string,
  googleBooksId: string,
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
          <BookMenu wellReadId={props.wellReadId}
            googleBooksId={props.googleBooksId}
            removeBook={props.removeBook}
          />}>
        <SettingOutlined key="setting" />
      </Dropdown>
    ]}
  >
    <Meta
      title={props.title}
      description={<Ellipsis length={15} tooltip>{props.authors}</Ellipsis>}
    />
  </Card>
)

const NewBook: React.ReactNode = () => (
  <Link to="/books/new">
    <Card
      size="small"
      style={{ width: 200, height: 350 }}
      hoverable
      cover={
        <img
          style={{width: 200, height: 280}}
          alt="example"
          src="https://icons.iconarchive.com/icons/thalita-torres/office/1024/school-book-icon.png"
        />
      }
      actions={[
        <PlusCircleOutlined key="add" />,
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
  const [userBooks, setUserBooks] = useState([])
  const [googleBooks, setGoogleBooks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const currentUser = await queryCurrent()
      setUserBooks(currentUser.books)
      await currentUser.books.map(async (book) => {
        const newBook = await getGoogleBook(book.id)
        newBook['wellReadId'] = book.id
        setGoogleBooks(prev => [...prev, newBook])
      })
    }
    fetchData();
  }, []);

  const removeBookUpdateState = async (wellReadId: string, googleBookId: string) => {
    await removeBook(wellReadId);
    const newUserBooks = userBooks.filter(book => book.id !== wellReadId)
    setUserBooks(newUserBooks)
    const newGoogleBooks = googleBooks.filter(book => book.id !== googleBookId)
    setGoogleBooks(newGoogleBooks)
  }


  return (
    <PageContainer>
      <Row gutter={[32, 32]} style={exploreLayout}>
        <Col><NewBook /></Col>
        {googleBooks.map(book => {
          const title = _.get(book, 'volumeInfo.title', '')
          const authors = _.get(book, 'volumeInfo.authors', ['Unknown Author']).toString(' ')
          const imageLink = _.get(book, 'volumeInfo.imageLinks.thumbnail', '')
          return <Col key={book.id}>
            <BookCard
              wellReadId={book.wellReadId}
              googleBooksId={book.id}
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
