import _ from 'lodash';
import React, { useState, FunctionComponent } from 'react';
import { Input, message, Card, Row, Col, Modal, Button } from 'antd';
import { useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

import { queryGoogleBooks, addBook, AddBookParams } from '@/services/books';
import { getGoogleBook } from '@/services/books';

const { Meta } = Card;

const exploreLayout = {
  'paddingTop': '30px',
  'paddingLeft': '30px',
  'paddingBottom': '30px',
}

const GoogleBookOpen: React.FC<{ bookRes: Object, toggleModal: FunctionComponent, open: boolean }> = ({ toggleModal, open, ...bookRes  }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { books } = initialState || {};
  
  const { data } = bookRes;
  const { title } = data.data.volumeInfo;
  const { id } = data.data;
  const { selfLink } = data.data;
  const values = {google_books_id: id, google_books_self_link: selfLink}
  const {subTitle} = _.get(data, 'data.volumeInfo.subtitle', '')
  const description = _.get(data, 'data.volumeInfo.description', '')
  const authors = _.get(data, 'data.volumeInfo.authors', ['Unknown Author']).toString(' ')

  const handleAddBook = async (values: AddBookParams) => {

    try {
      const res = await addBook({ ...values });
      if (_.get(res, 'id', false)) {
        const duplicateBook = books.filter(book => book.id === res.id)
        if (!duplicateBook.length) {
          res.googleBook = await getGoogleBook(res.id)
          books.push(res)
          setInitialState({ ...initialState, books: books })
        }
        message.success('Book added to shelf');
        return
      }
    } catch (error) {
      console.log(error)
      message.error('Failed to add book');
    }
  };

  return (
    <Modal
    title={title}
    visible={open}
    onOk={() => toggleModal()}
    onCancel={() => toggleModal()}
    footer={[
      <Button key="back" onClick={() => toggleModal()}>
        Return
      </Button>,
      <Button key="submit" type="primary" onClick={() => handleAddBook(values) && toggleModal() }>
        Add Book
      </Button>,
    ]}
    >
      <h1>{subTitle}</h1>
      <p>{description}</p>
      <p>By: {authors} </p>
    </Modal>
  )
}



const GoogleBookResult: React.FC<{ bookRes: Object }> = ({ ...bookRes }) => {
  const [showModal, setShowModal] = useState(false);
  const { data } = bookRes;
  const imageLink = _.get(data, 'volumeInfo.imageLinks.thumbnail', '')
  const {title} = data.volumeInfo;
  const authors = _.get(data, 'volumeInfo.authors', ['Unknown Author']).toString(' ')

  const toggleModal = (): void => setShowModal(!showModal)
  

  return (
    <>
      <Card
        size="small"
        style={{ width: 200, height: 350 }}
        hoverable
        cover={
          <img
            style={{width: 200, height: 280}}
            alt="example"
            src={imageLink}
          />
        }
        onClick={() => setShowModal(true)}
      >
        <Meta
          title={title}
          description={<Ellipsis length={15} tooltip>{authors}</Ellipsis>}
        />
      </Card>
        {showModal && <GoogleBookOpen data={bookRes} toggleModal={toggleModal} open={showModal} />}
    </>  
  )
}


const SearchComponent: React.FC<{}> = () => {
  const { Search } = Input;

  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async (query: String) => {
    setSearching(true);
    try {
    const results = await queryGoogleBooks(query);
    if (_.get(results, 'volumes', false)) {
      setSearchResults(results.volumes)
    }
    } catch (error) {
      message.error('Unable to fetch books');
    }
    setSearching(false);
  };
  return (
    <PageContainer>
      <Search
        placeholder="Search by book title"
        enterButton="Search"
        size="large"
        onSearch={query => handleSearch(query)}
        loading={searching}
      />
      <Row gutter={[32, 32]} style={exploreLayout}>
        {searchResults.map(res => {
          return <Col key={res.id}><GoogleBookResult data={res}/></Col>
        })}
      </Row>
    

    </PageContainer>
  );
}

export default SearchComponent;
